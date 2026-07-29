// src/lib/api-client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("clarity_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<{ access_token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (name: string, email: string, password: string) =>
    request<{ access_token: string; user: any }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  ingestDocument: (projectId: string, docName: string, text: string) =>
    request<{ status: string; chunks_indexed: number }>("/chat/ingest", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId, doc_name: docName, text }),
    }),

  getProjects: () => request<any[]>("/projects"),
  getDocuments: (projectId: string) =>
    request<any[]>(`/projects/${projectId}/documents`),

  getProject: (projectId: string) => request<any>(`/projects/${projectId}`),

  getCodeFiles: (projectId: string) =>
    request<any[]>(`/projects/${projectId}/code-files`),

  syncGithub: (projectId: string, branch: string = "main") =>
    request<{ synced: number; skipped: number; total_files: number }>(
      `/projects/${projectId}/sync-github?branch=${branch}`,
      { method: "POST" },
    ),

  askClarity: (question: string) =>
    request<{ answer: string; sources: any[] }>("/chat/ask", {
      method: "POST",
      body: JSON.stringify({ question }),
    }),
};

export function saveToken(token: string) {
  localStorage.setItem("clarity_token", token);
}

export function clearToken() {
  localStorage.removeItem("clarity_token");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
