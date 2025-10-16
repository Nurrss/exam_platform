const securityService = require('../services/securityService');

exports.reportViolation = async (req, res, next) => {
  try {
    const { type, note } = req.body;
    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо объяснение причины нарушения',
      });
    }

    const session = await securityService.reportViolation(
      req.params.id,
      req.user,
      type,
      note
    );

    res.json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
};

exports.approveViolation = async (req, res, next) => {
  try {
    const session = await securityService.approveViolation(
      req.params.id,
      req.user
    );
    res.json({
      success: true,
      message: 'Учитель разрешил продолжение экзамена',
      data: session,
    });
  } catch (err) {
    next(err);
  }
};

exports.forceFinish = async (req, res, next) => {
  try {
    const session = await securityService.forceFinish(req.params.id, req.user);
    res.json({
      success: true,
      message: 'Экзамен завершён учителем',
      data: session,
    });
  } catch (err) {
    next(err);
  }
};
