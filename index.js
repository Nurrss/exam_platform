const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const server = http.createServer(app);

const authRoute = require('./routes/auth');
const adminRoute = require('./routes/admin');
const newsRoute = require('./routes/news');
const textRoute = require('./routes/text');
const registerRoute = require('./routes/register');
const { logger, logEvents } = require('./middleware/logger');
const verifyJwt = require('./middleware/verifyJwt');

// You can configure it with more options as necessary

const port = 3000;

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
    },
  },
  apis: ['routes/*.js'], // Укажите путь к вашим файлам маршрутов
};
const corsConfig = {
  origin: [
    'https://jihc.edu.kz',
    'http://jihc.edu.kz',
    'http://jihc.edu.kz',
    'http://localhost:8080',
    'http://185.22.64.28/',
    'https://jihc.vercel.app',
    'https://jihc-backend-vercel.vercel.app',
  ],
  credentials: true,
};

mongoose
  .connect(
    'mongodb+srv://jihc_backend:infoCollege125@cluster0.pqp5kpg.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => console.log('Database connected!'))
  .catch((err) => console.log(err));

app.use(logger);
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
app.use(cookieParser());

app.use('/api/register', registerRoute);
app.use('/api/auth', authRoute);
app.use('/api/news', newsRoute);
app.use('/api/text', textRoute);
app.use('/api/admin', adminRoute);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log('Backend server is running at:', port);
  });
});

mongoose.connection.on('error', (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log'
  );
});

app.use(function (req, res) {
  return res.status(404).json({ message: 'Endpoint not found' });
});
