import { CostBreakdown } from '@/lib/types';

export default function CostBreakdownCard({ costs }: { costs: CostBreakdown }) {
  const rows = [
    { label: 'Materials', value: costs.materials },
    { label: 'Labor', value: costs.labor },
    { label: 'Permits', value: costs.permits },
  ];

  return (
    <div className="card p-6">
      <h2 className="font-display text-lg font-bold">Cost Estimate</h2>
      <p className="mt-1 text-xs text-slate-500">
        Regional multiplier: {costs.regionalMultiplier}x
      </p>
      <div className="mt-4 space-y-3">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-slate-400">{label}</span>
            <span className="font-medium">${value.toLocaleString()}</span>
          </div>
        ))}
        <div className="border-t border-slate-700 pt-3 flex justify-between">
          <span className="font-semibold">Total Estimated Cost</span>
          <span className="text-xl font-bold text-brand-400">${costs.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
