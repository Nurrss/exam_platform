const sessionService = require('../services/sessionService');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');

exports.joinExam = async (req, res, next) => {
  try {
    const session = await sessionService.joinExam(
      req.user.id,
      req.body.examCode
    );
    res.status(201).json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
};

exports.getMySessions = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const paginationParams = getPaginationParams(page, limit);

    const [sessions, total] = await Promise.all([
      sessionService.getMySessions(req.user.id, paginationParams),
      sessionService.countMySessions(req.user.id),
    ]);

    const response = formatPaginatedResponse(sessions, total, page, limit);
    res.json({ ...response, message: 'Мои сессии' });
  } catch (err) {
    next(err);
  }
};

exports.getSessionById = async (req, res, next) => {
  try {
    const session = await sessionService.getSessionById(
      req.params.id,
      req.user
    );
    res.json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
};

exports.submitAnswer = async (req, res, next) => {
  try {
    const answer = await sessionService.submitAnswer(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json({ success: true, data: answer });
  } catch (err) {
    next(err);
  }
};

exports.finishExam = async (req, res, next) => {
  try {
    const session = await sessionService.finishExam(req.params.id, req.user.id);
    res.json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
};

exports.getResult = async (req, res, next) => {
  try {
    const result = await sessionService.getResult(req.params.id, req.user);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.getExamSessions = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const paginationParams = getPaginationParams(page, limit);

    // Build where clause for filtering
    const where = {};
    if (status) {
      where.status = status;
    }

    const [sessions, total] = await Promise.all([
      sessionService.getExamSessions(req.params.examId, req.user, { ...paginationParams, where }),
      sessionService.countExamSessions(req.params.examId, where),
    ]);

    const response = formatPaginatedResponse(sessions, total, page, limit);
    res.json({ ...response, message: 'Сессии экзамена' });
  } catch (err) {
    next(err);
  }
};
