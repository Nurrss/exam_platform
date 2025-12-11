const questionService = require('../services/questionService');
const bulkImportService = require('../services/bulkImportService');

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не был загружен',
      });
    }

    // Return the URL to access the uploaded image
    const imageUrl = `/uploads/images/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Изображение успешно загружено',
      data: {
        imageUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (err) {
    next(err);
  }
};

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

exports.bulkImport = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не был загружен',
      });
    }

    const { examId } = req.params;
    const userId = req.user.id;
    const filePath = req.file.path;
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

    let result;

    if (fileExtension === 'csv') {
      result = await bulkImportService.importFromCSV(filePath, examId, userId);
    } else if (fileExtension === 'json') {
      result = await bulkImportService.importFromJSON(filePath, examId, userId);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Недопустимый формат файла. Разрешены: CSV, JSON',
      });
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
