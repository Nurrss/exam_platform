const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '7d';

function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
