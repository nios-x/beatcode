import { Link } from "react-router-dom";
import {
  CalendarDays,
  ArrowRight,
  Code2,
  Lightbulb,
  BookOpen,
  Tag,
  Sparkles,
  Copy,
  Check,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useQuery } from "@tanstack/react-query";
import { fetchDaily } from "@/lib/api";

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
      <div className="h-full rounded-[calc(2rem-0.375rem)] bg-white dark:bg-zinc-900 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto animate-pulse">
      <div className="flex justify-between items-end mb-10">
        <div className="h-10 w-72 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[500px] bg-zinc-200 dark:bg-zinc-800 rounded-[2rem]" />
          <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-[2rem]" />
        </div>
        <div className="h-[400px] bg-zinc-200 dark:bg-zinc-800 rounded-[2rem]" />
      </div>
    </div>
  );
}

export function DailyPage() {
  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["daily"],
    queryFn: fetchDaily,
  });

  if (isLoading) return <LoadingSkeleton />;

  if (error || !data) {
    return (
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20">
          <XCircle className="size-12 text-red-400 mb-4" />
          <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-2">Failed to load daily snippet</h2>
          <p className="text-[13px] text-zinc-400">{(error as Error)?.message ?? "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  const { today: todaySnippet, past: pastSnippets } = data;

  const copyCode = () => {
    navigator.clipboard.writeText(todaySnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="size-3.5 text-violet-500" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              Daily Snippet
            </span>
          </div>
          <h1
            className="font-bold text-zinc-950 dark:text-zinc-50 tracking-tight"
            style={{ fontSize: "clamp(28px, 3.5vw, 40px)", letterSpacing: "-0.035em", lineHeight: "1.1" }}
          >
            Today's <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Code Snippet</span>
          </h1>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full ring-1 ring-violet-200/50 dark:ring-violet-500/20 bg-violet-50/50 dark:bg-violet-500/5">
          <BookOpen className="size-4 text-violet-500" />
          <span className="text-[13px] font-medium text-violet-600 dark:text-violet-400">Learn something new every day</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Snippet card */}
        <div className="lg:col-span-2 space-y-4">
          <div className={cn(
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
            <div className="h-full rounded-[calc(2rem-0.375rem)] bg-white dark:bg-zinc-900 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]">
                <Code2 className="size-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">{todaySnippet.title}</h2>
                <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">{todaySnippet.category}</span>
              </div>
            </div>

            <p className="text-[14px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
              {todaySnippet.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {todaySnippet.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 ring-1 ring-violet-200/50 dark:ring-violet-500/20"
                >
                  <Tag className="size-2.5" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Code block */}
            <div className="rounded-[1.5rem] p-1.5 ring-1 ring-black/[0.06] dark:ring-white/[0.08] shadow-[0_12px_30px_-8px_rgba(0,0,0,0.1)] bg-zinc-900/30 mb-6">
              <div className="rounded-[calc(1.5rem-0.375rem)] bg-zinc-950 dark:bg-[#0d0d0f] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="size-2.5 rounded-full bg-red-400/80" />
                      <div className="size-2.5 rounded-full bg-amber-400/80" />
                      <div className="size-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="font-mono text-[11px] text-zinc-500 ml-2">{todaySnippet.fileName}</span>
                  </div>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-200 transition-colors px-2 py-1 rounded-md hover:bg-white/[0.06]"
                  >
                    {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="px-5 py-4 overflow-x-auto max-h-[400px]">
                  <code className="text-[13px] leading-[1.7] font-mono">
                    {todaySnippet.code.split("\n").map((line, i) => (
                      <div key={i} className="flex">
                        <span className="text-zinc-700 w-5 text-right mr-4 select-none text-[11px]">{i + 1}</span>
                        <span className="text-zinc-300">{line}</span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/playground"
              className={cn(
                "group inline-flex items-center gap-2 pl-6 pr-2 py-2.5 rounded-full text-[14px] font-semibold",
                "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white",
                "shadow-[0_4px_16px_-4px_rgba(139,92,246,0.4)]",
                "active:scale-[0.98] transition-all duration-300",
                "hover:shadow-[0_8px_24px_-4px_rgba(139,92,246,0.5)]"
              )}
              style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
            >
              Try it in Playground
              <span className="flex items-center justify-center size-7 rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105"
                style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
              >
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
            </div>
          </div>

          {/* Tips */}
          <BezelCard>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex items-center justify-center size-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]">
                <Lightbulb className="size-3.5 text-white" />
              </div>
              <h3 className="text-[14px] font-bold text-zinc-950 dark:text-zinc-50">Tips & Notes</h3>
            </div>
            <div className="space-y-4">
              {todaySnippet.tips.map((tip, i) => (
                <div key={i} className="flex gap-3 group/tip">
                  <div className="flex items-center justify-center size-7 rounded-lg bg-amber-50 dark:bg-amber-500/10 ring-1 ring-amber-200/50 dark:ring-amber-500/20 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-bold group-hover/tip:bg-amber-100 dark:group-hover/tip:bg-amber-500/20 transition-colors">
                    {i + 1}
                  </div>
                  <p className="text-[13px] text-zinc-600 dark:text-zinc-300 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </BezelCard>
        </div>

        {/* Sidebar — Past snippets */}
        <div>
          <BezelCard>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex items-center justify-center size-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]">
                <CalendarDays className="size-3.5 text-white" />
              </div>
              <h3 className="text-[14px] font-bold text-zinc-950 dark:text-zinc-50">Recent Activity</h3>
            </div>
            <div className="space-y-1.5">
              {pastSnippets.length === 0 ? (
                <p className="text-[13px] text-zinc-400 py-4 text-center">No recent submissions found.</p>
              ) : (
                pastSnippets.map((day) => {
                  const gradient = LANG_GRADIENTS[day.language.toLowerCase()] || "from-zinc-400 to-zinc-500";
                  return (
                    <Link
                      key={day.submissionId}
                      to={`/submissions/${day.submissionId}`}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-200 cursor-pointer group"
                    >
                      <div className={cn(
                        "size-8 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)]",
                        gradient
                      )}>
                        <Code2 className="size-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-zinc-950 dark:text-zinc-50 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {day.title}
                        </p>
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                          {day.date} · {LANG_DISPLAY[day.language] || day.language}
                        </p>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </BezelCard>
        </div>
      </div>
    </div>
  );
}
