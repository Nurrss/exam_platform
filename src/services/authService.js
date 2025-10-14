const bcrypt = require('bcrypt');
const prisma = require('../config/prismaClient');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/tokenUtils');

const SALT_ROUNDS = parseInt(process.env.REFRESH_TOKEN_SALT_ROUNDS || '10');

class AuthService {
  async register(
    email,
    password,
    role = 'STUDENT',
    firstName = null,
    lastName = null
  ) {
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing)
        throw new Error('Пользователь с таким email уже существует');

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, role, firstName, lastName },
      });

      const payload = { id: user.id, role: user.role, email: user.email };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
      const hashedRefresh = await bcrypt.hash(refreshToken, SALT_ROUNDS);

      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: hashedRefresh,
          device: 'default',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        accessToken,
        refreshToken,
      };
    } catch (err) {
      console.error('❌ [register] Ошибка:', err);
      throw new Error('Ошибка при регистрации пользователя');
    }
  }

  async login(email, password, device = 'default') {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('Неверный email или пароль');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Неверный email или пароль');

      const payload = { id: user.id, role: user.role, email: user.email };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
      const hashedRefresh = await bcrypt.hash(refreshToken, SALT_ROUNDS);

      await prisma.refreshToken.deleteMany({
        where: { userId: user.id, device },
      });
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: hashedRefresh,
          device,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        accessToken,
        refreshToken,
      };
    } catch (err) {
      console.error('❌ [login] Ошибка:', err);
      throw new Error('Ошибка при входе в систему');
    }
  }

  async refreshToken(oldToken) {
    try {
      if (!oldToken) throw new Error('Refresh token отсутствует');

      let payload;
      try {
        payload = verifyRefreshToken(oldToken);
      } catch {
        throw new Error('Некорректный refresh token');
      }

      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!user) throw new Error('Пользователь не найден');

      const tokens = await prisma.refreshToken.findMany({
        where: { userId: user.id },
      });
      let matchedToken = null;

      for (const t of tokens) {
        const valid = await bcrypt.compare(oldToken, t.token);
        if (valid) {
          matchedToken = t;
          break;
        }
      }

      if (!matchedToken) throw new Error('Refresh token не найден или устарел');

      const newAccess = generateAccessToken(payload);
      const newRefresh = generateRefreshToken(payload);
      const hashedNewRefresh = await bcrypt.hash(newRefresh, SALT_ROUNDS);

      await prisma.refreshToken.update({
        where: { id: matchedToken.id },
        data: {
          token: hashedNewRefresh,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return { accessToken: newAccess, refreshToken: newRefresh };
    } catch (err) {
      console.error('❌ [refreshToken] Ошибка:', err);
      throw new Error('Ошибка при обновлении токена');
    }
  }

  async logout(userId, device = null) {
    try {
      const where = device ? { userId, device } : { userId };
      await prisma.refreshToken.deleteMany({ where });
    } catch (err) {
      console.error('❌ [logout] Ошибка:', err);
      throw new Error('Ошибка при выходе пользователя');
    }
  }
}

module.exports = new AuthService();
