const { PrismaClient, SessionStatus } = require('@prisma/client');
const prisma = new PrismaClient();

class SecurityService {
  async reportViolation(sessionId, user, type, note) {
    const session = await prisma.examSession.findUnique({
      where: { id: Number(sessionId) },
    });
    if (!session) throw new Error('Сессия не найдена');
    if (session.studentId !== user.id) throw new Error('Нет доступа');

    const violation = {
      type,
      note,
      time: new Date().toISOString(),
      approvedByTeacher: false,
    };

    const updated = await prisma.examSession.update({
      where: { id: Number(sessionId) },
      data: {
        lastViolation: violation,
        locked: true,
        status: SessionStatus.BLOCKED_WAITING,
      },
    });

    return updated;
  }

  async approveViolation(sessionId, teacher) {
    const session = await prisma.examSession.findUnique({
      where: { id: Number(sessionId) },
      include: { exam: true },
    });
    if (!session) throw new Error('Сессия не найдена');
    if (teacher.role !== 'ADMIN' && session.exam.teacherId !== teacher.id) {
      throw new Error('Нет прав для разблокировки');
    }

    const violation = session.lastViolation || {};
    violation.approvedByTeacher = true;
    violation.teacherId = teacher.id;
    violation.teacherApprovedAt = new Date().toISOString();

    const lockedUntil = new Date(Date.now() + 60 * 1000);

    const updated = await prisma.examSession.update({
      where: { id: Number(sessionId) },
      data: {
        lockedUntil,
        locked: true,
        status: SessionStatus.LOCKED,
        lastViolation: violation,
      },
    });

    return updated;
  }

  async autoUnlockExpired() {
    const now = new Date();
    const sessions = await prisma.examSession.findMany({
      where: {
        locked: true,
        lockedUntil: { lt: now },
        status: SessionStatus.LOCKED,
      },
    });

    for (const s of sessions) {
      await prisma.examSession.update({
        where: { id: s.id },
        data: {
          locked: false,
          lockedUntil: null,
          status: SessionStatus.ACTIVE,
        },
      });
    }

    return sessions.length;
  }

  async forceFinish(sessionId, teacher) {
    const session = await prisma.examSession.findUnique({
      where: { id: Number(sessionId) },
      include: { exam: true },
    });
    if (!session) throw new Error('Сессия не найдена');
    if (teacher.role !== 'ADMIN' && session.exam.teacherId !== teacher.id) {
      throw new Error('Нет прав завершить экзамен');
    }

    return prisma.examSession.update({
      where: { id: Number(sessionId) },
      data: {
        status: SessionStatus.COMPLETED_BY_TEACHER,
        locked: false,
      },
    });
  }
}

module.exports = new SecurityService();
