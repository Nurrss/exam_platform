const prisma = require('../config/prismaClient');
const sessionRepository = require('../repositories/sessionRepository');
const answerRepository = require('../repositories/answerRepository');
const { arraysEqualAsSets } = require('../utils/gradeUtils');

class SessionService {
  async joinExam(studentId, examCode) {
    const exam = await prisma.exam.findUnique({ where: { examCode } });
    if (!exam || exam.status !== 'PUBLISHED') {
      throw new Error('Exam not found or not published');
    }

    const existing = await sessionRepository.findActiveSession(
      studentId,
      exam.id
    );
    if (existing) return existing;

    return await sessionRepository.createSession(studentId, exam);
  }

  async getSessionDetails(sessionId, studentId) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) throw new Error('Session not found');
    if (session.studentId !== studentId) throw new Error('Access denied');

    const questions = await prisma.question.findMany({
      where: { examId: session.examId },
      select: { id: true, text: true, type: true, options: true },
    });

    return { session, questions };
  }

  async saveAnswer(sessionId, studentId, questionId, response) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) throw new Error('Session not found');
    if (session.studentId !== studentId) throw new Error('Access denied');
    if (session.status !== 'ACTIVE') throw new Error('Session not active');

    return await answerRepository.saveAnswer(sessionId, questionId, response);
  }

  async finishSession(sessionId, studentId) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) throw new Error('Session not found');
    if (session.studentId !== studentId) throw new Error('Access denied');

    const answers = await answerRepository.findBySession(sessionId);
    const questions = await prisma.question.findMany({
      where: { examId: session.examId },
      select: { id: true, correct: true },
    });

    const questionMap = new Map(questions.map((q) => [q.id, q.correct]));
    let correctCount = 0;

    for (const ans of answers) {
      const correctAnswer = questionMap.get(ans.questionId);
      let isCorrect = false;

      if (Array.isArray(correctAnswer)) {
        isCorrect = arraysEqualAsSets(ans.response, correctAnswer);
      } else {
        isCorrect =
          JSON.stringify(ans.response) === JSON.stringify(correctAnswer);
      }

      if (isCorrect) correctCount++;

      await answerRepository.updateIsCorrect(ans.id, isCorrect);
    }

    const score = questions.length
      ? (correctCount / questions.length) * 100
      : 0;
    return await sessionRepository.finishSession(sessionId, score);
  }
}

module.exports = new SessionService();
