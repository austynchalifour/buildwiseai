import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/buildwise',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
