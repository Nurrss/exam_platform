module.exports = (roles = []) => {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: no user in request',
      });
    }

    if (user.role === 'ADMIN' || allowed.includes(user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied: insufficient role',
    });
  };
};
