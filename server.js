// server.js
import express from 'express';
import { sequelize, connectDB } from './src/database/connection/index.js';
import cors from './src/config/cors.js'
import cookieParser from 'cookie-parser';
import routes from './src/api/routes/index.js';



const app = express();

app.use(cors);
app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);

app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {},
  };

  try {
    await sequelize.authenticate();
    health.checks.database = 'ok';
  } catch (err) {
    health.checks.database = 'error';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

const start = async () => {
  await connectDB();

  app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
  });
};

start();

