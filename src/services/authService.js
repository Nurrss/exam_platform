const bcrypt = require('bcrypt');
const prisma = require('../config/prismaClient');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/tokenUtils');

const SALT_ROUNDS = parseInt(process.env.REFRESH_TOKEN_SALT_ROUNDS || '10');

class AuthService {
  async register(email, password, role = 'STUDENT') {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('User already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, role },
    });

    const payload = { id: user.id, role: user.role, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const hashedRefresh = await bcrypt.hash(refreshToken, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefresh },
    });

    return {
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid email or password');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid email or password');

    const payload = { id: user.id, role: user.role, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const hashedRefresh = await bcrypt.hash(refreshToken, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefresh },
    });

    return {
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(oldToken) {
    if (!oldToken) throw new Error('No refresh token provided');

    let payload;
    try {
      payload = verifyRefreshToken(oldToken);
    } catch (err) {
      throw new Error('Invalid refresh token');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || !user.refreshToken) throw new Error('Refresh token not found');

    const valid = await bcrypt.compare(oldToken, user.refreshToken);
    if (!valid) throw new Error('Refresh token mismatch');

    const newPayload = { id: user.id, role: user.role, email: user.email };
    const newAccess = generateAccessToken(newPayload);
    const newRefresh = generateRefreshToken(newPayload);
    const hashedNewRefresh = await bcrypt.hash(newRefresh, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedNewRefresh },
    });

    return { accessToken: newAccess, refreshToken: newRefresh };
  }

  async logout(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}

module.exports = new AuthService();
