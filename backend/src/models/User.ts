import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  tier: 'free' | 'pro';
  projectsThisMonth: number;
  monthResetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    tier: { type: String, enum: ['free', 'pro'], default: 'free' },
    projectsThisMonth: { type: Number, default: 0 },
    monthResetAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
