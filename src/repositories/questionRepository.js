const prisma = require('../config/prismaClient');

class QuestionRepository {
  async create(examId, text, type, options, correct) {
    try {
      return await prisma.question.create({
        data: { examId, text, type, options, correct },
      });
    } catch (err) {
      console.error('❌ Error in createQuestion:', err);
      throw new Error('Ошибка при создании вопроса');
    }
  }

  async getByExam(examId) {
    try {
      return await prisma.question.findMany({
        where: { examId },
        orderBy: { id: 'asc' },
      });
    } catch (err) {
      console.error('❌ Error in getByExam:', err);
      throw new Error('Ошибка при получении вопросов экзамена');
    }
  }

  async getById(id) {
    try {
      return await prisma.question.findUnique({ where: { id } });
    } catch (err) {
      console.error('❌ Error in getById:', err);
      throw new Error('Ошибка при поиске вопроса');
    }
  }

  async update(id, data) {
    try {
      return await prisma.question.update({ where: { id }, data });
    } catch (err) {
      console.error('❌ Error in updateQuestion:', err);
      throw new Error('Ошибка при обновлении вопроса');
    }
  }

  async delete(id) {
    try {
      return await prisma.question.delete({ where: { id } });
    } catch (err) {
      console.error('❌ Error in deleteQuestion:', err);
      throw new Error('Ошибка при удалении вопроса');
    }
  }
}

module.exports = new QuestionRepository();
