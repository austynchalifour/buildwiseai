import Link from 'next/link';
import { Project } from '@/lib/types';
import { Clock, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const statusColors = {
  pending: 'bg-yellow-500/15 text-yellow-400',
  analyzing: 'bg-blue-500/15 text-blue-400',
  completed: 'bg-brand-500/15 text-brand-400',
  failed: 'bg-red-500/15 text-red-400',
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project._id}`} className="card group block p-5 transition hover:border-brand-600/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white group-hover:text-brand-400">
            {project.analysis?.title || project.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-400">{project.description}</p>
        </div>
        <span className={clsx('shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', statusColors[project.status])}>
          {project.status}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
        {project.analysis && (
          <span className="font-medium text-brand-400">
            ${project.analysis.costs.total.toLocaleString()}
          </span>
        )}
        <ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:text-brand-400" />
      </div>
    </Link>
  );
}
