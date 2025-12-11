const prisma = require('../config/prismaClient');

class SessionRepository {
  async create(data) {
    return prisma.examSession.create({ data });
  }

  async findByStudent(studentId, options = {}) {
    const { skip, take } = options;
    return prisma.examSession.findMany({
      where: { studentId },
      include: { exam: true },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countByStudent(studentId) {
    return prisma.examSession.count({ where: { studentId } });
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

  async findByExam(examId, options = {}) {
    const { skip, take, where: additionalWhere } = options;
    const where = { examId: Number(examId), ...additionalWhere };
    return prisma.examSession.findMany({
      where,
      include: { student: true },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countByExam(examId, additionalWhere = {}) {
    return prisma.examSession.count({
      where: { examId: Number(examId), ...additionalWhere },
    });
  }
}

module.exports = new SessionRepository();
