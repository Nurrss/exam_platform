const prisma = require('../config/prismaClient');

class SessionRepository {
  async create(data) {
    return prisma.examSession.create({ data });
  }

  async findByStudent(studentId) {
    return prisma.examSession.findMany({
      where: { studentId },
      include: { exam: true },
    });
  }

  async findById(id) {
    return prisma.examSession.findUnique({
      where: { id: Number(id) },
      include: { answers: true },
    });
  }

  async submitAnswer(sessionId, questionId, response) {
    const existing = await prisma.answer.findFirst({
      where: { sessionId: Number(sessionId), questionId: Number(questionId) },
    });

    if (existing) {
      return prisma.answer.update({
        where: { id: existing.id },
        data: { response },
      });
    }

    return prisma.answer.create({
      data: {
        sessionId: Number(sessionId),
        questionId: Number(questionId),
        response,
      },
    });
  }

  async findAnswers(sessionId) {
    return prisma.answer.findMany({ where: { sessionId: Number(sessionId) } });
  }

  async update(sessionId, data) {
    return prisma.examSession.update({
      where: { id: Number(sessionId) },
      data,
    });
  }

  async findByExam(examId) {
    return prisma.examSession.findMany({
      where: { examId: Number(examId) },
      include: { student: true },
    });
  }
}

module.exports = new SessionRepository();
