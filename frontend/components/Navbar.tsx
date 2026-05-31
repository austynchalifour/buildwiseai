'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Hammer, LogOut, LayoutDashboard, Plus } from 'lucide-react';

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
            <Hammer className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">BuildWise AI</span>
        </Link>

        <nav className="flex items-center gap-3">
          {!loading && user ? (
            <>
              <Link href="/dashboard" className="btn-secondary hidden sm:inline-flex">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/projects/new" className="btn-primary">
                <Plus className="h-4 w-4" />
                New Project
              </Link>
              <span className="hidden text-sm text-slate-400 md:inline">
                {user.name}
                {user.tier === 'pro' && (
                  <span className="ml-2 rounded-full bg-brand-600/20 px-2 py-0.5 text-xs font-medium text-brand-400">
                    Pro
                  </span>
                )}
              </span>
              <button onClick={logout} className="btn-secondary px-3" aria-label="Log out">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : !loading ? (
            <>
              <Link href="/login" className="btn-secondary">Log in</Link>
              <Link href="/register" className="btn-primary">Get Started</Link>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
