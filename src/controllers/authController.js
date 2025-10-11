const authService = require('../services/authService');

const COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || 'refreshToken';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

class AuthController {
  async register(req, res) {
    try {
      const { email, password, role } = req.body;
      const { user, accessToken, refreshToken } = await authService.register(
        email,
        password,
        role
      );
      res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
      res.status(201).json({ user, accessToken });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await authService.login(
        email,
        password
      );
      res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
      res.json({ user, accessToken });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async refresh(req, res) {
    try {
      const refreshFromCookie = req.cookies?.[COOKIE_NAME];
      const refreshFromBody = req.body.refreshToken;
      const token = refreshFromCookie || refreshFromBody;
      const tokens = await authService.refreshToken(token);
      res.cookie(COOKIE_NAME, tokens.refreshToken, COOKIE_OPTIONS);
      res.json({ accessToken: tokens.accessToken });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  async logout(req, res) {
    try {
      const userId = req.user?.id;
      if (userId) {
        await authService.logout(userId);
      }
      res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
      res.json({ message: 'Logged out' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new AuthController();
