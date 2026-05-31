import path from 'path';
import { Router, Response } from 'express';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { upload, getSketchUrl } from '../middleware/upload';
import { analyzeProject } from '../services/aiService';
import { generateProjectPdf } from '../services/pdfExport';
import { getAvailableRegions } from '../services/costEstimator';
import { env } from '../config/env';

const router = Router();

function resetMonthlyCountIfNeeded(user: InstanceType<typeof User>): void {
  const now = new Date();
  const resetAt = new Date(user.monthResetAt);
  if (now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear()) {
    user.projectsThisMonth = 0;
    user.monthResetAt = now;
  }
}

async function canCreateProject(userId: string): Promise<{ allowed: boolean; message?: string }> {
  const user = await User.findById(userId);
  if (!user) return { allowed: false, message: 'User not found' };

  resetMonthlyCountIfNeeded(user);
  await user.save();

  if (user.tier === 'pro') return { allowed: true };
  if (user.projectsThisMonth >= 3) {
    return { allowed: false, message: 'Free tier limit reached (3 projects/month). Upgrade to Pro for unlimited projects.' };
  }
  return { allowed: true };
}

router.get('/regions', (_req, res) => {
  res.json(getAvailableRegions());
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find({ userId: req.user!.userId })
      .sort({ createdAt: -1 })
      .select('-analysis.phases');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/', authMiddleware, upload.single('sketch'), async (req: AuthRequest, res: Response) => {
  try {
    const { description, region } = req.body;
    if (!description?.trim()) {
      res.status(400).json({ error: 'Project description is required' });
      return;
    }

    const check = await canCreateProject(req.user!.userId);
    if (!check.allowed) {
      res.status(403).json({ error: check.message });
      return;
    }

    const project = await Project.create({
      userId: req.user!.userId,
      description: description.trim(),
      region: region || 'US-National',
      sketchFilename: req.file?.filename,
      sketchUrl: req.file ? getSketchUrl(req.file.filename) : undefined,
      status: 'pending',
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/:id/analyze', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    if (project.status === 'completed') {
      res.json(project);
      return;
    }

    project.status = 'analyzing';
    await project.save();

    const sketchPath = project.sketchFilename
      ? path.join(env.uploadDir, project.sketchFilename)
      : null;

    try {
      const analysis = await analyzeProject(project.description, sketchPath, project.region || 'US-National');
      project.analysis = analysis;
      project.title = analysis.title;
      project.status = 'completed';

      const user = await User.findById(req.user!.userId);
      if (user) {
        resetMonthlyCountIfNeeded(user);
        user.projectsThisMonth += 1;
        await user.save();
      }

      await project.save();
      res.json(project);
    } catch (err) {
      project.status = 'failed';
      project.errorMessage = (err as Error).message;
      await project.save();
      res.status(500).json({ error: (err as Error).message });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/:id/pdf', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    if (project.status !== 'completed' || !project.analysis) {
      res.status(400).json({ error: 'Project analysis must be completed before exporting PDF' });
      return;
    }

    const user = await User.findById(req.user!.userId);
    if (user?.tier === 'free') {
      res.status(403).json({ error: 'PDF export requires Pro tier' });
      return;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="buildwise-${project._id}.pdf"`);
    generateProjectPdf(project).pipe(res);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
