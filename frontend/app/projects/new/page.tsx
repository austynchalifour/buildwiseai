'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Upload, ImageIcon, Loader2 } from 'lucide-react';

export default function NewProjectPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('US-National');
  const [regions, setRegions] = useState<string[]>([]);
  const [sketch, setSketch] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    api.getRegions().then(setRegions).catch(() => setRegions(['US-National']));
  }, []);

  const handleFile = (file: File | null) => {
    setSketch(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setError('');
    setLoading(true);
    try {
      const project = await api.createProject(description.trim(), region, sketch || undefined);
      router.push(`/projects/${project._id}`);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">New Project</h1>
      <p className="mt-2 text-slate-400">
        Describe your project or upload a sketch — AI will generate your complete build plan.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div>
          <label className="label" htmlFor="description">Project Description</label>
          <textarea
            id="description"
            className="input min-h-[120px] resize-y"
            placeholder='e.g. "I want a 12x16 deck attached to my house with pressure-treated lumber."'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="region">Region (for pricing)</label>
          <select id="region" className="input" value={region} onChange={(e) => setRegion(e.target.value)}>
            {regions.map((r) => (
              <option key={r} value={r}>{r.replace('US-', 'US — ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Sketch or Photo (optional)</label>
          <div
            className="card flex cursor-pointer flex-col items-center border-dashed px-6 py-10 transition hover:border-brand-600/50"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Sketch preview" className="max-h-48 rounded-lg object-contain" />
            ) : (
              <>
                <Upload className="h-10 w-10 text-slate-600" />
                <p className="mt-3 text-sm text-slate-400">Click to upload sketch, photo, or blueprint</p>
                <p className="mt-1 text-xs text-slate-600">JPG, PNG, GIF, WebP, PDF — max 10 MB</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
          />
          {sketch && (
            <button type="button" className="mt-2 text-sm text-slate-400 hover:text-white" onClick={() => handleFile(null)}>
              Remove file
            </button>
          )}
        </div>

        <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</>
          ) : (
            <><ImageIcon className="h-4 w-4" /> Create & Analyze Project</>
          )}
        </button>
      </form>
    </div>
  );
}
