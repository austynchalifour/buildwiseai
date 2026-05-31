import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';

export function createApiApp(): express.Application {
  const app = express();

  const allowedOrigins = env.frontendUrl
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
      credentials: true,
    })
  );
  app.use(express.json());
  app.use('/uploads', express.static(path.resolve(env.uploadDir)));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'BuildWise AI API' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use(errorHandler);

  return app;
}
