import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL!,
  withCredentials: true,
});

// ─── Types ───

export interface Submission {
  id: string;
  submissionId: string;
  code: string;
  output: string | null;
  language: string;
  createdAt: string;
  runtimeError: string | null;
  isExecuted: boolean;
  status: string;
  userId: string | null;
}

export interface DashboardData {
  user: { name: string; image: string | null };
  stats: {
    totalRuns: number;
    successCount: number;
    languagesUsed: number;
    thisWeek: number;
  };
  recentSubmissions: Submission[];
  languageBreakdown: { name: string; count: number; pct: number }[];
}

export interface SubmissionsResponse {
  submissions: Submission[];
  total: number;
  page: number;
  limit: number;
}

export interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    createdAt: string;
  };
  stats: {
    totalRuns: number;
    successRate: number;
    favoriteLanguage: string;
    thisMonth: number;
  };
  languageStats: { name: string; count: number; pct: number }[];
  heatmap: number[][];
}

export interface DailySnippet {
  title: string;
  category: string;
  tags: string[];
  description: string;
  code: string;
  fileName: string;
  tips: string[];
}

export interface DailyData {
  today: DailySnippet;
  past: { date: string; title: string; category: string; language: string; submissionId: string }[];
}

// ─── API Functions ───

export async function fetchDashboard(): Promise<DashboardData> {
  const { data } = await api.get("/api/dashboard");
  return data;
}

export async function fetchSubmissions(filters: {
  language?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<SubmissionsResponse> {
  const params = new URLSearchParams();
  if (filters.language && filters.language !== "All") params.set("language", filters.language);
  if (filters.status && filters.status !== "All") params.set("status", filters.status.toLowerCase());
  if (filters.search) params.set("search", filters.search);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const { data } = await api.get(`/api/submissions?${params.toString()}`);
  return data;
}

export async function fetchSubmission(submissionId: string): Promise<Submission> {
  const { data } = await api.get(`/api/submissions/${submissionId}`);
  return data;
}

export async function fetchProfile(): Promise<ProfileData> {
  const { data } = await api.get("/api/profile");
  return data;
}

export async function updateProfile(payload: { name?: string }): Promise<{ success: boolean }> {
  const { data } = await api.put("/api/profile", payload);
  return data;
}

export async function updateSettings(payload: { name?: string }): Promise<{ success: boolean }> {
  const { data } = await api.put("/api/settings", payload);
  return data;
}

export async function fetchDaily(): Promise<DailyData> {
  const { data } = await api.get("/api/daily");
  return data;
}

export { api };
