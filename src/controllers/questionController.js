const questionService = require('../services/questionService');

exports.createQuestion = async (req, res, next) => {
  try {
    const question = await questionService.createQuestion(
      req.params.examId,
      req.user,
      req.body
    );
    res.status(201).json({ success: true, data: question });
  } catch (err) {
    next(err);
  }
};

exports.getQuestionsByExam = async (req, res, next) => {
  try {
    const questions = await questionService.getQuestionsByExam(
      req.params.examId,
      req.user
    );
    res.json({ success: true, data: questions });
  } catch (err) {
    next(err);
  }
};

exports.getQuestionsForStudent = async (req, res, next) => {
  try {
    const questions = await questionService.getQuestionsForStudent(
      req.params.examId
    );
    res.json({ success: true, data: questions });
  } catch (err) {
    next(err);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const updated = await questionService.updateQuestion(
      req.params.id,
      req.user,
      req.body
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    await questionService.deleteQuestion(req.params.id, req.user);
    res.json({ success: true, message: 'Вопрос удалён' });
  } catch (err) {
    next(err);
  }
};
