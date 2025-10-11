const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateTokens, verifyRefreshToken } = require('../utils/tokenUtils');

class AuthService {
  async register(email, password, role = 'STUDENT') {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('Пользователь уже существует');

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, role },
    });

    const tokens = generateTokens(user);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return { user, ...tokens };
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Пользователь не найден');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Неверный пароль');

    const tokens = generateTokens(user);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return { user, ...tokens };
  }

  async refreshToken(oldToken) {
    try {
      const payload = verifyRefreshToken(oldToken);
      const user = await prisma.user.findUnique({ where: { id: payload.id } });

      if (!user || user.refreshToken !== oldToken)
        throw new Error('Неверный refresh токен');

      const tokens = generateTokens(user);
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken },
      });

      return tokens;
    } catch {
      throw new Error('Недействительный refresh токен');
    }
  }

  async logout(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}

module.exports = new AuthService();
