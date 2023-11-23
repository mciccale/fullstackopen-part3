const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
require('express-async-errors');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const loginRouter = require('./controllers/login');
const notesRouter = require('./controllers/notes');
const usersRouter = require('./controllers/users');

const app = express();

mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((err) => {
    logger.error('error connecting to MongoDB:', err.message);
  });

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/login', loginRouter);
app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
