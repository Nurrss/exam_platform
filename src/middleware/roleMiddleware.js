module.exports = function requireRole(required) {
  const requiredRoles = Array.isArray(required) ? required : [required];

  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      if (user.role === 'ADMIN') return next();

      if (!requiredRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
