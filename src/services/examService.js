const prisma = require('../config/prismaClient');
const examRepository = require('../repositories/examRepository');

class ExamService {
  generateExamCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 цифр
  }

  async createExam(title, description, teacherId) {
    const examCode = this.generateExamCode();
    return prisma.exam.create({
      data: { title, description, teacherId, examCode },
    });
  }

  async getExamsByTeacher(teacherId) {
    return await examRepository.findAllByTeacher(teacherId);
  }

  async getExamById(examId) {
    return await examRepository.findById(examId);
  }

  async updateExam(examId, user, data) {
    const exam = await examRepository.findById(examId);
    if (!exam) throw new Error('Exam not found');

    if (exam.teacherId !== user.id && user.role !== 'ADMIN') {
      throw new Error('Access denied');
    }

    return examRepository.update(examId, data);
  }

  async deleteExam(examId, user) {
    const exam = await examRepository.findById(examId);
    if (!exam) throw new Error('Exam not found');

    if (exam.teacherId !== user.id && user.role !== 'ADMIN') {
      throw new Error('Access denied');
    }

    return await examRepository.delete(examId);
  }
}

module.exports = new ExamService();
