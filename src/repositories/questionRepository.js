const prisma = require('../config/prismaClient');

class QuestionRepository {
  async create(examId, text, type, options, correct) {
    return prisma.question.create({
      data: {
        examId,
        text,
        type,
        options,
        correct,
      },
    });
  }

  async getByExam(examId) {
    return prisma.question.findMany({
      where: { examId },
      orderBy: { id: 'asc' },
    });
  }

  async getById(id) {
    return prisma.question.findUnique({
      where: { id },
    });
  }

  async update(id, data) {
    return prisma.question.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.question.delete({
      where: { id },
    });
  }
}

module.exports = new QuestionRepository();
