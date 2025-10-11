const sessionRepository = require('../repositories/sessionRepository');
const answerRepository = require('../repositories/answerRepository');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { arraysEqualAsSets } = require('../utils/gradeUtils');

class SessionService {
  async createSession(studentId, exam) {
    return await prisma.examSession.create({
      data: {
        studentId,
        examId: exam.id,
        status: 'ACTIVE',
        startedAt: new Date(),
      },
      include: { exam: true },
    });
  }

  async findById(id) {
    return await prisma.examSession.findUnique({
      where: { id },
      include: { exam: true, answers: true },
    });
  }

  async findActiveSession(studentId, examId) {
    return await prisma.examSession.findFirst({
      where: { studentId, examId, status: 'ACTIVE' },
    });
  }

  async finishSession(sessionId, studentId) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) throw new Error('Session not found');
    if (session.studentId !== studentId) throw new Error('Access denied');
    if (session.status !== 'ACTIVE') {
      // allow finishing if already completed? here protect:
      if (session.status === 'COMPLETED') {
        // return existing summary if needed
      } else {
        throw new Error('Session not active');
      }
    }

    // Получаем все вопросы экзамена
    const questions = await prisma.question.findMany({
      where: { examId: session.examId },
      select: {
        id: true,
        text: true,
        type: true,
        options: true,
        correct: true,
      },
    });

    // Получаем все ответы студента по сессии
    const answers = await answerRepository.getAnswersBySession(sessionId);

    // Создаём map вопросId -> ответ
    const answerMap = new Map();
    for (const a of answers) {
      answerMap.set(a.questionId, a);
    }

    // Проверка и подсчёт
    let totalQuestionsAuto = 0;
    let correctCount = 0;
    const details = [];

    for (const q of questions) {
      const studentAnswer = answerMap.get(q.id);
      let isCorrect = false;
      let autoGraded = true;
      let points = 0;

      if (q.type === 'MULTIPLE_CHOICE') {
        totalQuestionsAuto += 1;
        // ожидание, что q.correct и studentAnswer.response — массивы
        const correctVal = q.correct ?? [];
        const studentVal = studentAnswer ? studentAnswer.response : [];
        if (arraysEqualAsSets(correctVal, studentVal)) {
          isCorrect = true;
          points = 1;
        }
      } else if (q.type === 'TRUE_FALSE') {
        totalQuestionsAuto += 1;
        const correctVal = q.correct;
        const studentVal = studentAnswer ? studentAnswer.response : null;
        // корректный формат: true/false
        if (typeof studentVal === 'boolean' && correctVal === studentVal) {
          isCorrect = true;
          points = 1;
        }
      } else if (q.type === 'TEXT') {
        // не автопроверяем
        autoGraded = false;
      } else {
        // неизвестный тип — пропускаем
        autoGraded = false;
      }

      if (autoGraded && isCorrect) correctCount += 1;

      details.push({
        questionId: q.id,
        type: q.type,
        questionText: q.text,
        correct: q.correct ?? null,
        response: studentAnswer ? studentAnswer.response : null,
        autoGraded,
        isCorrect,
        points,
      });
    }

    // вычисляем итог:
    // используем количество автоматически проверяемых вопросов как базу;
    // если нет автопроверяемых, поставим score = null и needsManualReview = true
    let scorePercent = null;
    let totalPoints = 0;
    let obtainedPoints = 0;

    totalPoints = totalQuestionsAuto; // 1 очко за автопроверяемый вопрос
    obtainedPoints = correctCount;

    if (totalPoints > 0) {
      scorePercent = (obtainedPoints / totalPoints) * 100;
    }

    // Завершаем сессию в БД
    await sessionRepository.finishSession(sessionId);

    // Попробуем записать score в ExamSession (если у тебя есть поле score)
    try {
      if (scorePercent !== null) {
        await prisma.examSession.update({
          where: { id: sessionId },
          data: { score: Number(scorePercent) }, // если поля нет — выбросит ошибку
        });
      }
    } catch (err) {
      // Если миграции нет — игнорируем. Можно логировать.
      // console.warn('score save skipped (no field?)', err.message);
    }

    return {
      sessionId,
      examId: session.examId,
      studentId,
      totalAutoQuestions: totalPoints,
      correctAuto: obtainedPoints,
      scorePercent,
      needsManualReview: totalPoints === 0,
      details,
    };
  }
}

module.exports = new SessionService();
