const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

module.exports = {
  generateTokens(user) {
    const payload = { id: user.id, role: user.role, email: user.email };

    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  },

  verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_SECRET);
  },

  verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET);
  },
};
