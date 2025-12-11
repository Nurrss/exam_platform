const { Prisma } = require('@prisma/client');
const sessionRepository = require('../repositories/sessionRepository');
const prisma = require('../config/prismaClient');

class SessionService {
  /**
   * Check if session time has expired
   * @param {Object} session - Session object with exam and startedAt
   * @returns {Boolean} true if expired
   */
  isSessionExpired(session) {
    if (!session.exam.duration || !session.startedAt) {
      return false; // No time limit or not started
    }

    const startTime = new Date(session.startedAt);
    const currentTime = new Date();
    const elapsedMinutes = (currentTime - startTime) / (1000 * 60);

    return elapsedMinutes > session.exam.duration;
  }

  /**
   * Get remaining time for a session in minutes
   * @param {Object} session - Session object with exam and startedAt
   * @returns {Number|null} Remaining minutes or null if no limit
   */
  getRemainingTime(session) {
    if (!session.exam.duration || !session.startedAt) {
      return null;
    }

    const startTime = new Date(session.startedAt);
    const currentTime = new Date();
    const elapsedMinutes = (currentTime - startTime) / (1000 * 60);
    const remaining = session.exam.duration - elapsedMinutes;

    return Math.max(0, Math.round(remaining));
  }

  async joinExam(studentId, examCode) {
    const exam = await prisma.exam.findUnique({ where: { examCode } });
    if (!exam) throw new Error('Экзамен не найден');

    // Check if exam is published
    if (exam.status !== 'PUBLISHED') {
      throw new Error('Экзамен недоступен. Статус: ' + exam.status);
    }

    // Check for active session
    const activeSession = await prisma.examSession.findFirst({
      where: {
        studentId,
        examId: exam.id,
        status: { in: ['ACTIVE', 'PENDING', 'LOCKED', 'BLOCKED_WAITING'] },
      },
    });

    if (activeSession) {
      throw new Error('Вы уже участвуете в этом экзамене');
    }

    // Check attempt limit
    const completedAttempts = await prisma.examSession.count({
      where: {
        studentId,
        examId: exam.id,
        status: { in: ['COMPLETED', 'COMPLETED_BY_TEACHER'] },
      },
    });

    if (completedAttempts >= exam.maxAttempts) {
      throw new Error(
        `Вы исчерпали все попытки (${exam.maxAttempts}). Попыток использовано: ${completedAttempts}`
      );
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
    const session = await prisma.examSession.findUnique({
      where: { id: Number(sessionId) },
      include: { exam: true, answers: true },
    });

    if (!session) throw new Error('Сессия не найдена');

    if (user.role === 'STUDENT' && session.studentId !== user.id)
      throw new Error('Нет доступа к этой сессии');

    // Add remaining time if session is active
    if (session.status === 'ACTIVE' && session.exam.duration) {
      const remainingTime = this.getRemainingTime(session);

      // Auto-submit if time expired
      if (remainingTime === 0 && this.isSessionExpired(session)) {
        await this.finishExam(sessionId, session.studentId);
        const updatedSession = await prisma.examSession.findUnique({
          where: { id: Number(sessionId) },
          include: { exam: true, answers: true },
        });
        return {
          ...updatedSession,
          remainingTimeMinutes: 0,
          autoSubmitted: true,
        };
      }

      return {
        ...session,
        remainingTimeMinutes: remainingTime,
      };
    }

    return session;
  }

  async submitAnswer(sessionId, studentId, { questionId, response }) {
    const session = await prisma.examSession.findUnique({
      where: { id: Number(sessionId) },
      include: { exam: true },
    });

    if (!session) throw new Error('Сессия не найдена');
    if (session.studentId !== studentId) throw new Error('Нет доступа');

    // Check if time expired
    if (this.isSessionExpired(session)) {
      // Auto-submit the exam
      await this.finishExam(sessionId, studentId);
      throw new Error(
        'Время экзамена истекло. Экзамен автоматически завершён.'
      );
    }

    if (session.locked) {
      throw new Error('Сессия заблокирована. Дождитесь разрешения учителя.');
    }

    if (session.lockedUntil && new Date() < new Date(session.lockedUntil)) {
      throw new Error(
        'Вы временно заблокированы. Подождите окончания блокировки.'
      );
    }

    if (session.status !== 'ACTIVE') {
      throw new Error('Сессия неактивна. Статус: ' + session.status);
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
