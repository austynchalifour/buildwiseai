import path from 'path';
import dotenv from 'dotenv';
import next from 'next';
import { createApiApp } from '../backend/src/app';
import { connectDatabase } from '../backend/src/config/database';
import { env } from '../backend/src/config/env';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const dev = process.env.NODE_ENV !== 'production';
const frontendDir = path.resolve(process.cwd(), 'frontend');

async function start() {
  await connectDatabase();

  const nextApp = next({ dev, dir: frontendDir });
  const handle = nextApp.getRequestHandler();
  await nextApp.prepare();

  const app = createApiApp();

  app.all('*', (req, res) => handle(req, res));

  app.listen(env.port, '0.0.0.0', () => {
    console.log(`BuildWise running on port ${env.port} (${dev ? 'development' : 'production'})`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
