import { User, Project } from './types';

// Dev: frontend/.env.local → :4000. Production (unified): leave unset for same-origin.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('buildwise_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  register: (email: string, password: string, name: string) =>
    request<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<User>('/api/auth/me'),

  getProjects: () => request<Project[]>('/api/projects'),

  getProject: (id: string) => request<Project>(`/api/projects/${id}`),

  createProject: (description: string, region: string, sketch?: File) => {
    const form = new FormData();
    form.append('description', description);
    form.append('region', region);
    if (sketch) form.append('sketch', sketch);
    return request<Project>('/api/projects', { method: 'POST', body: form });
  },

  analyzeProject: (id: string) =>
    request<Project>(`/api/projects/${id}/analyze`, { method: 'POST' }),

  deleteProject: (id: string) =>
    request<{ message: string }>(`/api/projects/${id}`, { method: 'DELETE' }),

  getRegions: () => request<string[]>('/api/projects/regions'),

  getPdfUrl: (id: string) => {
    const token = getToken();
    return `${API_URL}/api/projects/${id}/pdf?token=${token}`;
  },

  downloadPdf: async (id: string, filename: string) => {
    const token = getToken();
    const res = await fetch(`${API_URL}/api/projects/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Download failed' }));
      throw new Error(err.error);
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  getSketchUrl: (sketchUrl: string) => `${API_URL}${sketchUrl}`,
};

export function setAuthToken(token: string) {
  localStorage.setItem('buildwise_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('buildwise_token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
