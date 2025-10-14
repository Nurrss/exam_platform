const prisma = require('../config/prismaClient');

class SessionRepository {
  async createSession(studentId, exam) {
    return await prisma.examSession.create({
      data: {
        studentId,
        examId: exam.id,
        status: 'ACTIVE',
        startedAt: new Date(),
      },
      include: {
        exam: true,
      },
    });
  }

  async findActiveSession(studentId, examId) {
    return await prisma.examSession.findFirst({
      where: {
        studentId,
        examId,
        status: 'ACTIVE',
      },
      include: {
        exam: true,
      },
    });
  }

  async findById(sessionId) {
    return await prisma.examSession.findUnique({
      where: { id: sessionId },
      include: { exam: true },
    });
  }

  async finishSession(sessionId, score) {
    return await prisma.examSession.update({
      where: { id: sessionId },
      data: {
        finishedAt: new Date(),
        status: 'COMPLETED',
        score,
      },
      include: { exam: true },
    });
  }
}

module.exports = new SessionRepository();
