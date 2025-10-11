const prisma = require('../config/prismaClient');

class ExamRepository {
  async create({ title, description, examPassword, teacherId }) {
    return prisma.exam.create({
      data: {
        title,
        description,
        examPassword,
        teacherId,
      },
    });
  }

  async findById(id) {
    return prisma.exam.findUnique({
      where: { id },
      include: { questions: true },
    });
  }

  async findAllByTeacher(teacherId) {
    return prisma.exam.findMany({
      where: { teacherId },
      include: { questions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id, data) {
    return prisma.exam.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.exam.delete({
      where: { id },
    });
  }
}

module.exports = new ExamRepository();
