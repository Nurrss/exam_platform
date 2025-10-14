const questionRepository = require('../repositories/questionRepository');
const prisma = require('../config/prismaClient');

class QuestionService {
  async createQuestion(examId, user, data) {
    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
    });
    if (!exam) throw new Error('Экзамен не найден');

    if (user.role !== 'ADMIN' && exam.teacherId !== user.id)
      throw new Error('Нет прав для добавления вопросов');

    return questionRepository.create({ ...data, examId: Number(examId) });
  }

  async getQuestionsByExam(examId, user) {
    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
    });
    if (!exam) throw new Error('Экзамен не найден');

    if (user.role !== 'ADMIN' && exam.teacherId !== user.id)
      throw new Error('Нет прав для просмотра вопросов');

    return questionRepository.findByExam(Number(examId));
  }

  async getQuestionsForStudent(examId) {
    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
    });
    if (!exam) throw new Error('Экзамен не найден');

    const questions = await questionRepository.findByExam(Number(examId));
    // Убираем правильные ответы
    return questions.map((q) => ({
      id: q.id,
      examId: q.examId,
      text: q.text,
      type: q.type,
      options: q.options,
    }));
  }

  async updateQuestion(id, user, data) {
    const question = await questionRepository.findById(Number(id));
    if (!question) throw new Error('Вопрос не найден');

    const exam = await prisma.exam.findUnique({
      where: { id: question.examId },
    });

    if (user.role !== 'ADMIN' && exam.teacherId !== user.id)
      throw new Error('Нет прав для обновления вопроса');

    return questionRepository.update(Number(id), data);
  }

  async deleteQuestion(id, user) {
    const question = await questionRepository.findById(Number(id));
    if (!question) throw new Error('Вопрос не найден');

    const exam = await prisma.exam.findUnique({
      where: { id: question.examId },
    });

    if (user.role !== 'ADMIN' && exam.teacherId !== user.id)
      throw new Error('Нет прав для удаления вопроса');

    return questionRepository.delete(Number(id));
  }
}

module.exports = new QuestionService();
