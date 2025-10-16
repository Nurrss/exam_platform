const analyticsService = require('../services/analyticsService');

exports.getExamAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getExamAnalytics(
      req.params.id,
      req.user
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
