import { Link } from "react-router-dom";
import {
  Terminal,
  Code2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Languages,
  HardDrive,
  Sparkles,
  Activity,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/lib/api";
import type { DashboardData, Submission } from "@/lib/api";

const LANG_COLORS: Record<string, string> = {
  python: "from-sky-400 to-blue-500",
  cpp: "from-violet-400 to-purple-500",
  javascript: "from-amber-400 to-orange-500",
  typescript: "from-sky-400 to-cyan-500",
  rust: "from-rose-400 to-red-500",
  go: "from-emerald-400 to-teal-500",
  java: "from-red-400 to-orange-500",
  node: "from-emerald-400 to-green-500",
};

const LANG_BAR_COLORS: Record<string, string> = {
  python: "bg-sky-500",
  cpp: "bg-violet-500",
  javascript: "bg-amber-500",
  typescript: "bg-sky-400",
  rust: "bg-rose-500",
  go: "bg-emerald-500",
  java: "bg-red-500",
  node: "bg-green-500",
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function BezelCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "rounded-[2rem] p-1.5 ring-1 ring-black/[0.05] dark:ring-white/[0.06]",
      "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]",
      "bg-white/50 dark:bg-zinc-800/30",
      "hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.08)]",
      "transition-shadow duration-500",
      className
    )}>
      <div className="h-full rounded-[calc(2rem-0.375rem)] bg-white dark:bg-zinc-900 p-6">
        {children}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto animate-pulse">
      <div className="h-10 w-72 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-10" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-[2rem]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-80 bg-zinc-200 dark:bg-zinc-800 rounded-[2rem]" />
        <div className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-[2rem]" />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });

  if (isLoading) return <LoadingSkeleton />;

  if (error || !data) {
    return (
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20">
          <XCircle className="size-12 text-red-400 mb-4" />
          <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-2">Failed to load dashboard</h2>
          <p className="text-[13px] text-zinc-400">{(error as Error)?.message ?? "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  const { user, stats, recentSubmissions, languageBreakdown } = data;

  const statCards = [
    { icon: Terminal, label: "Total Runs", value: String(stats.totalRuns), change: `${stats.successCount} successful`, gradient: "from-violet-500 to-indigo-500" },
    { icon: CheckCircle2, label: "Successful", value: String(stats.successCount), change: stats.totalRuns > 0 ? `${Math.round((stats.successCount / stats.totalRuns) * 100)}% rate` : "—", gradient: "from-emerald-500 to-teal-500" },
    { icon: Languages, label: "Languages Used", value: String(stats.languagesUsed), change: languageBreakdown.length > 0 ? `${languageBreakdown[0].name} most used` : "—", gradient: "from-sky-500 to-cyan-500" },
    { icon: Activity, label: "Weekly Runs", value: String(stats.thisWeek), change: "Active this week", gradient: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="size-3.5 text-violet-500" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              Dashboard
            </span>
          </div>
          <h1
            className="font-bold text-zinc-950 dark:text-zinc-50 tracking-tight"
            style={{ fontSize: "clamp(28px, 3.5vw, 40px)", letterSpacing: "-0.035em", lineHeight: "1.1" }}
          >
            Welcome back, <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-400 bg-clip-text text-transparent">{user.name}</span>
          </h1>
        </div>
        <Link
          to="/playground"
          className={cn(
            "group inline-flex items-center gap-2 pl-5 pr-1.5 py-2 rounded-full text-[13px] font-semibold",
            "bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950",
            "active:scale-[0.98] transition-transform duration-300"
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
        >
          New Compilation
          <span className="flex items-center justify-center size-7 rounded-full bg-white/20 dark:bg-zinc-950/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105"
            style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
          >
            <ArrowRight className="size-3.5" />
          </span>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className={cn(
            "relative rounded-[2rem] p-1.5 ring-1 ring-black/[0.05] dark:ring-white/[0.06]",
            "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]",
            "bg-white/50 dark:bg-zinc-800/30",
            "hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.08)]",
            "transition-shadow duration-500"
          )}>
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="h-full rounded-[calc(2rem-0.375rem)] bg-white dark:bg-zinc-900 p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    "flex items-center justify-center size-10 rounded-2xl bg-gradient-to-br",
                    stat.gradient,
                    "shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]"
                  )}
                >
                  <stat.icon className="size-4.5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">{stat.value}</p>
              <p className="text-[12px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">{stat.label}</p>
              <p className="text-[11px] text-emerald-500 font-medium mt-2 flex items-center gap-1">
                <TrendingUp className="size-3" />
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent submissions */}
        <div className="lg:col-span-2">
          <BezelCard>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center size-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]">
                  <Activity className="size-3.5 text-white" />
                </div>
                <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">Recent Runs</h2>
              </div>
              <Link
                to="/submissions"
                className="flex items-center gap-1 text-[12px] font-medium text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
              >
                View all <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="space-y-1.5">
              {recentSubmissions.length === 0 ? (
                <p className="text-[13px] text-zinc-400 dark:text-zinc-500 py-8 text-center">No submissions yet. Try the playground!</p>
              ) : (
                recentSubmissions.map((sub: Submission) => {
                  const langKey = sub.language.toLowerCase();
                  const color = LANG_COLORS[langKey] || "from-zinc-400 to-zinc-500";
                  return (
                    <Link
                      key={sub.submissionId}
                      to={`/submissions/${sub.submissionId}`}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-200 group"
                    >
                      {sub.status === "success" ? (
                        <div className="size-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-200/50 dark:ring-emerald-500/20">
                          <CheckCircle2 className="size-4 text-emerald-500" />
                        </div>
                      ) : sub.status === "error" ? (
                        <div className="size-8 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center ring-1 ring-red-200/50 dark:ring-red-500/20">
                          <XCircle className="size-4 text-red-400" />
                        </div>
                      ) : (
                        <div className="size-8 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center ring-1 ring-amber-200/50 dark:ring-amber-500/20">
                          <Loader2 className="size-4 text-amber-500 animate-spin" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-zinc-950 dark:text-zinc-50 truncate font-mono group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {sub.submissionId.slice(0, 8)}…
                        </p>
                      </div>
                      <span className={cn(
                        "font-mono text-[10px] font-semibold text-white px-2 py-0.5 rounded-full bg-gradient-to-r",
                        color
                      )}>
                        {sub.language}
                      </span>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500 hidden md:block w-20 text-right">
                        {timeAgo(sub.createdAt)}
                      </span>
                      <ArrowRight className="size-3.5 text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Link>
                  );
                })
              )}
            </div>
          </BezelCard>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Language breakdown */}
          <BezelCard>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex items-center justify-center size-8 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]">
                <Languages className="size-3.5 text-white" />
              </div>
              <h3 className="text-[14px] font-bold text-zinc-950 dark:text-zinc-50">Language Usage</h3>
            </div>
            {languageBreakdown.length === 0 ? (
              <p className="text-[12px] text-zinc-400 text-center py-4">No data yet</p>
            ) : (
              <>
                {/* Stacked bar */}
                <div className="h-3 rounded-full overflow-hidden flex mb-4">
                  {languageBreakdown.map((lang) => (
                    <div
                      key={lang.name}
                      className={cn("h-full first:rounded-l-full last:rounded-r-full", LANG_BAR_COLORS[lang.name.toLowerCase()] || "bg-zinc-400")}
                      style={{ width: `${lang.pct}%` }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {languageBreakdown.map((lang) => (
                    <div key={lang.name} className="flex items-center gap-2">
                      <div className={cn("size-2.5 rounded-full", LANG_BAR_COLORS[lang.name.toLowerCase()] || "bg-zinc-400")} />
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{lang.name}</span>
                      <span className="text-[11px] font-mono text-zinc-400 ml-auto">{lang.pct}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </BezelCard>

          {/* Quick actions */}
          <BezelCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center size-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]">
                <Code2 className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-zinc-950 dark:text-zinc-50">Quick Start</h3>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Jump into the editor</p>
              </div>
            </div>
            <Link
              to="/playground"
              className={cn(
                "group flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold",
                "bg-gradient-to-r from-emerald-500 to-teal-500",
                "text-white shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]",
                "active:scale-[0.99]",
                "transition-all duration-300 hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.2)]"
              )}
              style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
            >
              Open Playground
              <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          </BezelCard>

          <BezelCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center size-10 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]">
                <HardDrive className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-zinc-950 dark:text-zinc-50">History</h3>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{stats.totalRuns} submissions saved</p>
              </div>
            </div>
            <Link
              to="/submissions"
              className={cn(
                "group flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold",
                "ring-1 ring-black/[0.08] dark:ring-white/[0.1]",
                "text-zinc-700 dark:text-zinc-200",
                "hover:bg-zinc-50 dark:hover:bg-zinc-800",
                "active:scale-[0.99]",
                "transition-all duration-300"
              )}
              style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
            >
              View All
              <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          </BezelCard>
        </div>
      </div>
    </div>
  );
}
