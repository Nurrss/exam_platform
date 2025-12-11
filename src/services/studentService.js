const prisma = require('../config/prismaClient');

class StudentService {
  /**
   * Get student dashboard statistics
   * @param {Number} studentId
   * @returns {Object} Dashboard data with statistics
   */
  async getDashboard(studentId) {
    // Get all completed sessions
    const completedSessions = await prisma.examSession.findMany({
      where: {
        studentId,
        status: { in: ['COMPLETED', 'COMPLETED_BY_TEACHER'] },
      },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        finishedAt: 'desc',
      },
    });

    // Calculate statistics
    const totalExams = completedSessions.length;
    const scores = completedSessions
      .filter((s) => s.score !== null)
      .map((s) => s.score);

    const averageScore = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;

    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    // Get recent exams (last 5)
    const recentExams = completedSessions.slice(0, 5).map((session) => ({
      id: session.id,
      examTitle: session.exam.title,
      score: session.score,
      finishedAt: session.finishedAt,
      status: session.status,
    }));

    // Get active sessions
    const activeSessions = await prisma.examSession.findMany({
      where: {
        studentId,
        status: { in: ['ACTIVE', 'PENDING', 'BLOCKED_WAITING'] },
      },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            duration: true,
          },
        },
      },
    });

    // Score distribution
    const scoreRanges = {
      excellent: scores.filter((s) => s >= 90).length, // 90-100%
      good: scores.filter((s) => s >= 70 && s < 90).length, // 70-89%
      average: scores.filter((s) => s >= 50 && s < 70).length, // 50-69%
      poor: scores.filter((s) => s < 50).length, // 0-49%
    };

    return {
      statistics: {
        totalExams,
        averageScore: Math.round(averageScore * 100) / 100,
        highestScore,
        lowestScore,
      },
      scoreDistribution: scoreRanges,
      recentExams,
      activeSessions: activeSessions.map((s) => ({
        id: s.id,
        examTitle: s.exam.title,
        status: s.status,
        startedAt: s.startedAt,
        duration: s.exam.duration,
      })),
    };
  }

  /**
   * Get detailed exam history with filtering
   * @param {Number} studentId
   * @param {Object} filters - status, dateFrom, dateTo, examId
   * @param {Object} paginationOptions - skip, take
   * @returns {Object} Paginated exam history
   */
  async getExamHistory(studentId, filters = {}, paginationOptions = {}) {
    const { status, dateFrom, dateTo, examId } = filters;
    const { skip = 0, take = 10 } = paginationOptions;

    // Build where clause
    const where = {
      studentId,
      ...(status && { status }),
      ...(examId && { examId: Number(examId) }),
      ...(dateFrom && { finishedAt: { gte: new Date(dateFrom) } }),
      ...(dateTo && {
        finishedAt: { ...where.finishedAt, lte: new Date(dateTo) },
      }),
    };

    // Get sessions
    const sessions = await prisma.examSession.findMany({
      where,
      skip,
      take,
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            maxAttempts: true,
          },
        },
        answers: {
          select: {
            id: true,
            questionId: true,
            isCorrect: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get total count
    const total = await prisma.examSession.count({ where });

    // Format response
    const formattedSessions = sessions.map((session) => ({
      id: session.id,
      exam: session.exam,
      status: session.status,
      score: session.score,
      startedAt: session.startedAt,
      finishedAt: session.finishedAt,
      totalQuestions: session.answers.length,
      correctAnswers: session.answers.filter((a) => a.isCorrect).length,
    }));

    return {
      data: formattedSessions,
      pagination: {
        total,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Get student performance trends over time
   * @param {Number} studentId
   * @param {Number} months - Number of months to look back (default: 6)
   * @returns {Array} Monthly performance data
   */
  async getPerformanceTrends(studentId, months = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const sessions = await prisma.examSession.findMany({
      where: {
        studentId,
        status: { in: ['COMPLETED', 'COMPLETED_BY_TEACHER'] },
        finishedAt: {
          gte: startDate,
        },
      },
      select: {
        score: true,
        finishedAt: true,
      },
      orderBy: {
        finishedAt: 'asc',
      },
    });

    // Group by month
    const monthlyData = {};
    sessions.forEach((session) => {
      if (session.score !== null && session.finishedAt) {
        const monthKey = session.finishedAt.toISOString().slice(0, 7); // YYYY-MM
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthKey,
            scores: [],
            count: 0,
          };
        }
        monthlyData[monthKey].scores.push(session.score);
        monthlyData[monthKey].count++;
      }
    });

    // Calculate averages
    return Object.values(monthlyData).map((data) => ({
      month: data.month,
      averageScore:
        data.scores.reduce((sum, score) => sum + score, 0) / data.count,
      examsCompleted: data.count,
    }));
  }
}

module.exports = new StudentService();
