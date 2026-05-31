// Standalone API-only mode (legacy). Prefer: npm run dev from repo root.
import path from 'path';
import dotenv from 'dotenv';
import { createApiApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function start() {
  await connectDatabase();
  const app = createApiApp();
  app.listen(env.port, '0.0.0.0', () => {
    console.log(`BuildWise API running on port ${env.port}`);
  });
}

start().catch(console.error);
