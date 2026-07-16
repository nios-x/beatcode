import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, Clock, Filter, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSubmissions } from "@/lib/api";
import type { Submission } from "@/lib/api";

const languages = ["All", "python", "cpp", "javascript", "typescript", "rust", "go", "java", "node"];
const statuses = ["All", "Success", "Error", "Pending"];

const LANG_DISPLAY: Record<string, string> = {
  python: "Python", cpp: "C++", javascript: "JavaScript", typescript: "TypeScript",
  rust: "Rust", go: "Go", java: "Java", node: "Node.js",
};

function StatusBadge({ status }: { status: string }) {
  const config = {
    success: { icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 ring-emerald-200/50 dark:ring-emerald-500/20" },
    error: { icon: XCircle, color: "text-red-400 bg-red-50 dark:bg-red-500/10 ring-red-200/50 dark:ring-red-500/20" },
    pending: { icon: Clock, color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10 ring-amber-200/50 dark:ring-amber-500/20" },
  }[status] ?? { icon: Clock, color: "text-zinc-400 bg-zinc-50 dark:bg-zinc-800 ring-zinc-200/50 dark:ring-zinc-700" };

  const Icon = config.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ring-1 capitalize", config.color)}>
      <Icon className="size-3" />
      {status}
    </span>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function SubmissionsPage() {
  const [filterLang, setFilterLang] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["submissions", filterLang, filterStatus, search, page],
    queryFn: () => fetchSubmissions({
      language: filterLang !== "All" ? filterLang : undefined,
      status: filterStatus !== "All" ? filterStatus.toLowerCase() : undefined,
      search: search || undefined,
      page,
      limit: 20,
    }),
  });

  const submissions = data?.submissions ?? [];

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-2">
          Submissions
        </span>
        <h1
          className="font-bold text-zinc-950 dark:text-zinc-50 tracking-tight"
          style={{ fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.03em", lineHeight: "1.1" }}
        >
          Your submissions
        </h1>
      </div>

      {/* Filters */}
      <div className="rounded-[2rem] p-1.5 ring-1 ring-black/[0.05] dark:ring-white/[0.06] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] bg-white/50 dark:bg-zinc-800/30 mb-6">
        <div className="rounded-[calc(2rem-0.375rem)] bg-white dark:bg-zinc-900 p-4 md:p-5">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search code..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-[13px] text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 ring-1 ring-black/[0.06] dark:ring-white/[0.08] outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              {/* Language filter */}
              <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
                <Filter className="size-3.5 text-zinc-400 flex-shrink-0" />
                <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar w-full">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setFilterLang(lang);
                        setPage(1);
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all duration-200",
                        filterLang === lang
                          ? "bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950"
                          : "text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      )}
                    >
                      {LANG_DISPLAY[lang] || lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status filter */}
              <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar w-full sm:w-auto justify-start sm:justify-end">
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setFilterStatus(st);
                      setPage(1);
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all duration-200",
                      filterStatus === st
                        ? "bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950"
                        : "text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[2rem] p-1.5 ring-1 ring-black/[0.05] dark:ring-white/[0.06] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] bg-white/50 dark:bg-zinc-800/30">
        <div className="rounded-[calc(2rem-0.375rem)] bg-white dark:bg-zinc-900 overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[1fr_100px_100px_180px] gap-3 px-6 py-3 border-b border-black/[0.04] dark:border-white/[0.04]">
            {["Submission ID", "Language", "Status", "Submitted"].map((h) => (
              <span key={h} className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500">
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-black/[0.03] dark:divide-white/[0.03]">
            {isLoading ? (
              <div className="px-6 py-12 flex items-center justify-center gap-2">
                <Loader2 className="size-5 text-violet-500 animate-spin" />
                <span className="text-[13px] text-zinc-400">Loading submissions...</span>
              </div>
            ) : error ? (
              <div className="px-6 py-12 text-center">
                <p className="text-[14px] text-red-400">Failed to load submissions</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-[14px] text-zinc-400 dark:text-zinc-500">No submissions found.</p>
              </div>
            ) : (
              submissions.map((sub: Submission) => (
                <Link
                  key={sub.submissionId}
                  to={`/submissions/${sub.submissionId}`}
                  className="flex flex-col md:grid md:grid-cols-[1fr_100px_100px_180px] gap-3 px-6 py-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors duration-200 items-stretch md:items-center"
                >
                  <div className="flex items-center justify-between md:block">
                    <p className="text-[13px] font-medium text-zinc-950 dark:text-zinc-50 font-mono">
                      {sub.submissionId.slice(0, 12)}…
                    </p>
                    <span className="md:hidden font-mono text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                      {LANG_DISPLAY[sub.language] || sub.language}
                    </span>
                  </div>
                  <span className="hidden md:inline-block font-mono text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full w-fit">
                    {LANG_DISPLAY[sub.language] || sub.language}
                  </span>
                  <div className="flex items-center justify-between md:block">
                    <StatusBadge status={sub.status} />
                    <span className="md:hidden text-[11px] text-zinc-400 dark:text-zinc-500">{formatDate(sub.createdAt)}</span>
                  </div>
                  <span className="hidden md:inline-block text-[11px] text-zinc-400 dark:text-zinc-500">{formatDate(sub.createdAt)}</span>
                </Link>
              ))
            )}
          </div>

          {/* Pagination */}
          {data && data.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-black/[0.04] dark:border-white/[0.04]">
              <span className="text-[11px] text-zinc-400 font-mono text-center sm:text-left">
                Showing {((data.page - 1) * data.limit) + 1} to {Math.min(data.page * data.limit, data.total)} of {data.total} submissions
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={data.page === 1}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={data.page * data.limit >= data.total}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
