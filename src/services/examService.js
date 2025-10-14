const prisma = require('../config/prismaClient');
const examRepository = require('../repositories/examRepository');
const { nanoid } = require('nanoid');

class ExamService {
  generateExamCode() {
    return nanoid(8).toUpperCase();
  }

  async createExam(title, description, teacherId) {
    try {
      const examCode = this.generateExamCode();

      const exam = await prisma.exam.create({
        data: { title, description, teacherId, examCode },
      });

      return exam;
    } catch (err) {
      console.error('❌ [createExam] Ошибка:', err);
      throw new Error('Ошибка при создании экзамена');
    }
  }

  async getExamsByTeacher(teacherId) {
    try {
      return await examRepository.findAllByTeacher(teacherId);
    } catch (err) {
      console.error('❌ [getExamsByTeacher] Ошибка:', err);
      throw new Error('Ошибка при получении списка экзаменов');
    }
  }

  async getExamById(examId) {
    try {
      const exam = await examRepository.findById(examId);
      if (!exam) throw new Error('Экзамен не найден');
      return exam;
    } catch (err) {
      console.error('❌ [getExamById] Ошибка:', err);
      throw new Error('Ошибка при получении экзамена');
    }
  }

  async updateExam(examId, user, data) {
    try {
      const exam = await examRepository.findById(examId);
      if (!exam) throw new Error('Экзамен не найден');

      if (exam.teacherId !== user.id && user.role !== 'ADMIN') {
        throw new Error('Доступ запрещён');
      }

      return await examRepository.update(examId, data);
    } catch (err) {
      console.error('❌ [updateExam] Ошибка:', err);
      throw new Error('Ошибка при обновлении экзамена');
    }
  }

  async deleteExam(examId, user) {
    try {
      const exam = await examRepository.findById(examId);
      if (!exam) throw new Error('Экзамен не найден');

      if (exam.teacherId !== user.id && user.role !== 'ADMIN') {
        throw new Error('Доступ запрещён');
      }

      return await examRepository.delete(examId);
    } catch (err) {
      console.error('❌ [deleteExam] Ошибка:', err);
      throw new Error('Ошибка при удалении экзамена');
    }
  }

  async findByCode(examCode) {
    try {
      return await prisma.exam.findUnique({ where: { examCode } });
    } catch (err) {
      console.error('❌ [findByCode] Ошибка:', err);
      throw new Error('Ошибка при поиске экзамена по коду');
    }
  }
}

module.exports = new ExamService();
