import Link from 'next/link';
import { Upload, Calculator, ShoppingCart, FileText, Layers, Clock } from 'lucide-react';

const features = [
  { icon: Upload, title: 'Upload a Sketch', desc: 'Hand-drawn sketch, photo, blueprint, or written description.' },
  { icon: Calculator, title: 'AI Analysis', desc: 'Identifies project type, dimensions, materials, and complexity.' },
  { icon: ShoppingCart, title: 'Shopping List', desc: 'Exact quantities with Home Depot & Lowe\'s product matches.' },
  { icon: FileText, title: 'Cost Estimate', desc: 'Materials, labor, and permit costs with regional pricing.' },
  { icon: Layers, title: 'Build Instructions', desc: 'Phased step-by-step guide with tools and safety notes.' },
  { icon: Clock, title: 'Time & Difficulty', desc: 'Beginner to advanced rating with realistic time estimates.' },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 via-slate-950 to-slate-950" />
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-600/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-400">
            AI-Powered Construction Planning
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Turn your sketch into a{' '}
            <span className="text-brand-400">complete build plan</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Upload a sketch of what you want to build and instantly receive a material list,
            cost estimate, shopping cart, and step-by-step construction plan.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register" className="btn-primary px-8 py-3 text-base">
              Start Building Free
            </Link>
            <Link href="/login" className="btn-secondary px-8 py-3 text-base">
              Log In
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">Free tier: 3 projects per month. No credit card required.</p>
        </div>
      </section>

      <section className="border-t border-slate-800 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-3xl font-bold">Everything you need in one workflow</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-600/15">
                  <Icon className="h-5 w-5 text-brand-400" />
                </div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold">Ready to plan your next project?</h2>
          <p className="mt-4 text-slate-400">
            Decks, fences, pergolas, sheds, and more — BuildWise AI handles it all.
          </p>
          <Link href="/projects/new" className="btn-primary mt-8 inline-flex px-8 py-3 text-base">
            Create Your First Project
          </Link>
        </div>
      </section>
    </div>
  );
}
