import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Clock, Copy, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSubmission } from "@/lib/api";

const LANG_DISPLAY: Record<string, string> = {
  python: "Python", cpp: "C++", javascript: "JavaScript", typescript: "TypeScript",
  rust: "Rust", go: "Go", java: "Java", node: "Node.js",
};

export function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);

  const { data: submission, isLoading, error } = useQuery({
    queryKey: ["submission", id],
    queryFn: () => fetchSubmission(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      // Poll every 2 seconds if submission is still pending/running
      return query.state.data?.status === "pending" || !query.state.data?.isExecuted ? 2000 : false;
    }
  });

  const copyCode = () => {
    if (!submission?.code) return;
    navigator.clipboard.writeText(submission.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-5xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 text-violet-500 animate-spin" />
          <p className="text-[14px] text-zinc-500 font-medium">Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-5xl mx-auto">
        <Link to="/submissions" className="inline-flex items-center gap-2 text-[13px] font-medium text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors mb-6">
          <ArrowLeft className="size-3.5" /> Back to submissions
        </Link>
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-zinc-800/30 rounded-[2rem] ring-1 ring-black/[0.05] dark:ring-white/[0.06]">
          <XCircle className="size-12 text-red-400 mb-4" />
          <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-2">Submission Not Found</h2>
          <p className="text-[13px] text-zinc-400 mb-6">The submission you're looking for doesn't exist or you don't have access.</p>
        </div>
      </div>
    );
  }

  const StatusIcon = submission.status === "success" ? CheckCircle2 : submission.status === "error" ? XCircle : Clock;
  const statusColor = submission.status === "success" ? "text-emerald-500" : submission.status === "error" ? "text-red-400" : "text-amber-500";

  const d = new Date(submission.createdAt);
  const formattedDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const displayTitle = `${LANG_DISPLAY[submission.language] || submission.language} Run`;

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-5xl mx-auto">
      {/* Back */}
      <Link
        to="/submissions"
        className="inline-flex items-center gap-2 text-[13px] font-medium text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors mb-6"
      >
        <ArrowLeft className="size-3.5" />
        Back to submissions
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="flex-1">
          <span className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-2">
            Submission {submission.submissionId.slice(0, 8)}…
          </span>
          <h1
            className="font-bold text-zinc-950 dark:text-zinc-50 tracking-tight font-mono"
            style={{ fontSize: "clamp(20px, 3vw, 28px)", letterSpacing: "-0.02em", lineHeight: "1.2" }}
          >
            {displayTitle}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <StatusIcon className={cn("size-5", statusColor, submission.status === "pending" && "animate-pulse")} />
          <span className={cn("text-[14px] font-semibold capitalize", statusColor)}>
            {submission.status}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Language", value: LANG_DISPLAY[submission.language] || submission.language },
          { label: "Status", value: submission.isExecuted ? "Executed" : "Pending" },
          { label: "Created At", value: formattedDate },
          { label: "Execution", value: submission.status === "success" ? "Success" : submission.status === "error" ? "Failed" : "Waiting" },
        ].map((m) => (
          <div key={m.label} className="rounded-[2rem] p-1.5 ring-1 ring-black/[0.05] dark:ring-white/[0.06] bg-white/50 dark:bg-zinc-800/30">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white dark:bg-zinc-900 px-4 py-3 h-full flex flex-col justify-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 mb-1">{m.label}</p>
              <p className="text-[13px] font-medium text-zinc-950 dark:text-zinc-50 leading-tight">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Code */}
      <div className="rounded-[2rem] p-1.5 ring-1 ring-black/[0.05] dark:ring-white/[0.06] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] bg-white/50 dark:bg-zinc-800/30 mb-6">
        <div className="rounded-[calc(2rem-0.375rem)] bg-zinc-950 dark:bg-zinc-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
            <span className="font-mono text-[11px] text-zinc-400">{LANG_DISPLAY[submission.language] || submission.language}</span>
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="px-5 py-4 overflow-x-auto max-h-[400px]">
            <code className="text-[13px] leading-relaxed font-mono text-zinc-300">
              {submission.code}
            </code>
          </pre>
        </div>
      </div>

      {/* Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* stdout */}
        <div className="rounded-[2rem] p-1.5 ring-1 ring-black/[0.05] dark:ring-white/[0.06] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] bg-white/50 dark:bg-zinc-800/30">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white dark:bg-zinc-900 overflow-hidden h-full">
            <div className="px-5 py-3 border-b border-black/[0.04] dark:border-white/[0.04] flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span className="font-mono text-[11px] font-medium text-zinc-600 dark:text-zinc-300">stdout</span>
            </div>
            <pre className="px-5 py-4 min-h-[80px] overflow-auto max-h-[300px]">
              <code className="text-[12px] leading-relaxed font-mono text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">
                {!submission.isExecuted ? "(waiting for execution...)" : (submission.output || "(no output)")}
              </code>
            </pre>
          </div>
        </div>

        {/* stderr */}
        <div className="rounded-[2rem] p-1.5 ring-1 ring-black/[0.05] dark:ring-white/[0.06] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] bg-white/50 dark:bg-zinc-800/30">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white dark:bg-zinc-900 overflow-hidden h-full">
            <div className="px-5 py-3 border-b border-black/[0.04] dark:border-white/[0.04] flex items-center gap-2">
              <XCircle className="size-3.5 text-red-400" />
              <span className="font-mono text-[11px] font-medium text-zinc-600 dark:text-zinc-300">stderr</span>
            </div>
            <pre className="px-5 py-4 min-h-[80px] overflow-auto max-h-[300px]">
              <code className="text-[12px] leading-relaxed font-mono text-red-400/80 whitespace-pre-wrap">
                {!submission.isExecuted ? "(waiting for execution...)" : (submission.runtimeError || "(no errors)")}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
