const prisma = require('../config/prismaClient');

exports.findAllByTeacher = async (teacherId) => {
  return prisma.exam.findMany({
    where: { teacherId },
    select: {
      id: true,
      title: true,
      examCode: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

exports.findById = async (id) => {
  return prisma.exam.findUnique({
    where: { id },
    include: { questions: true },
  });
};

exports.update = async (id, data) => {
  return prisma.exam.update({
    where: { id },
    data,
  });
};

exports.delete = async (id) => {
  return prisma.exam.delete({ where: { id } });
};
