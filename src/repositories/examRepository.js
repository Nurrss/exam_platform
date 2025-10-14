const prisma = require('../config/prismaClient');

class ExamRepository {
  async findAllByTeacher(teacherId) {
    try {
      return await prisma.exam.findMany({
        where: { teacherId },
        select: { id: true, title: true, examCode: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch (err) {
      console.error('❌ Error in findAllByTeacher:', err);
      throw new Error('Ошибка при получении экзаменов');
    }
  }

  async findById(id) {
    try {
      return await prisma.exam.findUnique({
        where: { id },
        include: { questions: true },
      });
    } catch (err) {
      console.error('❌ Error in findById:', err);
      throw new Error('Ошибка при поиске экзамена');
    }
  }

  async update(id, data) {
    try {
      return await prisma.exam.update({ where: { id }, data });
    } catch (err) {
      console.error('❌ Error in update exam:', err);
      throw new Error('Ошибка при обновлении экзамена');
    }
  }

  async delete(id) {
    try {
      return await prisma.exam.delete({ where: { id } });
    } catch (err) {
      console.error('❌ Error in delete exam:', err);
      throw new Error('Ошибка при удалении экзамена');
    }
  }

  async findByCode(examCode) {
    try {
      return await prisma.exam.findUnique({ where: { examCode } });
    } catch (err) {
      console.error('❌ Error in findByCode:', err);
      throw new Error('Ошибка при поиске экзамена по коду');
    }
  }
}

module.exports = new ExamRepository();
