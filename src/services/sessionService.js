const sessionRepository = require('../repositories/sessionRepository');
const answerRepository = require('../repositories/answerRepository');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SessionService {
  async joinExam(studentId, examPassword) {
    const exam = await prisma.exam.findFirst({
      where: { examPassword, status: 'PUBLISHED' },
    });
    if (!exam) throw new Error('Exam not found or not published');

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

    return await sessionRepository.finishSession(sessionId);
  }
}

module.exports = new SessionService();
