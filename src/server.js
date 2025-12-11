require('dotenv').config();
const app = require('./app');
const { logger } = require('./config/logger');

const PORT = process.env.PORT || 3000;

const securityService = require('./services/securityService');
const schedulerService = require('./services/schedulerService');

// Auto-unlock expired session locks (runs every 30 seconds)
setInterval(async () => {
  const unlocked = await securityService.autoUnlockExpired();
  if (unlocked > 0) {
    logger.info(`Auto-unlocked ${unlocked} sessions`);
  }
}, 30 * 1000);

// Start exam scheduler (auto-publish/close exams)
schedulerService.startExamScheduler();

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});
