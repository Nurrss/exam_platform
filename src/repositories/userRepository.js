const prisma = require('../config/prismaClient');
const bcrypt = require('bcrypt');

class UserRepository {
  async getAll() {
    return prisma.user.findMany();
  }

  async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async getByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
}

module.exports = new UserRepository();
