import {
  Terminal,
  GitBranch,
  CalendarDays,
  Clock,
  CheckCircle2,
  Code2,
  Sparkles,
  Activity,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/lib/api";

const LANG_GRADIENTS: Record<string, string> = {
  python: "from-sky-500 to-blue-500",
  cpp: "from-violet-500 to-purple-500",
  rust: "from-rose-500 to-red-500",
  javascript: "from-amber-500 to-orange-500",
  go: "from-emerald-500 to-teal-500",
  typescript: "from-sky-500 to-cyan-500",
  java: "from-red-500 to-orange-500",
  node: "from-emerald-500 to-green-500",
};

const LANG_DISPLAY: Record<string, string> = {
  python: "Python", cpp: "C++", javascript: "JavaScript", typescript: "TypeScript",
  rust: "Rust", go: "Go", java: "Java", node: "Node.js",
};

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

function HeatmapCell({ value }: { value: number }) {
  const intensity = value === 0
    ? "bg-zinc-100 dark:bg-zinc-800"
    : value <= 1
      ? "bg-violet-200 dark:bg-violet-900/60"
      : value <= 2
        ? "bg-violet-300 dark:bg-violet-700/70"
        : value <= 3
          ? "bg-violet-400 dark:bg-violet-600"
          : "bg-violet-500 dark:bg-violet-500";

  return (
    <div
      className={cn(
        "size-[13px] rounded-[3px] transition-all duration-200",
        "hover:scale-125 hover:ring-2 hover:ring-violet-400/30",
        intensity
      )}
      title={`${value} runs`}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto animate-pulse">
      <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-[400px] bg-zinc-200 dark:bg-zinc-800 rounded-[2rem]" />
        <div className="lg:col-span-2 space-y-4">
          <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-[2rem]" />
          <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-[2rem]" />
          <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-[2rem]" />
        </div>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  if (isLoading) return <LoadingSkeleton />;

  if (error || !data) {
    return (
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20">
          <XCircle className="size-12 text-red-400 mb-4" />
          <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-2">Failed to load profile</h2>
          <p className="text-[13px] text-zinc-400">{(error as Error)?.message ?? "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  const { user, stats, languageStats, heatmap } = data;

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const username = user.name.toLowerCase().replace(/[^a-z0-9]/g, "");

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <Sparkles className="size-3.5 text-violet-500" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            Profile
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile card */}
        <BezelCard>
          <div className="flex flex-col items-center text-center">
            {/* Gradient ring avatar */}
            <div className="relative mb-5">
              <div className="size-24 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-400 p-[3px] shadow-[0_8px_24px_-4px_rgba(139,92,246,0.3)]">
                <div className="size-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="size-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold bg-gradient-to-br from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-1 right-1 size-4 rounded-full bg-emerald-500 ring-3 ring-white dark:ring-zinc-900" />
            </div>

            <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">{user.name}</h2>
            <p className="text-[13px] font-mono text-violet-500 dark:text-violet-400 mb-3">@{username}</p>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5 max-w-[32ch]">
              Developer using Beatcode to hone coding skills and compile fast.
            </p>

            {/* Member badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 ring-1 ring-violet-200/50 dark:ring-violet-500/20 mb-5">
              <Sparkles className="size-3 text-violet-500" />
              <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">Beatcoder</span>
            </div>

            <div className="w-full space-y-2.5 text-left">
              {[
                { icon: CalendarDays, value: `Joined ${joinedDate}` },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[12px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors duration-200 cursor-default">
                  <item.icon className="size-3.5 text-zinc-400 flex-shrink-0" />
                  <span className="truncate">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </BezelCard>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Terminal, label: "Total Runs", value: stats.totalRuns.toLocaleString(), gradient: "from-violet-500 to-indigo-500" },
              { icon: CheckCircle2, label: "Success Rate", value: `${stats.successRate}%`, gradient: "from-emerald-500 to-teal-500" },
              { icon: Code2, label: "Top Language", value: LANG_DISPLAY[stats.favoriteLanguage] || stats.favoriteLanguage, gradient: "from-sky-500 to-cyan-500" },
              { icon: Clock, label: "This Month", value: stats.thisMonth.toString(), gradient: "from-amber-500 to-orange-500" },
            ].map((stat) => (
              <BezelCard key={stat.label}>
                <div className={cn(
                  "flex items-center justify-center size-9 rounded-xl bg-gradient-to-br mb-3",
                  stat.gradient,
                  "shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]"
                )}>
                  <stat.icon className="size-4 text-white" />
                </div>
                <p className="text-xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">{stat.value}</p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">{stat.label}</p>
              </BezelCard>
            ))}
          </div>

          {/* Heatmap */}
          <BezelCard>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center size-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]">
                  <Activity className="size-3.5 text-white" />
                </div>
                <h3 className="text-[14px] font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">Compile Activity (Last 24 Weeks)</h3>
              </div>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">{stats.totalRuns} total runs</span>
            </div>
            <div className="flex gap-[3px] overflow-x-auto pb-2">
              {heatmap.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => (
                    <HeatmapCell key={`${wi}-${di}`} value={day} />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-3 justify-end">
              <span className="text-[10px] text-zinc-400 mr-1">Less</span>
              {[0, 1, 2, 3, 4].map((v) => (
                <HeatmapCell key={v} value={v} />
              ))}
              <span className="text-[10px] text-zinc-400 ml-1">More</span>
            </div>
          </BezelCard>

          {/* Languages */}
          <BezelCard>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex items-center justify-center size-8 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]">
                <GitBranch className="size-3.5 text-white" />
              </div>
              <h3 className="text-[14px] font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">Languages Used</h3>
            </div>
            {languageStats.length === 0 ? (
              <p className="text-[13px] text-zinc-400">No language data yet.</p>
            ) : (
              <div className="space-y-3.5">
                {languageStats.map((lang) => {
                  const gradient = LANG_GRADIENTS[lang.name.toLowerCase()] || "from-zinc-400 to-zinc-500";
                  return (
                    <div key={lang.name} className="group/lang">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <div className={cn("size-2.5 rounded-full bg-gradient-to-r", gradient)} />
                          <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-200 group-hover/lang:text-zinc-950 dark:group-hover/lang:text-zinc-50 transition-colors">
                            {LANG_DISPLAY[lang.name] || lang.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-zinc-400">{lang.count} runs</span>
                          <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">{lang.pct}%</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", gradient)}
                          style={{ width: `${lang.pct}%`, transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </BezelCard>
        </div>
      </div>
    </div>
  );
}
