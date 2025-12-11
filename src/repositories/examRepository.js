const prisma = require('../config/prismaClient');

class ExamRepository {
  async create(data) {
    return prisma.exam.create({ data });
  }

  async findByTeacher(teacherId, options = {}) {
    const { skip, take } = options;
    return prisma.exam.findMany({
      where: { teacherId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countByTeacher(teacherId) {
    return prisma.exam.count({ where: { teacherId } });
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

  async findAll(options = {}) {
    const { skip, take, where } = options;
    return prisma.exam.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(where = {}) {
    return prisma.exam.count({ where });
  }
}

module.exports = new ExamRepository();
