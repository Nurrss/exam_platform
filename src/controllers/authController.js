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
      const { email, password, role, firstName, lastName } = req.body;
      const userFirstName = firstName || 'Пользователь';
      const userLastName = lastName || '';

      const { user } = await authService.register(
        email,
        password,
        role,
        userFirstName,
        userLastName
      );

      res.status(201).json({
        success: true,
        message: 'Регистрация успешна, подтвердите email',
        data: user,
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
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

      res.json({
        success: true,
        message: 'Вход выполнен успешно',
        data: { user, accessToken },
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async refresh(req, res) {
    try {
      const token = req.cookies?.[COOKIE_NAME] || req.body.refreshToken;
      const tokens = await authService.refreshToken(token);
      res.cookie(COOKIE_NAME, tokens.refreshToken, COOKIE_OPTIONS);

      res.json({
        success: true,
        message: 'Access token обновлён',
        data: { accessToken: tokens.accessToken },
      });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  }

  async logout(req, res) {
    try {
      if (req.user?.id) await authService.logout(req.user.id);
      res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
      res.json({ success: true, message: 'Выход выполнен успешно' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      await authService.changePassword(req.user.id, oldPassword, newPassword);
      res.json({ success: true, message: 'Пароль успешно изменён' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      await authService.forgotPassword(req.body.email);
      res.json({
        success: true,
        message: 'Ссылка для восстановления отправлена на email',
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      await authService.resetPassword(token, newPassword);
      res.json({ success: true, message: 'Пароль успешно восстановлен' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      await authService.verifyEmail(token);
      res.json({ success: true, message: 'Email успешно подтверждён!' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new AuthController();
