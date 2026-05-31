import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Router, Response } from 'express';
import { User } from '../models/User';
import { env } from '../config/env';
import { AuthRequest } from '../middleware/auth';

const router = Router();

function resetMonthlyCountIfNeeded(user: InstanceType<typeof User>): void {
  const now = new Date();
  const resetAt = new Date(user.monthResetAt);
  if (now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear()) {
    user.projectsThisMonth = 0;
    user.monthResetAt = now;
  }
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ email: email.toLowerCase(), password: hashed, name });

    const token = jwt.sign({ userId: user._id.toString(), email: user.email }, env.jwtSecret, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name, tier: user.tier },
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user._id.toString(), email: user.email }, env.jwtSecret, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name, tier: user.tier },
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const payload = jwt.verify(header.slice(7), env.jwtSecret) as { userId: string };
    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    resetMonthlyCountIfNeeded(user);
    await user.save();

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      tier: user.tier,
      projectsThisMonth: user.projectsThisMonth,
      projectsLimit: user.tier === 'pro' ? null : 3,
    });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
