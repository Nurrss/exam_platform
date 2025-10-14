const prisma = require('../config/prismaClient');

class AnswerRepository {
  async saveAnswer(sessionId, questionId, response) {
    try {
      return await prisma.answer.upsert({
        where: { sessionId_questionId: { sessionId, questionId } },
        update: { response },
        create: { sessionId, questionId, response },
      });
    } catch (err) {
      console.error('❌ Error in saveAnswer:', err);
      throw new Error('Ошибка при сохранении ответа');
    }
  }

  async updateIsCorrect(answerId, isCorrect) {
    try {
      return await prisma.answer.update({
        where: { id: answerId },
        data: { isCorrect },
      });
    } catch (err) {
      console.error('❌ Error in updateIsCorrect:', err);
      throw new Error('Ошибка при обновлении правильности ответа');
    }
  }

  async findBySession(sessionId) {
    try {
      return await prisma.answer.findMany({
        where: { sessionId },
      });
    } catch (err) {
      console.error('❌ Error in findBySession:', err);
      throw new Error('Ошибка при получении ответов сессии');
    }
  }
}

module.exports = new AnswerRepository();
