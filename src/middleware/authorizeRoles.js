module.exports = (roles = []) => {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (user.role === 'ADMIN' || allowed.includes(user.role)) {
      return next();
    }

    res.status(403).json({ error: 'Access denied' });
  };
};
