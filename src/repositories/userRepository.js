const prisma = require('../config/prismaClient');
const bcrypt = require('bcrypt');

class UserRepository {
  async getAll() {
    try {
      return await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (err) {
      console.error('❌ Error in getAllUsers:', err);
      throw new Error('Ошибка при получении пользователей');
    }
  }

  async create(data) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      return await prisma.user.create({
        data: { ...data, password: hashedPassword },
      });
    } catch (err) {
      console.error('❌ Error in createUser:', err);
      throw new Error('Ошибка при создании пользователя');
    }
  }

  async getByEmail(email) {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (err) {
      console.error('❌ Error in getByEmail:', err);
      throw new Error('Ошибка при поиске пользователя по email');
    }
  }
}

module.exports = new UserRepository();
