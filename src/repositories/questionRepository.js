const prisma = require('../config/prismaClient');

class QuestionRepository {
  async create(data) {
    return prisma.question.create({ data });
  }

  async findByExam(examId) {
    return prisma.question.findMany({ where: { examId: Number(examId) } });
  }

  async findById(id) {
    return prisma.question.findUnique({ where: { id: Number(id) } });
  }

  async update(id, data) {
    return prisma.question.update({ where: { id: Number(id) }, data });
  }

  async delete(id) {
    return prisma.question.delete({ where: { id: Number(id) } });
  }
}

module.exports = new QuestionRepository();
