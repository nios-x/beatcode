import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-black/[0.06] dark:border-white/[0.06]">
      {/* Decorative TextHoverEffect branding */}
      <div className="hidden md:flex items-center justify-center h-24 overflow-hidden">

      </div>
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1 text-white">
            <Link to="/" className="flex items-center gap-2 font-bold   text-[15px] tracking-tight mb-3">
              <div className="flex items-center justify-center size-7 rounded-full bg-zinc-950 dark:bg-zinc-50">
                <Zap className="size-3.5 text-white dark:text-zinc-950" strokeWidth={2.5} />
              </div>
              Beatcode
            </Link>
            <p className="text-[13px] text-zinc-400 dark:text-zinc-500 font-mono leading-relaxed max-w-[28ch]">
              The online code compiler. Write, compile, and run code instantly.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Product",
              links: ["Playground", "Languages", "API", "Pricing"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"],
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Security", "License"],
            },
          ].map((group) => (
            <div key={group.title}>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link}>
                    {link === "License" ? (
                      <Link
                        to="/license"
                        className="text-[13px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors duration-300 font-medium"
                      >
                        {link}
                      </Link>
                    ) : (
                      <a
                        href="#"
                        className="text-[13px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors duration-300 font-medium"
                      >
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-black/[0.04] dark:border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 tracking-wide">
              © {new Date().getFullYear()} Beatcode. All rights reserved.
            </p>
            <p className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 tracking-wide">
              Made by <a href="https://github.com/nios-x/beatcode" target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline">nios-x</a>
            </p>
          </div>
          <div className="flex items-center gap-4">
            {["GitHub", "Discord", "X"].map((social) => (
              <a
                key={social}
                href="#"
                className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 tracking-wide transition-colors duration-300"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
