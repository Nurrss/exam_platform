const prisma = require('../config/prismaClient');
const sessionRepository = require('../repositories/sessionRepository');
const answerRepository = require('../repositories/answerRepository');
const { arraysEqualAsSets } = require('../utils/gradeUtils');

class SessionService {
  async joinExam(studentId, examCode) {
    try {
      const exam = await prisma.exam.findUnique({ where: { examCode } });
      if (!exam || exam.status !== 'PUBLISHED') {
        throw new Error('Экзамен не найден или не опубликован');
      }

      const existing = await sessionRepository.findActiveSession(
        studentId,
        exam.id
      );
      if (existing) return existing;

      return await sessionRepository.createSession(studentId, exam);
    } catch (err) {
      console.error('❌ [joinExam] Ошибка:', err);
      throw new Error('Ошибка при подключении к экзамену');
    }
  }

  async getSessionDetails(sessionId, studentId) {
    try {
      const session = await sessionRepository.findById(sessionId);
      if (!session) throw new Error('Сессия не найдена');
      if (session.studentId !== studentId) throw new Error('Доступ запрещён');

      const questions = await prisma.question.findMany({
        where: { examId: session.examId },
        select: { id: true, text: true, type: true, options: true },
      });

      return { session, questions };
    } catch (err) {
      console.error('❌ [getSessionDetails] Ошибка:', err);
      throw new Error('Ошибка при получении данных сессии');
    }
  }

  async saveAnswer(sessionId, studentId, questionId, response) {
    try {
      const session = await sessionRepository.findById(sessionId);
      if (!session) throw new Error('Сессия не найдена');
      if (session.studentId !== studentId) throw new Error('Доступ запрещён');
      if (session.status !== 'ACTIVE') throw new Error('Сессия не активна');

      return await answerRepository.saveAnswer(sessionId, questionId, response);
    } catch (err) {
      console.error('❌ [saveAnswer] Ошибка:', err);
      throw new Error('Ошибка при сохранении ответа');
    }
  }

  async finishSession(sessionId, studentId) {
    try {
      const session = await sessionRepository.findById(sessionId);
      if (!session) throw new Error('Сессия не найдена');
      if (session.studentId !== studentId) throw new Error('Доступ запрещён');

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
    } catch (err) {
      console.error('❌ [finishSession] Ошибка:', err);
      throw new Error('Ошибка при завершении сессии');
    }
  }
}

module.exports = new SessionService();
