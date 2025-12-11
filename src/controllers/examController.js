const examService = require('../services/examService');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');

exports.createExam = async (req, res, next) => {
  try {
    const exam = await examService.createExam(req.user.id, req.body);
    res.status(201).json({ success: true, data: exam });
  } catch (err) {
    next(err);
  }
};

exports.getMyExams = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const paginationParams = getPaginationParams(page, limit);

    const [exams, total] = await Promise.all([
      examService.getMyExams(req.user.id, paginationParams),
      examService.countMyExams(req.user.id),
    ]);

    const response = formatPaginatedResponse(exams, total, page, limit);
    res.json({ ...response, message: 'Мои экзамены' });
  } catch (err) {
    next(err);
  }
};

exports.getExamById = async (req, res, next) => {
  try {
    const exam = await examService.getExamById(req.params.id, req.user);
    res.json({ success: true, data: exam });
  } catch (err) {
    next(err);
  }
};

exports.updateExam = async (req, res, next) => {
  try {
    const updated = await examService.updateExam(
      req.params.id,
      req.user,
      req.body
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    await examService.deleteExam(req.params.id, req.user);
    res.json({ success: true, message: 'Экзамен удалён' });
  } catch (err) {
    next(err);
  }
};

exports.joinExam = async (req, res, next) => {
  try {
    const session = await examService.joinExam(
      req.user.id,
      req.params.examCode
    );
    res.json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
};

exports.getAllExams = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const paginationParams = getPaginationParams(page, limit);

    // Build where clause for filtering
    const where = {};
    if (status) {
      where.status = status;
    }

    const [exams, total] = await Promise.all([
      examService.getAllExams({ ...paginationParams, where }),
      examService.countAllExams(where),
    ]);

    const response = formatPaginatedResponse(exams, total, page, limit);
    res.json({ ...response, message: 'Все экзамены' });
  } catch (err) {
    next(err);
  }
};

exports.getExamByCode = async (req, res, next) => {
  try {
    const exam = await examService.getExamByCode(req.params.examCode);
    res.json({ success: true, data: exam });
  } catch (err) {
    next(err);
  }
};
