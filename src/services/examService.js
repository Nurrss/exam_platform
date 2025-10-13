const examRepository = require('../repositories/examRepository');
const { nanoid } = require('nanoid');

class ExamService {
  async createExam(title, description, teacherId) {
    const examPassword = nanoid(6);
    return await examRepository.create({
      title,
      description,
      examPassword,
      teacherId,
    });
  }

  async getExamsByTeacher(teacherId) {
    return await examRepository.findAllByTeacher(teacherId);
  }

  async getExamById(examId) {
    return await examRepository.findById(examId);
  }

  async updateExam(examId, teacherId, data) {
    const exam = await examRepository.findById(examId);
    if (!exam) throw new Error('Exam not found');
    if (exam.teacherId !== teacherId && teacherId.role !== 'ADMIN')
      throw new Error('Access denied');
    return examRepository.update(examId, data);
  }

  async deleteExam(examId) {
    return await examRepository.delete(examId);
  }
}

module.exports = new ExamService();
