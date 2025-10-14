const bcrypt = require('bcrypt');
const prisma = require('../config/prismaClient');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');
const crypto = require('crypto');

class AuthService {
  // Проверка сложности пароля
  validatePassword(password) {
    const strong = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!strong.test(password)) {
      throw new Error(
        'Пароль должен быть минимум 8 символов и содержать цифры и буквы'
      );
    }
  }

  // Регистрация пользователя
  async register(email, password, role, firstName, lastName) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('Пользователь с таким email уже существует');

    this.validatePassword(password);
    const hash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        role,
        firstName,
        lastName,
        verificationToken,
      },
    });

    // Отправка письма для подтверждения email
    const verifyLink = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;
    await sendEmail(
      email,
      'Подтверждение регистрации',
      `Перейдите по ссылке для подтверждения: <a href="${verifyLink}">${verifyLink}</a>`
    );

    return { user };
  }

  // Логин пользователя
  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Пользователь не найден');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Неверный пароль');

    if (!user.isVerified) throw new Error('Email не подтверждён');

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
    );

    // Сохраняем refreshToken в базе
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(
          Date.now() + parseDuration(process.env.REFRESH_TOKEN_EXPIRES)
        ),
      },
    });

    return { user, accessToken, refreshToken };
  }

  // Обновление access token
  async refreshToken(token) {
    if (!token) throw new Error('Нет refresh токена');

    let payload;
    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      throw new Error('Неверный или просроченный refresh токен');
    }

    const dbToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!dbToken) throw new Error('Refresh токен не найден в базе');

    const accessToken = jwt.sign(
      { id: payload.id, role: payload.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
    );

    return { accessToken, refreshToken: token };
  }

  // Выход (logout)
  async logout(userId) {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }

  // Смена пароля
  async changePassword(userId, oldPassword, newPassword) {
    this.validatePassword(newPassword);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Пользователь не найден');

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) throw new Error('Неверный старый пароль');

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    await sendEmail(
      user.email,
      'Ваш пароль был изменён',
      `<p>Если это были не вы — срочно восстановите пароль.</p>`
    );
  }

  // Запрос на сброс пароля
  async forgotPassword(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Пользователь не найден');

    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

    await prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      update: { token, expiresAt: expires },
      create: { userId: user.id, token, expiresAt: expires },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendEmail(
      user.email,
      'Восстановление пароля',
      `<p>Нажмите, чтобы восстановить пароль: <a href="${resetUrl}">${resetUrl}</a></p>`
    );
  }

  // Сброс пароля
  async resetPassword(token, newPassword) {
    this.validatePassword(newPassword);

    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    });
    if (!record || record.expiresAt < new Date())
      throw new Error('Токен недействителен или истёк');

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    });
    await prisma.passwordResetToken.delete({ where: { token } });

    const user = await prisma.user.findUnique({ where: { id: record.userId } });
    await sendEmail(
      user.email,
      'Пароль успешно восстановлен',
      `<p>Ваш новый пароль был установлен.</p>`
    );
  }

  // Подтверждение email
  async verifyEmail(token) {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });
    if (!user) throw new Error('Неверный или устаревший токен подтверждения');

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null },
    });
  }
}

// Хелпер для перевода строки вроде "7d" в миллисекунды
function parseDuration(str) {
  const num = parseInt(str);
  if (str.includes('d')) return num * 24 * 60 * 60 * 1000;
  if (str.includes('h')) return num * 60 * 60 * 1000;
  if (str.includes('m')) return num * 60 * 1000;
  return num;
}

module.exports = new AuthService();
