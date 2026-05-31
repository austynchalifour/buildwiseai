'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Project } from '@/lib/types';
import ProjectSummary from '@/components/ProjectSummary';
import CostBreakdownCard from '@/components/CostBreakdown';
import MaterialList from '@/components/MaterialList';
import ProductMapping from '@/components/ProductMapping';
import BuildInstructions from '@/components/BuildInstructions';
import { Loader2, Download, Trash2, ArrowLeft, Sparkles } from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [pdfError, setPdfError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !id) return;
    api.getProject(id).then(setProject).catch((e) => setError(e.message));
  }, [user, id]);

  useEffect(() => {
    if (!project || project.status !== 'pending' || analyzing) return;
    runAnalysis();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?._id, project?.status]);

  const runAnalysis = async () => {
    if (!id) return;
    setAnalyzing(true);
    setError('');
    try {
      const updated = await api.analyzeProject(id);
      setProject(updated);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Delete this project?')) return;
    await api.deleteProject(id);
    router.push('/dashboard');
  };

  const handlePdf = async () => {
    if (!id || !project) return;
    setPdfError('');
    try {
      await api.downloadPdf(id, `buildwise-${project.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (err) {
      setPdfError((err as Error).message);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!project && !error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-red-400">{error}</p>
        <Link href="/dashboard" className="btn-secondary mt-4 inline-flex">Back to Dashboard</Link>
      </div>
    );
  }

  const isAnalyzing = analyzing || project?.status === 'analyzing';
  const isComplete = project?.status === 'completed' && project.analysis;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex gap-2">
          {isComplete && (
            <button onClick={handlePdf} className="btn-secondary">
              <Download className="h-4 w-4" /> Export PDF
            </button>
          )}
          <button onClick={handleDelete} className="btn-secondary text-red-400 hover:text-red-300">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      {pdfError && (
        <div className="mt-4 rounded-lg border border-yellow-800 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
          {pdfError} — PDF export requires Pro tier.
        </div>
      )}

      {isAnalyzing && (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <Sparkles className="h-10 w-10 animate-pulse text-brand-400" />
          <h2 className="mt-4 text-xl font-semibold">Analyzing your project...</h2>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            AI is identifying structure type, calculating materials, matching products, and generating build instructions.
          </p>
          <Loader2 className="mt-6 h-6 w-6 animate-spin text-brand-500" />
        </div>
      )}

      {project?.status === 'failed' && (
        <div className="card mt-8 p-6">
          <p className="text-red-400">Analysis failed: {project.errorMessage}</p>
          <button onClick={runAnalysis} className="btn-primary mt-4">Retry Analysis</button>
        </div>
      )}

      {isComplete && project.analysis && (
        <div className="mt-8 space-y-6">
          {project.sketchUrl && (
            <div className="card overflow-hidden p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={api.getSketchUrl(project.sketchUrl)}
                alt="Project sketch"
                className="max-h-64 w-full rounded-lg object-contain"
              />
            </div>
          )}

          <ProjectSummary analysis={project.analysis} />

          <div className="grid gap-6 lg:grid-cols-2">
            <CostBreakdownCard costs={project.analysis.costs} />
            <MaterialList materials={project.analysis.materials} />
          </div>

          <ProductMapping products={project.analysis.products} />

          <BuildInstructions
            phases={project.analysis.phases}
            tools={project.analysis.toolsRequired}
            safety={project.analysis.safetyConsiderations}
          />
        </div>
      )}
    </div>
  );
}
