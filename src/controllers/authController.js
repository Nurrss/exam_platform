const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const { email, password, role } = req.body;
      const result = await authService.register(email, password, role);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);
      res.json(tokens);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  async logout(req, res) {
    try {
      await authService.logout(req.user.id);
      res.json({ message: 'Выход выполнен' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new AuthController();
