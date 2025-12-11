const { Prisma } = require('@prisma/client');
const sessionRepository = require('../repositories/sessionRepository');
const prisma = require('../config/prismaClient');

class SessionService {
  async joinExam(studentId, examCode) {
    const exam = await prisma.exam.findUnique({ where: { examCode } });
    if (!exam) throw new Error('Экзамен не найден');

    const existing = await prisma.examSession.findFirst({
      where: { studentId, examId: exam.id },
    });
    if (existing && existing.status !== Prisma.SessionStatus.COMPLETED) {
      throw new Error('Вы уже участвуете в этом экзамене');
    }

    const session = await sessionRepository.create({
      examId: exam.id,
      studentId,
      status: Prisma.SessionStatus.ACTIVE,
      startedAt: new Date(),
    });
    return session;
  }

  async getMySessions(studentId, paginationOptions = {}) {
    const { skip, take } = paginationOptions;
    const sessions = await sessionRepository.findByStudent(studentId, { skip, take });

    return sessions.map((s) => ({
      id: s.id,
      examTitle: s.exam.title,
      status: s.status,
      score: s.score,
      startedAt: s.startedAt,
      finishedAt: s.finishedAt,
    }));
  }

  async countMySessions(studentId) {
    return sessionRepository.countByStudent(studentId);
  }

  async getSessionById(sessionId, user) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) throw new Error('Сессия не найдена');

    if (user.role === 'STUDENT' && session.studentId !== user.id)
      throw new Error('Нет доступа к этой сессии');

    return session;
  }

  async submitAnswer(sessionId, studentId, { questionId, response }) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) throw new Error('Сессия не найдена');
    if (session.studentId !== studentId) throw new Error('Нет доступа');

    if (session.locked) {
      throw new Error('Сессия заблокирована. Дождитесь разрешения учителя.');
    }

    if (session.lockedUntil && new Date() < new Date(session.lockedUntil)) {
      throw new Error(
        'Вы временно заблокированы. Подождите окончания блокировки.'
      );
    }

    return sessionRepository.submitAnswer(sessionId, questionId, response);
  }

  async finishExam(sessionId, studentId) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) throw new Error('Сессия не найдена');
    if (session.studentId !== studentId) throw new Error('Нет доступа');

    if (session.status === Prisma.SessionStatus.COMPLETED) {
      throw new Error('Экзамен уже завершён');
    }

    const answers = await sessionRepository.findAnswers(sessionId);

    let score = 0;
    for (const ans of answers) {
      const question = await prisma.question.findUnique({
        where: { id: ans.questionId },
      });
      if (
        question.correct &&
        JSON.stringify(ans.response) === JSON.stringify(question.correct)
      ) {
        score += 1;
      }
    }

    return sessionRepository.update(sessionId, {
      status: Prisma.SessionStatus.COMPLETED,
      finishedAt: new Date(),
      score,
    });
  }

  async getResult(sessionId, user) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) throw new Error('Сессия не найдена');

    if (user.role === 'STUDENT' && session.studentId !== user.id)
      throw new Error('Нет доступа к результату');

    return session;
  }

  async getExamSessions(examId, user, paginationOptions = {}) {
    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
    });
    if (!exam) throw new Error('Экзамен не найден');

    if (user.role !== 'ADMIN' && exam.teacherId !== user.id)
      throw new Error('Нет доступа к сессиям');

    const { skip, take, where } = paginationOptions;
    return sessionRepository.findByExam(examId, { skip, take, where });
  }

  async countExamSessions(examId, where = {}) {
    return sessionRepository.countByExam(examId, where);
  }
}

module.exports = new SessionService();
