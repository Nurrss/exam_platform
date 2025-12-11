const cron = require('node-cron');
const prisma = require('../config/prismaClient');
const { logger } = require('../config/logger');
const AuditLog = require('../utils/auditLog');

class SchedulerService {
  /**
   * Check and update exam statuses based on schedule
   * Runs every minute
   */
  startExamScheduler() {
    // Run every minute
    cron.schedule('* * * * *', async () => {
      try {
        const now = new Date();

        // Auto-publish exams that reached scheduledStartTime
        const examsToPublish = await prisma.exam.findMany({
          where: {
            status: 'DRAFT',
            scheduledStartTime: {
              lte: now,
            },
            deletedAt: null,
          },
        });

        for (const exam of examsToPublish) {
          await prisma.exam.update({
            where: { id: exam.id },
            data: { status: 'PUBLISHED' },
          });

          logger.info('Auto-published exam', {
            examId: exam.id,
            title: exam.title,
            scheduledTime: exam.scheduledStartTime,
          });

          AuditLog.exam('AUTO_PUBLISH', exam.teacherId, exam.id, {
            scheduledTime: exam.scheduledStartTime,
            actualTime: now,
          });
        }

        // Auto-close exams that reached scheduledEndTime
        const examsToClose = await prisma.exam.findMany({
          where: {
            status: 'PUBLISHED',
            scheduledEndTime: {
              lte: now,
            },
            deletedAt: null,
          },
        });

        for (const exam of examsToClose) {
          await prisma.exam.update({
            where: { id: exam.id },
            data: { status: 'CLOSED' },
          });

          logger.info('Auto-closed exam', {
            examId: exam.id,
            title: exam.title,
            scheduledTime: exam.scheduledEndTime,
          });

          AuditLog.exam('AUTO_CLOSE', exam.teacherId, exam.id, {
            scheduledTime: exam.scheduledEndTime,
            actualTime: now,
          });

          // Force-finish all active sessions for this exam
          await this.forceFinishActiveSessions(exam.id);
        }

        if (examsToPublish.length > 0 || examsToClose.length > 0) {
          AuditLog.system('SCHEDULED_EXAM_UPDATE', {
            published: examsToPublish.length,
            closed: examsToClose.length,
          });
        }
      } catch (error) {
        logger.error('Exam scheduler error', {
          error: error.message,
          stack: error.stack,
        });
      }
    });

    logger.info('Exam scheduler started - running every minute');
    AuditLog.system('SCHEDULER_STARTED', { job: 'exam-scheduler' });
  }

  /**
   * Force finish all active sessions for a closed exam
   */
  async forceFinishActiveSessions(examId) {
    const activeSessions = await prisma.examSession.findMany({
      where: {
        examId,
        status: { in: ['ACTIVE', 'PENDING'] },
      },
    });

    for (const session of activeSessions) {
      await prisma.examSession.update({
        where: { id: session.id },
        data: {
          status: 'COMPLETED_BY_TEACHER',
          finishedAt: new Date(),
        },
      });

      logger.info('Force-finished session due to exam closure', {
        sessionId: session.id,
        examId,
        studentId: session.studentId,
      });
    }
  }
}

module.exports = new SchedulerService();
