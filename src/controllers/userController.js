const userRepository = require('../repositories/userRepository');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userRepository.getAll();
    res.json(users);
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
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};
