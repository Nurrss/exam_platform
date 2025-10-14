const prisma = require('../config/prismaClient');

class SessionRepository {
  async createSession(studentId, exam) {
    try {
      return await prisma.examSession.create({
        data: {
          studentId,
          examId: exam.id,
          status: 'ACTIVE',
          startedAt: new Date(),
        },
        include: { exam: true },
      });
    } catch (err) {
      console.error('❌ Error in createSession:', err);
      throw new Error('Ошибка при создании сессии');
    }
  }

  async findActiveSession(studentId, examId) {
    try {
      return await prisma.examSession.findFirst({
        where: { studentId, examId, status: 'ACTIVE' },
        include: { exam: true },
      });
    } catch (err) {
      console.error('❌ Error in findActiveSession:', err);
      throw new Error('Ошибка при поиске активной сессии');
    }
  }

  async findById(sessionId) {
    try {
      return await prisma.examSession.findUnique({
        where: { id: sessionId },
        include: { exam: true },
      });
    } catch (err) {
      console.error('❌ Error in findById:', err);
      throw new Error('Ошибка при поиске сессии');
    }
  }

  async finishSession(sessionId, score) {
    try {
      return await prisma.examSession.update({
        where: { id: sessionId },
        data: {
          finishedAt: new Date(),
          status: 'COMPLETED',
          score,
        },
        include: { exam: true },
      });
    } catch (err) {
      console.error('❌ Error in finishSession:', err);
      throw new Error('Ошибка при завершении сессии');
    }
  }
}

module.exports = new SessionRepository();
