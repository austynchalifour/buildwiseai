import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';

const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.resolve(env.uploadDir)));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'BuildWise AI API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.use(errorHandler);

async function start() {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`BuildWise API running on http://localhost:${env.port}`);
  });
}

start().catch(console.error);
