const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userRepository.getAll();
    const safeUsers = users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
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

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requester = req.user;

    if (requester.role !== 'ADMIN' && requester.id !== parseInt(id)) {
      return res.status(403).json({ success: false, message: 'Нет доступа' });
    }

    const user = await userRepository.getById(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: 'Пользователь не найден' });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.json({ success: true, data: safeUser });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Отсутствуют обязательные поля',
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await userRepository.create({
      email,
      password: hash,
      role,
      firstName,
      lastName,
    });

    res.status(201).json({
      success: true,
      message: 'Пользователь успешно создан',
      data: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requester = req.user;
    const { firstName, lastName, role } = req.body;

    if (requester.role !== 'ADMIN' && requester.id !== parseInt(id)) {
      return res.status(403).json({ success: false, message: 'Нет доступа' });
    }

    const updated = await userRepository.update(id, {
      firstName,
      lastName,
      role,
    });

    res.json({
      success: true,
      message: 'Пользователь обновлён',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userRepository.delete(id);
    res.json({ success: true, message: 'Пользователь удалён' });
  } catch (error) {
    next(error);
  }
};
