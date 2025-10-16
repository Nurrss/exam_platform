require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

const securityService = require('./services/securityService');

setInterval(async () => {
  const unlocked = await securityService.autoUnlockExpired();
  if (unlocked > 0) {
    console.log(`⏱ Автоматически разблокировано ${unlocked} сессий`);
  }
}, 30 * 1000);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
