const prisma = require('../config/prismaClient');

class ExamRepository {
  async create(data) {
    return prisma.exam.create({ data });
  }

  async findByTeacher(teacherId) {
    return prisma.exam.findMany({ where: { teacherId } });
  }

  async findById(id) {
    return prisma.exam.findUnique({ where: { id: Number(id) } });
  }

  async update(id, data) {
    return prisma.exam.update({ where: { id: Number(id) }, data });
  }

  async delete(id) {
    return prisma.exam.delete({ where: { id: Number(id) } });
  }

  async findByCode(examCode) {
    return prisma.exam.findUnique({ where: { examCode } });
  }

  async findAll() {
    return prisma.exam.findMany();
  }
}

module.exports = new ExamRepository();
