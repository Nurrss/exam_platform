const questionRepository = require('../repositories/questionRepository');
const examRepository = require('../repositories/examRepository');

class QuestionService {
  async addQuestion(examId, teacherId, text, type, options, correct) {
    try {
      const exam = await examRepository.findById(examId);
      if (!exam) throw new Error('Экзамен не найден');
      if (exam.teacherId !== teacherId)
        throw new Error('Доступ запрещён: это не ваш экзамен');

      return await questionRepository.create(
        examId,
        text,
        type,
        options,
        correct
      );
    } catch (err) {
      console.error('❌ [addQuestion] Ошибка:', err);
      throw new Error('Ошибка при добавлении вопроса');
    }
  }

  async getQuestions(examId, teacherId) {
    try {
      const exam = await examRepository.findById(examId);
      if (!exam) throw new Error('Экзамен не найден');
      if (exam.teacherId !== teacherId)
        throw new Error('Доступ запрещён: это не ваш экзамен');

      return await questionRepository.getByExam(examId);
    } catch (err) {
      console.error('❌ [getQuestions] Ошибка:', err);
      throw new Error('Ошибка при получении списка вопросов');
    }
  }

  async updateQuestion(questionId, teacherId, data) {
    try {
      const question = await questionRepository.getById(questionId);
      if (!question) throw new Error('Вопрос не найден');

      const exam = await examRepository.findById(question.examId);
      if (exam.teacherId !== teacherId)
        throw new Error('Доступ запрещён: это не ваш экзамен');

      return await questionRepository.update(questionId, data);
    } catch (err) {
      console.error('❌ [updateQuestion] Ошибка:', err);
      throw new Error('Ошибка при обновлении вопроса');
    }
  }

  async deleteQuestion(questionId, teacherId) {
    try {
      const question = await questionRepository.getById(questionId);
      if (!question) throw new Error('Вопрос не найден');

      const exam = await examRepository.findById(question.examId);
      if (exam.teacherId !== teacherId)
        throw new Error('Доступ запрещён: это не ваш экзамен');

      return await questionRepository.delete(questionId);
    } catch (err) {
      console.error('❌ [deleteQuestion] Ошибка:', err);
      throw new Error('Ошибка при удалении вопроса');
    }
  }
}

module.exports = new QuestionService();
