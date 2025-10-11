const userRepository = require('../repositories/userRepository');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userRepository.getAll();
    const safeUsers = users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }));
    res.json(safeUsers);
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newUser = await userRepository.create({ email, password, role });
    const safeUser = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
    res.status(201).json(safeUser);
  } catch (error) {
    next(error);
  }
};
