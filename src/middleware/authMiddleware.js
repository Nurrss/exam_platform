const jwt = require('jsonwebtoken');
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header?.startsWith('Bearer '))
      return res
        .status(401)
        .json({ error: 'Authorization header missing or invalid' });

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, ACCESS_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
