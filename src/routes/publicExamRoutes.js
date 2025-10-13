const express = require('express');
const router = express.Router();
const prisma = require('../config/prismaClient');

router.get('/', async (req, res, next) => {
  try {
    const exams = await prisma.exam.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, title: true, description: true, createdAt: true },
    });
    res.json(exams);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
