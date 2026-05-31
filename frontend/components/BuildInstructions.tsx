import { BuildPhase } from '@/lib/types';
import { Shield, Wrench } from 'lucide-react';

export default function BuildInstructions({ phases, tools, safety }: {
  phases: BuildPhase[];
  tools: string[];
  safety: string[];
}) {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="font-display text-lg font-bold">Tools Required</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {tools.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-sm">
              <Wrench className="h-3.5 w-3.5 text-slate-500" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display text-lg font-bold">Safety Considerations</h2>
        <ul className="mt-3 space-y-2">
          {safety.map((note) => (
            <li key={note} className="flex items-start gap-2 text-sm text-slate-300">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
              {note}
            </li>
          ))}
        </ul>
      </div>

      {phases.map((phase) => (
        <div key={phase.phase} className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">
              Phase {phase.phase}: {phase.title}
            </h3>
            <span className="text-sm text-slate-500">{phase.estimatedHours}h</span>
          </div>
          <ol className="mt-4 space-y-2">
            {phase.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-xs font-bold text-brand-400">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          {phase.safetyNotes.length > 0 && (
            <div className="mt-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20 p-3">
              <p className="text-xs font-medium text-yellow-500">Phase safety notes</p>
              <ul className="mt-1 space-y-1">
                {phase.safetyNotes.map((n) => (
                  <li key={n} className="text-xs text-slate-400">• {n}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
