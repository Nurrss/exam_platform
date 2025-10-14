const prisma = require('../config/prismaClient');

exports.getAll = () => {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

exports.getById = (id) => {
  return prisma.user.findUnique({
    where: { id: Number(id) },
  });
};

exports.create = (data) => {
  return prisma.user.create({ data });
};

exports.update = (id, data) => {
  return prisma.user.update({
    where: { id: Number(id) },
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });
};

exports.delete = (id) => {
  return prisma.user.delete({
    where: { id: Number(id) },
  });
};
