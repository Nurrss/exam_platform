const questionRepository = require('../repositories/questionRepository');
const examRepository = require('../repositories/examRepository');

class QuestionService {
  async addQuestion(examId, teacherId, text, type, options, correct) {
    const exam = await examRepository.findById(examId);
    if (!exam) throw new Error('Exam not found');
    if (exam.teacherId !== teacherId)
      throw new Error('Access denied: not your exam');

    return await questionRepository.create(
      examId,
      text,
      type,
      options,
      correct
    );
  }

  async getQuestions(examId, teacherId) {
    const exam = await examRepository.findById(examId);
    if (!exam) throw new Error('Exam not found');
    if (exam.teacherId !== teacherId)
      throw new Error('Access denied: not your exam');

    return await questionRepository.getByExam(examId);
  }

  async updateQuestion(questionId, teacherId, data) {
    const question = await questionRepository.getById(questionId);
    if (!question) throw new Error('Question not found');

    const exam = await examRepository.findById(question.examId);
    if (exam.teacherId !== teacherId)
      throw new Error('Access denied: not your exam');

    return await questionRepository.update(questionId, data);
  }

  async deleteQuestion(questionId, teacherId) {
    const question = await questionRepository.getById(questionId);
    if (!question) throw new Error('Question not found');

    const exam = await examRepository.findById(question.examId);
    if (exam.teacherId !== teacherId)
      throw new Error('Access denied: not your exam');

    return await questionRepository.delete(questionId);
  }
}

module.exports = new QuestionService();
