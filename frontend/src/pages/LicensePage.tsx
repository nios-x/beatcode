import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function LicensePage() {
  return (
    <div className="min-h-screen bg-[#F2F2F0] dark:bg-zinc-950 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-950 dark:text-zinc-50 mb-8 tracking-tight">
          License
        </h1>
        <div className="prose dark:prose-invert prose-zinc max-w-none">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Soumya Jaiswal - <a href="https://github.com/nios-x" target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline">github.com/nios-x</a> is the owner of this project.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
