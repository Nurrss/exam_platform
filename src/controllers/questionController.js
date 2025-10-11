const questionService = require('../services/questionService');

exports.addQuestion = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const { text, type, options, correct } = req.body;
    const teacherId = req.user.id;

    const question = await questionService.addQuestion(
      parseInt(examId),
      teacherId,
      text,
      type,
      options,
      correct
    );

    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
};

exports.getQuestions = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const teacherId = req.user.id;

    const questions = await questionService.getQuestions(
      parseInt(examId),
      teacherId
    );

    res.json(questions);
  } catch (err) {
    next(err);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const teacherId = req.user.id;

    const updated = await questionService.updateQuestion(
      parseInt(questionId),
      teacherId,
      req.body
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const teacherId = req.user.id;

    await questionService.deleteQuestion(parseInt(questionId), teacherId);

    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    next(err);
  }
};
