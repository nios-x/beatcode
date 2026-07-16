import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Spotlight } from "@/components/ui/spotlight";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { motion } from "motion/react";
import {
  Code2,
  Languages,
  Terminal,
  Zap,
  Shield,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
  History,
  Gauge,
  Laptop,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Feature data ─── */
const features = [
  {
    icon: Languages,
    title: "Multi-Language Support",
    desc: "Write and compile Python, C++, Java, Rust, Go, TypeScript, and more  all from your browser with full syntax support.",
    tag: "10+ Languages",
    gradient: "from-violet-500 to-indigo-500",
    glow: "violet",
    wide: true,
  },
  {
    icon: Zap,
    title: "Instant Execution",
    desc: "Code is compiled and executed on our servers in milliseconds. See output in real time.",
    tag: "< 100ms",
    gradient: "from-amber-500 to-orange-500",
    glow: "amber",
    wide: false,
  },
  {
    icon: Terminal,
    title: "Rich Output",
    desc: "Full stdout, stderr, and compilation errors with syntax-highlighted, scrollable output panels.",
    tag: "stdout + stderr",
    gradient: "from-emerald-500 to-teal-500",
    glow: "emerald",
    wide: false,
  },
  {
    icon: Shield,
    title: "Sandboxed & Secure",
    desc: "Every execution runs in an isolated container. Your code is safe, private, and completely untouched.",
    tag: "Isolated",
    gradient: "from-sky-500 to-cyan-500",
    glow: "sky",
    wide: false,
  },
  {
    icon: Gauge,
    title: "Performance Metrics",
    desc: "Track runtime duration, memory consumption, and CPU usage for every execution with detailed breakdowns.",
    tag: "Real-time",
    gradient: "from-rose-500 to-pink-500",
    glow: "rose",
    wide: false,
  },
  {
    icon: History,
    title: "Submission History",
    desc: "Every run is saved automatically. Browse past submissions, compare outputs, and revisit your solutions.",
    tag: "Auto-saved",
    gradient: "from-fuchsia-500 to-purple-500",
    glow: "fuchsia",
    wide: false,
  },
  {
    icon: Laptop,
    title: "Monaco Editor Built-In",
    desc: "The same editor that powers VS Code — with autocomplete, bracket matching, multi-cursor, and themes baked right in.",
    tag: "VS Code Engine",
    gradient: "from-teal-500 to-cyan-500",
    glow: "teal",
    wide: true,
  },
];

const steps = [
  {
    icon: Code2,
    step: "01",
    title: "Write your code",
    desc: "Full-featured Monaco editor with syntax highlighting, autocomplete, and bracket matching.",
    accent: "bg-violet-500",
  },
  {
    icon: Zap,
    step: "02",
    title: "Hit compile",
    desc: "Select your language, hit Run. We compile and execute on blazing-fast cloud infrastructure.",
    accent: "bg-amber-500",
  },
  {
    icon: Terminal,
    step: "03",
    title: "See the output",
    desc: "Instant results — stdout, stderr, runtime, memory usage, and compilation errors.",
    accent: "bg-emerald-500",
  },
];

/* ─── Hero code preview ─── */
const heroCode = `def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

for i in range(10):
    print(f"fib({i}) = {fibonacci(i)}")`;

const heroOutput = `fib(0) = 0
fib(1) = 1
fib(2) = 1
fib(3) = 2
fib(4) = 3
fib(5) = 5
fib(6) = 8
fib(7) = 13
fib(8) = 21
fib(9) = 34`;

/* ─── Button-in-button CTA ─── */
function PrimaryCTA({ to, children, large }: { to: string; children: React.ReactNode; large?: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full font-semibold",
        "bg-zinc-950 dark:bg-zinc-50",
        "text-white dark:text-zinc-950",
        "active:scale-[0.98]",
        "transition-transform duration-300",
        large ? "pl-7 pr-2 py-3 text-[15px]" : "pl-5 pr-1.5 py-2 text-[13px]"
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
    >
      {children}
      <span
        className={cn(
          "flex items-center justify-center rounded-full",
          "bg-white/20 dark:bg-zinc-950/20",
          "transition-transform duration-300 group-hover:rotate-90 group-hover:-translate-y-0.5 group-hover:scale-105",
          large ? "size-9" : "size-6"
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
      >
        <ArrowRight className={large ? "size-4" : "size-3.5"} />
      </span>
    </Link>
  );
}

function GhostCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-7 py-3 text-[15px] font-medium",
        "text-zinc-600 dark:text-zinc-300",
        "ring-1 ring-black/[0.08] dark:ring-white/[0.1]",
        "hover:bg-black/[0.03] dark:hover:bg-white/[0.04]",
        "active:scale-[0.98]",
        "transition-all duration-300"
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
    >
      {children}
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export function LandingPage() {
  return (
    <div className="relative bg-[#F2F2F0] dark:bg-zinc-950 overflow-hidden">
      <div className="hidden lg:block absolute top-30 right-30 rotate-[40deg] translate-x-1/2 overflow-hidden w-[700px]">
        <div className="whitespace-nowrap animate-marquee text-md  opacity-20 tracking-widest">
          THIS IS THE COMPILER I REALLY NEEDED • THIS IS THE COMPILER I REALLY NEEDED • THIS IS THE COMPILER I REALLY NEEDED •
        </div>
      </div>
      <Navbar />
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 pt-28 pb-16">
        {/* Spotlight beam */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#8b5cf6" />

        {/* Ambient blobs */}
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gradient-radial from-violet-400/[0.16] via-fuchsia-300/[0.06] to-transparent blur-3xl animate-mesh-drift" />
          <div className="absolute bottom-[20%] right-[15%] w-[600px] h-[600px] rounded-full bg-gradient-radial from-sky-400/[0.10] via-cyan-300/[0.04] to-transparent blur-3xl animate-mesh-drift-slow" />
          <div className="absolute top-[60%] left-[10%] w-[400px] h-[400px] rounded-full bg-gradient-radial from-rose-400/[0.08] to-transparent blur-3xl animate-mesh-drift" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          {/* Text content */}
          <div className="text-center mb-14">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-8 ring-1 ring-black/[0.06] dark:ring-white/[0.08] bg-white/60 dark:bg-zinc-800/40 backdrop-blur-sm">
                <Sparkles className="size-3.5 text-violet-500" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  5+ Languages · Instant Compilation
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <h1
                className="font-bold text-zinc-950 dark:text-zinc-50"
                style={{
                  fontSize: "clamp(44px, 7vw, 88px)",
                  letterSpacing: "-0.04em",
                  lineHeight: "0.95",
                }}
              >
                Write. Compile.
                <br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-400 bg-clip-text text-transparent">
                    Run instantly.
                  </span>
                  {/* Animated SVG swoosh underline */}
                  <svg
                    className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-[20px] md:h-[30px] overflow-visible"
                    viewBox="0 0 300 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="swoosh-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#d946ef" />
                        <stop offset="100%" stopColor="#fb7185" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M 5 15 Q 30 28, 75 12 T 150 18 T 225 10 T 295 16"
                      stroke="url(#swoosh-gradient)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        pathLength: { duration: 1.5, delay: 0.8, ease: "easeInOut" },
                        opacity: { duration: 0.3, delay: 0.8 },
                      }}
                    />
                    <motion.path
                      d="M 5 15 Q 30 28, 75 12 T 150 18 T 225 10 T 295 16"
                      stroke="url(#swoosh-gradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.15"
                      filter="blur(4px)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.15 }}
                      transition={{
                        pathLength: { duration: 1.5, delay: 0.8, ease: "easeInOut" },
                        opacity: { duration: 0.3, delay: 0.8 },
                      }}
                    />
                  </svg>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <p className="max-w-[54ch] mx-auto mt-7 text-zinc-500 dark:text-zinc-400 text-base md:text-[17px] leading-relaxed">
                A blazing-fast online compiler. Write code in your favorite language,
                run it in the cloud, and see results in milliseconds zero setup.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
                <PrimaryCTA to="/playground" large>
                  Start Coding Free
                </PrimaryCTA>
                <GhostCTA href="#features">Explore Features</GhostCTA>
              </div>
            </ScrollReveal>
          </div>

          {/* ─── Hero Code Preview ─── */}
          <ScrollReveal delay={320}>
            <div className="rounded-[2.5rem] p-2 ring-1 ring-black/[0.06] dark:ring-white/[0.08] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.12)] bg-white/40 dark:bg-zinc-800/30 backdrop-blur-sm">
              <div className="rounded-[calc(2.5rem-0.5rem)] bg-zinc-950 dark:bg-[#0d0d0f] overflow-hidden">
                {/* Editor toolbar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="size-3 rounded-full bg-red-400/80" />
                      <div className="size-3 rounded-full bg-amber-400/80" />
                      <div className="size-3 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="font-mono text-[11px] text-zinc-500 ml-3">fibonacci.py</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-zinc-600 px-2 py-0.5 rounded-md bg-white/[0.06]">Python</span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                      <Play className="size-3" fill="currentColor" />
                      Run
                    </div>
                  </div>
                </div>

                {/* Code + Output side by side on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Code */}
                  <div className="border-b md:border-b-0 md:border-r border-white/[0.04] p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Code2 className="size-3.5 text-zinc-600" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-600">Code</span>
                    </div>
                    <pre className="overflow-x-auto">
                      <code className="text-[12.5px] md:text-[13px] leading-[1.7] font-mono">
                        {heroCode.split("\n").map((line, i) => (
                          <div key={i} className="flex">
                            <span className="text-zinc-700 w-6 text-right mr-4 select-none text-[11px]">{i + 1}</span>
                            <span className="text-zinc-300">
                              {/* Basic keyword highlighting */}
                              {line.replace(
                                /(def |return |for |if |in |print|range|f".*?")/g,
                                (match) => match
                              )}
                            </span>
                          </div>
                        ))}
                      </code>
                    </pre>
                  </div>

                  {/* Output */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-500">Output</span>
                      <span className="font-mono text-[10px] text-zinc-600 ml-auto">42ms · 3.2 MB</span>
                    </div>
                    <pre className="overflow-x-auto">
                      <code className="text-[12.5px] md:text-[13px] leading-[1.7] font-mono text-emerald-300/80">
                        {heroOutput}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Stats strip */}
          <ScrollReveal delay={400}>
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 mt-16">
              {[
                { value: "7+", label: "Languages" },
                { value: "<100ms", label: "Avg Compile" },
                { value: "10K+", label: "Users" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-4xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ FEATURES BENTO ═══ */}
      <section id="features" className="relative z-10 px-6 py-28 md:py-36">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 px-4 py-1.5 rounded-full ring-1 ring-black/[0.06] dark:ring-white/[0.08] mb-6">
                <Sparkles className="size-3 text-violet-500" />
                Features
              </span>
              <h2
                className="font-bold text-zinc-950 dark:text-zinc-50 tracking-tight"
                style={{
                  fontSize: "clamp(28px, 4vw, 52px)",
                  letterSpacing: "-0.035em",
                  lineHeight: "1.08",
                }}
              >
                Everything you need to
                <br />
                <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                  compile & run.
                </span>
              </h2>
              <p className="max-w-[48ch] mx-auto mt-5 text-zinc-500 dark:text-zinc-400 text-base leading-relaxed">
                A full-stack compilation platform with the tools developers actually need.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const glowColors: Record<string, string> = {
                violet: "from-violet-500/20 via-violet-400/5",
                amber: "from-amber-500/20 via-amber-400/5",
                emerald: "from-emerald-500/20 via-emerald-400/5",
                sky: "from-sky-500/20 via-sky-400/5",
                rose: "from-rose-500/20 via-rose-400/5",
                fuchsia: "from-fuchsia-500/20 via-fuchsia-400/5",
                teal: "from-teal-500/20 via-teal-400/5",
              };
              return (
                <ScrollReveal
                  key={f.title}
                  delay={i * 100}
                  className={cn(f.wide && "md:col-span-2")}
                >
                  <div
                    className={cn(
                      "group/card relative rounded-[2rem] p-1.5",
                      "ring-1 ring-black/[0.05] dark:ring-white/[0.06]",
                      "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]",
                      "hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.3)]",
                      "bg-white/50 dark:bg-zinc-800/30",
                      "transition-all duration-500 h-full"
                    )}
                  >
                    <GlowingEffect
                      spread={40}
                      glow={true}
                      disabled={false}
                      proximity={64}
                      inactiveZone={0.01}
                    />
                    <div className="h-full rounded-[calc(2rem-0.375rem)] bg-white dark:bg-zinc-900 p-6 md:p-8 overflow-hidden relative">
                      {/* Ambient glow blob */}
                      <div
                        className={cn(
                          "absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none",
                          "bg-gradient-radial",
                          glowColors[f.glow] || "from-violet-500/20 via-violet-400/5",
                          "to-transparent"
                        )}
                      />

                      {/* Decorative grid for wide cards */}
                      {f.wide && (
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.04]">
                          <svg width="100%" height="100%">
                            <defs>
                              <pattern id={`grid-${i}`} width="24" height="24" patternUnits="userSpaceOnUse">
                                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill={`url(#grid-${i})`} />
                          </svg>
                        </div>
                      )}

                      <div className="flex flex-col h-full relative z-10">
                        {/* Icon + Tag row */}
                        <div className="flex items-start justify-between mb-5">
                          <div
                            className={cn(
                              "flex items-center justify-center size-12 rounded-2xl",
                              "bg-gradient-to-br", f.gradient,
                              "shadow-[0_4px_16px_-2px_rgba(0,0,0,0.2)]",
                              "transition-all duration-500 group-hover/card:scale-110 group-hover/card:rotate-3 group-hover/card:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.25)]"
                            )}
                            style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
                          >
                            <f.icon className="size-5.5 text-white" />
                          </div>
                          {f.tag && (
                            <span
                              className={cn(
                                "inline-flex items-center px-3 py-1 rounded-full",
                                "font-mono text-[10px] uppercase tracking-[0.08em] font-medium",
                                "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400",
                                "ring-1 ring-black/[0.04] dark:ring-white/[0.06]",
                                "transition-all duration-300 group-hover/card:ring-black/[0.08] dark:group-hover/card:ring-white/[0.1]"
                              )}
                            >
                              {f.tag}
                            </span>
                          )}
                        </div>

                        <h3 className="text-[17px] font-bold text-zinc-950 dark:text-zinc-50 tracking-tight mb-2.5">
                          {f.title}
                        </h3>
                        <p className="text-[14px] text-zinc-500 dark:text-zinc-400 leading-[1.65] flex-1">
                          {f.desc}
                        </p>

                        {/* Subtle bottom accent line on hover */}
                        <div
                          className={cn(
                            "mt-5 h-[2px] rounded-full w-0 group-hover/card:w-12 transition-all duration-500",
                            "bg-gradient-to-r", f.gradient
                          )}
                          style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
                        />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="relative z-10 px-6 py-28 md:py-36">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 px-3 py-1.5 rounded-full ring-1 ring-black/[0.06] dark:ring-white/[0.08] mb-5">
                How It Works
              </span>
              <h2
                className="font-bold text-zinc-950 dark:text-zinc-50 tracking-tight"
                style={{
                  fontSize: "clamp(28px, 4vw, 52px)",
                  letterSpacing: "-0.035em",
                  lineHeight: "1.08",
                }}
              >
                Three steps to
                <br />
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  running code
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 120}>
                <div className={`relative rotate-5 rounded-[2rem] p-1.5 ring-1 ring-black/[0.05] dark:ring-white/[0.06] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] bg-white/50 dark:bg-zinc-800/30 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.08)] transition-shadow duration-500 h-full group/step`}>
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    variant="white"
                  />
                  <div className="h-full rounded-[calc(2rem-0.375rem)] bg-white dark:bg-zinc-900 p-6 md:p-8">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <div className={cn(
                          "flex items-center justify-center size-11 rounded-2xl",
                          s.accent,
                          "shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]",
                          "transition-transform duration-500 group-hover/step:scale-110 group-hover/step:-rotate-3"
                        )}
                          style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
                        >
                          <s.icon className="size-5 text-white" />
                        </div>
                        <span className="font-mono text-[32px] font-bold text-zinc-100 dark:text-zinc-800 leading-none select-none">
                          {s.step}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 tracking-tight mb-2">
                        {s.title}
                      </h3>
                      <p className="text-[14px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>



      {/* ═══ LIVE DEMO TERMINAL ═══ */}
      <section className="relative z-10 px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 px-3 py-1.5 rounded-full ring-1 ring-black/[0.06] dark:ring-white/[0.08] mb-5">
                See It In Action
              </span>
              <h2
                className="font-bold text-zinc-950 dark:text-zinc-50 tracking-tight"
                style={{
                  fontSize: "clamp(28px, 4vw, 48px)",
                  letterSpacing: "-0.035em",
                  lineHeight: "1.08",
                }}
              >
                Compile from your
                <br />
                <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">terminal</span>
                {" "}too
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="rounded-[2rem] p-1.5 ring-1 ring-black/[0.06] dark:ring-white/[0.08] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.12)] bg-white/40 dark:bg-zinc-800/30">
              <div className="rounded-[calc(2rem-0.375rem)] bg-zinc-950 dark:bg-[#0d0d0f] p-6 md:p-8">
                <div className="flex items-center gap-1.5 mb-5">
                  <div className="size-3 rounded-full bg-red-400/80" />
                  <div className="size-3 rounded-full bg-amber-400/80" />
                  <div className="size-3 rounded-full bg-emerald-400/80" />
                  <span className="font-mono text-[11px] text-zinc-600 ml-3">terminal</span>
                </div>
                <pre className="font-mono text-[13px] leading-[1.8]">
                  <code>
                    <span className="text-emerald-400">$</span>
                    <span className="text-zinc-300"> curl -X POST https://api.Beatcode.dev/compile \</span>
                    {"\n"}
                    <span className="text-zinc-600">  </span>
                    <span className="text-zinc-400">-H</span>
                    <span className="text-zinc-300"> "Content-Type: application/json" \</span>
                    {"\n"}
                    <span className="text-zinc-600">  </span>
                    <span className="text-zinc-400">-d</span>
                    <span className="text-zinc-300"> '</span>
                    <span className="text-amber-300">{"{"}"language":"python","code":"print(42)"{"}"}</span>
                    <span className="text-zinc-300">'</span>
                    {"\n\n"}
                    <span className="text-zinc-600">{"// Response:"}</span>
                    {"\n"}
                    <span className="text-zinc-300">{"{"}</span>
                    {"\n"}
                    <span className="text-zinc-300">  </span>
                    <span className="text-sky-400">"status"</span>
                    <span className="text-zinc-300">: </span>
                    <span className="text-emerald-400">"success"</span>
                    <span className="text-zinc-300">,</span>
                    {"\n"}
                    <span className="text-zinc-300">  </span>
                    <span className="text-sky-400">"stdout"</span>
                    <span className="text-zinc-300">: </span>
                    <span className="text-emerald-400">"42\n"</span>
                    <span className="text-zinc-300">,</span>
                    {"\n"}
                    <span className="text-zinc-300">  </span>
                    <span className="text-sky-400">"runtime"</span>
                    <span className="text-zinc-300">: </span>
                    <span className="text-amber-300">"12ms"</span>
                    <span className="text-zinc-300">,</span>
                    {"\n"}
                    <span className="text-zinc-300">  </span>
                    <span className="text-sky-400">"memory"</span>
                    <span className="text-zinc-300">: </span>
                    <span className="text-amber-300">"3.1 MB"</span>
                    {"\n"}
                    <span className="text-zinc-300">{"}"}</span>
                  </code>
                </pre>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ CLOSING CTA BAND ═══ */}
      <section className="relative z-10 mx-4 md:mx-6 mb-6">
        <ScrollReveal>
          <div className="rounded-[2.5rem] bg-zinc-950 dark:bg-zinc-900 px-8 py-24 md:py-32 text-center overflow-hidden relative">
            {/* Gradient orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-gradient-radial from-violet-500/25 via-fuchsia-500/10 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] rounded-full bg-gradient-radial from-sky-500/15 to-transparent blur-3xl pointer-events-none" />


            <div className="relative z-10">
              <span className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 px-4 py-1.5 rounded-full ring-1 ring-white/[0.08] mb-8">
                Get Started
              </span>
              <h2
                className="font-bold text-white tracking-tight mb-5"
                style={{
                  fontSize: "clamp(32px, 5vw, 60px)",
                  letterSpacing: "-0.04em",
                  lineHeight: "1.05",
                }}
              >
                Start compiling
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
                  in seconds
                </span>
              </h2>
              <p className="text-zinc-400 text-base md:text-[17px] max-w-[50ch] mx-auto mb-12 leading-relaxed">
                No downloads. No configuration. Open the editor, write your code, and hit Run. It's that simple.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className={cn(
                    "group inline-flex items-center gap-2 pl-7 pr-2 py-3 rounded-full text-[15px] font-semibold",
                    "bg-white text-zinc-950",
                    "active:scale-[0.98]",
                    "transition-transform duration-300"
                  )}
                  style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
                >
                  Create Free Account
                  <span
                    className="flex items-center justify-center size-9 rounded-full bg-zinc-950/10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105"
                    style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
                  >
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
                <Link
                  to="/playground"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[15px] font-medium text-zinc-300 ring-1 ring-white/[0.12] hover:bg-white/[0.05] active:scale-[0.98] transition-all duration-300"
                >
                  <Play className="size-4" fill="currentColor" />
                  Try Without Signing Up
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
