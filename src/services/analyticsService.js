const prisma = require('../config/prismaClient');

class AnalyticsService {
  async getExamAnalytics(examId, user) {
    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
      include: { sessions: true },
    });

    if (!exam) throw new Error('Экзамен не найден');
    if (user.role !== 'ADMIN' && exam.teacherId !== user.id)
      throw new Error('Нет доступа');

    const sessions = exam.sessions;

    if (sessions.length === 0) {
      return {
        examId: exam.id,
        title: exam.title,
        studentsCount: 0,
        avgScore: 0,
        avgPercent: 0,
        completed: 0,
        active: 0,
        blocked: 0,
        scores: [],
      };
    }

    const completed = sessions.filter((s) => s.status === 'COMPLETED').length;
    const active = sessions.filter((s) => s.status === 'ACTIVE').length;
    const blocked = sessions.filter((s) =>
      ['LOCKED', 'BLOCKED_WAITING'].includes(s.status)
    ).length;

    const scores = sessions
      .filter((s) => s.score != null)
      .map((s) => ({ studentId: s.studentId, score: s.score }));

    const avgScore =
      scores.reduce((sum, s) => sum + s.score, 0) / scores.length || 0;

    const avgPercent = (avgScore / exam.questions.length) * 100 || 0;

    return {
      examId: exam.id,
      title: exam.title,
      studentsCount: sessions.length,
      avgScore,
      avgPercent,
      completed,
      active,
      blocked,
      scores,
    };
  }
}

module.exports = new AnalyticsService();
