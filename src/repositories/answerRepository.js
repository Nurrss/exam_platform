const prisma = require('../config/prismaClient');

class AnswerRepository {
  async saveAnswer(sessionId, questionId, response) {
    return await prisma.answer.upsert({
      where: { sessionId_questionId: { sessionId, questionId } },
      update: { response },
      create: { sessionId, questionId, response },
    });
  }

  async updateIsCorrect(answerId, isCorrect) {
    return prisma.answer.update({
      where: { id: answerId },
      data: { isCorrect },
    });
  }

  async findBySession(sessionId) {
    return await prisma.answer.findMany({
      where: { sessionId },
    });
  }
}

module.exports = new AnswerRepository();
