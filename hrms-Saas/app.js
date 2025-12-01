// app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/config/logger');
const { swaggerUi, swaggerSpec } = require('./src/config/swagger');


const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const requestLogger = require('./src/middleware/requestLogger');

// Request logging
app.use(requestLogger);

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'HRMS SaaS API running' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true
}));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


app.use('/api', routes);

// 404
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// error handler
app.use(errorHandler);

module.exports = app;
