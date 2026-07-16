import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 py-16 bg-[#F2F2F0] dark:bg-zinc-950 overflow-hidden">
      {/* Spotlight beam */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#8b5cf6" />

      {/* Ambient mesh blob */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-violet-400/15 via-fuchsia-300/8 to-transparent blur-3xl animate-mesh-drift" />
      </div>

      {/* Back to home */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors duration-300 ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
        >
          <ArrowLeft className="size-3.5" />
          Home
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex items-center justify-center size-10 rounded-full bg-zinc-950 dark:bg-zinc-50">
            <Zap className="size-5 text-white dark:text-zinc-950" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
            Beatcode
          </span>
        </div>

        {/* Double-bezel card */}
        <div className="rounded-[2rem] p-1.5 ring-1 ring-black/[0.06] dark:ring-white/[0.08] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] bg-white/40 dark:bg-zinc-900/40">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white dark:bg-zinc-900 px-8 py-10 md:px-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight mb-2">
                {title}
              </h1>
              <p className="text-[14px] text-zinc-500 dark:text-zinc-400">
                {subtitle}
              </p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
