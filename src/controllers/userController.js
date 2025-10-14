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

    res.json({
      success: true,
      message: 'Список всех пользователей',
      data: safeUsers,
    });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Отсутствуют обязательные поля',
      });
    }

    const newUser = await userRepository.create({ email, password, role });

    const safeUser = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    res.status(201).json({
      success: true,
      message: 'Пользователь успешно создан',
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};
