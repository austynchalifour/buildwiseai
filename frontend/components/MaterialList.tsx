import { MaterialItem } from '@/lib/types';

export default function MaterialList({ materials }: { materials: MaterialItem[] }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-lg font-bold">Shopping List</h2>
      <p className="mt-1 text-sm text-slate-400">Quantities include waste factor</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-left text-slate-500">
              <th className="pb-3 pr-4 font-medium">Material</th>
              <th className="pb-3 pr-4 font-medium">Qty</th>
              <th className="pb-3 pr-4 font-medium">Unit</th>
              <th className="pb-3 font-medium">Waste</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => (
              <tr key={m.name} className="border-b border-slate-800/60">
                <td className="py-3 pr-4">
                  <span className="font-medium text-white">{m.name}</span>
                  {m.notes && <p className="text-xs text-slate-500">{m.notes}</p>}
                </td>
                <td className="py-3 pr-4">{m.quantity}</td>
                <td className="py-3 pr-4 capitalize text-slate-400">{m.unit}</td>
                <td className="py-3 text-slate-400">+{Math.round(m.wasteFactor * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
