const sessionService = require('../services/sessionService');

class SessionController {
  async join(req, res) {
    try {
      const { examPassword } = req.body;
      const studentId = req.user.id;
      const session = await sessionService.joinExam(studentId, examPassword);
      res.json(session);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getDetails(req, res) {
    try {
      const sessionId = parseInt(req.params.id);
      const studentId = req.user.id;
      const result = await sessionService.getSessionDetails(
        sessionId,
        studentId
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async saveAnswer(req, res) {
    try {
      const sessionId = parseInt(req.params.id);
      const studentId = req.user.id;
      const { questionId, response } = req.body;
      const answer = await sessionService.saveAnswer(
        sessionId,
        studentId,
        questionId,
        response
      );
      res.json(answer);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async finish(req, res) {
    try {
      const sessionId = parseInt(req.params.id);
      const studentId = req.user.id;
      const result = await sessionService.finishSession(sessionId, studentId);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new SessionController();
