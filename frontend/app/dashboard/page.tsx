'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Project } from '@/lib/types';
import ProjectCard from '@/components/ProjectCard';
import { Plus, FolderOpen } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      api.getProjects()
        .then(setProjects)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const limit = user.projectsLimit ?? 3;
  const used = user.projectsThisMonth ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">My Projects</h1>
          <p className="mt-1 text-slate-400">
            {user.tier === 'pro'
              ? 'Unlimited projects with Pro'
              : `${used} of ${limit} projects used this month`}
          </p>
        </div>
        <Link href="/projects/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      ) : projects.length === 0 ? (
        <div className="card mt-12 flex flex-col items-center px-6 py-16 text-center">
          <FolderOpen className="h-12 w-12 text-slate-600" />
          <h2 className="mt-4 text-lg font-semibold">No projects yet</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            Upload a sketch or describe your project to get started with AI-powered planning.
          </p>
          <Link href="/projects/new" className="btn-primary mt-6">
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
