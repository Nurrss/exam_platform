const examRepository = require('../repositories/examRepository');
const prisma = require('../config/prismaClient');

class ExamService {
  async createExam(teacherId, data) {
    return await examRepository.create({ ...data, teacherId });
  }

  async getMyExams(userId) {
    return await examRepository.findByTeacher(userId);
  }

  async getExamById(examId, user) {
    const exam = await examRepository.findById(examId);
    if (!exam) throw new Error('Экзамен не найден');

    if (user.role === 'STUDENT') {
      const session = await prisma.examSession.findFirst({
        where: { examId: exam.id, studentId: user.id },
      });
      if (!session) throw new Error('Нет доступа к этому экзамену');
    }
    return exam;
  }

  async updateExam(examId, user, data) {
    const exam = await examRepository.findById(examId);
    if (!exam) throw new Error('Экзамен не найден');

    if (user.role !== 'ADMIN' && exam.teacherId !== user.id)
      throw new Error('Нет прав для изменения экзамена');

    return await examRepository.update(examId, data);
  }

  async deleteExam(examId, user) {
    const exam = await examRepository.findById(examId);
    if (!exam) throw new Error('Экзамен не найден');

    if (user.role !== 'ADMIN' && exam.teacherId !== user.id)
      throw new Error('Нет прав для удаления экзамена');

    return await examRepository.delete(examId);
  }

  async joinExam(studentId, examCode) {
    const exam = await examRepository.findByCode(examCode);
    if (!exam) throw new Error('Экзамен с таким кодом не найден');

    const session = await prisma.examSession.create({
      data: { examId: exam.id, studentId },
    });
    return session;
  }

  async getAllExams() {
    return await examRepository.findAll();
  }

  async getExamByCode(examCode) {
    const exam = await examRepository.findByCode(examCode);
    if (!exam) throw new Error('Экзамен не найден');
    return exam;
  }
}

module.exports = new ExamService();
