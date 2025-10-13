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

  async join(req, res) {
    try {
      const { examCode } = req.body;
      const studentId = req.user.id;

      const exam = await prisma.exam.findUnique({ where: { examCode } });
      if (!exam) return res.status(404).json({ error: 'Exam not found' });
      if (exam.status !== 'PUBLISHED')
        return res.status(403).json({ error: 'Exam not available yet' });

      const existing = await prisma.examSession.findFirst({
        where: { examId: exam.id, studentId },
      });
      if (existing) return res.json(existing);

      const session = await prisma.examSession.create({
        data: {
          examId: exam.id,
          studentId,
          status: 'ACTIVE',
          startedAt: new Date(),
        },
      });

      res.json({
        message: 'Joined successfully',
        examTitle: exam.title,
        sessionId: session.id,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new SessionController();
