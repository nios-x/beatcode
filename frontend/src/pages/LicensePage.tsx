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
          <p className="text-lg text-zinc-600 dark:text-zinc-400 font-semibold mb-4">
            MIT License
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Copyright (c) {new Date().getFullYear()} Soumya Jaiswal - <a href="https://github.com/nios-x" target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline">github.com/nios-x</a>
          </p>
          <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-4">
            <p>
              Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the "Software"), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>
            <p>
              The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.
            </p>
            <p className="uppercase">
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              SOFTWARE.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
