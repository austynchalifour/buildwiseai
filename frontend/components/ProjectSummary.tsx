import { ProjectAnalysis } from '@/lib/types';
import { Ruler, Gauge, Clock, Wrench } from 'lucide-react';
import clsx from 'clsx';

const complexityColors = {
  beginner: 'text-brand-400 bg-brand-500/15',
  intermediate: 'text-yellow-400 bg-yellow-500/15',
  advanced: 'text-red-400 bg-red-500/15',
};

export default function ProjectSummary({ analysis }: { analysis: ProjectAnalysis }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-xl font-bold">{analysis.title}</h2>
      <p className="mt-2 text-slate-400">{analysis.summary}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-slate-800/50 p-4">
          <Ruler className="h-5 w-5 text-brand-400" />
          <p className="mt-2 text-xs text-slate-500">Dimensions</p>
          <p className="font-semibold">{analysis.dimensions.description}</p>
        </div>
        <div className="rounded-lg bg-slate-800/50 p-4">
          <Gauge className="h-5 w-5 text-brand-400" />
          <p className="mt-2 text-xs text-slate-500">Difficulty</p>
          <span className={clsx('rounded-full px-2 py-0.5 text-sm font-medium capitalize', complexityColors[analysis.complexity])}>
            {analysis.complexity}
          </span>
        </div>
        <div className="rounded-lg bg-slate-800/50 p-4">
          <Clock className="h-5 w-5 text-brand-400" />
          <p className="mt-2 text-xs text-slate-500">Time Estimate</p>
          <p className="font-semibold">{analysis.timeEstimate}</p>
        </div>
        <div className="rounded-lg bg-slate-800/50 p-4">
          <Wrench className="h-5 w-5 text-brand-400" />
          <p className="mt-2 text-xs text-slate-500">Project Type</p>
          <p className="font-semibold capitalize">{analysis.projectType.replace(/_/g, ' ')}</p>
        </div>
      </div>
    </div>
  );
}
