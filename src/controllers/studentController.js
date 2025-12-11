const studentService = require('../services/studentService');

/**
 * Get student dashboard with statistics
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const dashboard = await studentService.getDashboard(studentId);

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get detailed exam history with filtering
 */
exports.getExamHistory = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { status, dateFrom, dateTo, examId, page = 1, pageSize = 10 } = req.query;

    const filters = { status, dateFrom, dateTo, examId };
    const paginationOptions = {
      skip: (page - 1) * pageSize,
      take: parseInt(pageSize),
    };

    const history = await studentService.getExamHistory(
      studentId,
      filters,
      paginationOptions
    );

    res.json({
      success: true,
      ...history,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get performance trends over time
 */
exports.getPerformanceTrends = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { months = 6 } = req.query;

    const trends = await studentService.getPerformanceTrends(
      studentId,
      parseInt(months)
    );

    res.json({
      success: true,
      data: trends,
    });
  } catch (err) {
    next(err);
  }
};
