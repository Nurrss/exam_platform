const prisma = require('../config/prismaClient');

exports.getAll = (options = {}) => {
  const { skip, take, where } = options;
  return prisma.user.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });
};

exports.count = (where = {}) => {
  return prisma.user.count({ where });
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
