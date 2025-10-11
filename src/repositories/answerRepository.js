const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AnswerRepository {
  async saveAnswer(sessionId, questionId, response) {
    return await prisma.answer.upsert({
      where: { sessionId_questionId: { sessionId, questionId } },
      update: { response },
      create: { sessionId, questionId, response },
    });
  }

  async getAnswersBySession(sessionId) {
    return await prisma.answer.findMany({ where: { sessionId } });
  }
}

module.exports = new AnswerRepository();
