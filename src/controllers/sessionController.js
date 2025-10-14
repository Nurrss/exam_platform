const sessionService = require('../services/sessionService');

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
    const sessions = await sessionService.getMySessions(req.user.id);
    res.json({ success: true, data: sessions });
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
    const sessions = await sessionService.getExamSessions(
      req.params.examId,
      req.user
    );
    res.json({ success: true, data: sessions });
  } catch (err) {
    next(err);
  }
};
