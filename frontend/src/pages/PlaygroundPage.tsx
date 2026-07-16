import { useRef, useEffect, useState } from "react";
import { Play, RotateCcw, ChevronDown, Terminal, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import * as monaco from "monaco-editor";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/authclient";
import { api } from "@/lib/api";

const LANGUAGES = [
  { id: "node", label: "Node.js", monacoId: "javascript", defaultCode: `// Write your Node.js code here\nconsole.log("Hello from Node.js!");\n` },
  { id: "python", label: "Python", monacoId: "python", defaultCode: `# Write your code here\nprint("Hello, World!")\n\nfor i in range(5):\n    print(f"Count: {i}")\n` },
];

type SessionPayload = {
  user?: {
    id?: string;
  } | null;
  id?: string | null;
};

type SubmissionPayload = {
  language: string;
  code: string;
  userId?: string | null;
};

export function PlaygroundPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [selectedLang, setSelectedLang] = useState(() => {
    const saved = localStorage.getItem("beatcode_default_lang");
    return LANGUAGES.find(l => l.id === saved) || LANGUAGES[0];
  });
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const [output, setOutput] = useState<string>("// Output will appear here after running your code...");
  const [isRunning, setIsRunning] = useState(false);
  const [profile, setProfile] = useState<{ state: "loading" | "authenticated" | "unauthenticated"; data: SessionPayload }>({ state: "loading", data: {} });

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const es = new EventSource(`${backendUrl}/events`, {
      withCredentials: true,
    });

    const handleStreamMessage = (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data);
        const outputText = data?.output?.trim() ? data.output : data?.error?.trim() || "No output";
        setIsRunning(false);
        setOutputExpanded(true);
        setOutput(outputText);
      } catch (error) {
        console.error("Failed to parse SSE payload", error);
      }
    };

    es.addEventListener("submission", handleStreamMessage as EventListener);
    es.addEventListener("message", handleStreamMessage as EventListener);

    es.onerror = (err) => {
      console.error("SSE error:", err);
      setIsRunning(false);
    };

    return () => {
      es.close();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const sessionResponse = await authClient.getSession();
      const payload = sessionResponse && typeof sessionResponse === "object" && "data" in sessionResponse && sessionResponse.data
        ? sessionResponse.data
        : (sessionResponse as SessionPayload | undefined);

      if (payload && typeof payload === "object" && "user" in payload && payload.user) {
        setProfile({ state: "authenticated", data: payload });
      } else {
        setProfile({ state: "unauthenticated", data: {} });
      }
    })();
  }, []);

  const submitMutation = useMutation({
    mutationFn: async ({ language, code, userId }: SubmissionPayload) =>
      api.post("/submit", { language, code, userId }),
  });

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = monaco.editor.create(editorRef.current, {
      value: selectedLang.defaultCode,
      language: selectedLang.monacoId,
      theme: "vs-dark",
      minimap: { enabled: false },
      fontSize: 14,
      fontFamily: "'Geist Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontLigatures: true,
      lineNumbers: "on",
      renderLineHighlight: "line",
      scrollBeyondLastLine: false,
      padding: { top: 16, bottom: 16 },
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      smoothScrolling: true,
      roundedSelection: true,
      bracketPairColorization: { enabled: true },
      automaticLayout: true,
      overviewRulerBorder: false,
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
    });

    editorInstance.current = editor;

    return () => {
      editor.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeLanguage = (lang: typeof LANGUAGES[number]) => {
    setSelectedLang(lang);
    setLangMenuOpen(false);
    if (editorInstance.current) {
      const model = editorInstance.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, lang.monacoId);
        editorInstance.current.setValue(lang.defaultCode);
      }
    }
  };

  const handleRun = async () => {
    const code = editorInstance.current?.getValue() ?? "";

    setIsRunning(true);
    setOutputExpanded(true);
    setOutput("Submitting to Beatcode...");

    try {
      const userId = profile?.data?.user?.id ?? profile?.data?.id ?? null;

      await submitMutation.mutateAsync({
        language: selectedLang.id,
        code,
        userId,
      });

      setOutput(`Waiting in Queue...`);
    } catch (err: unknown) {
      const message = err instanceof Error
        ? err.message
        : "Unknown error";
      setOutput(`❌ Submission failed\n\n${message}`);
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (editorInstance.current) {
      editorInstance.current.setValue(selectedLang.defaultCode);
    }
    setOutput("// Output will appear here after running your code...");
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-3.5rem)] md:h-[100dvh] overflow-hidden">
      {/* Toolbar */}
      <div className="relative z-[70] flex items-center justify-between px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="relative z-[80]">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium",
                "ring-1 ring-black/[0.06] dark:ring-white/[0.08]",
                "bg-zinc-50 dark:bg-zinc-800",
                "text-zinc-700 dark:text-zinc-200",
                "hover:bg-zinc-100 dark:hover:bg-zinc-700",
                "transition-all duration-200"
              )}
            >
              {selectedLang.label}
              <ChevronDown className="size-3.5" />
            </button>

            {langMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                <div className="absolute top-full left-0 mt-1 z-[90] w-44 rounded-xl bg-white dark:bg-zinc-900 ring-1 ring-black/[0.08] dark:ring-white/[0.08] shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] p-1">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => changeLanguage(lang)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150",
                        selectedLang.id === lang.id
                          ? "bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950"
                          : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning || submitMutation.isPending}
            className={cn(
              "flex items-center gap-1.5 px-5 py-1.5 rounded-lg text-[12px] font-semibold",
              "bg-emerald-500 text-white",
              "hover:bg-emerald-600",
              "active:scale-[0.98]",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Play className="size-3.5" fill="currentColor" />
            {isRunning ? "Compiling..." : "Run"}
          </button>
        </div>
      </div>

      {/* Editor + Output */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor */}
        <div className={cn("flex-1 min-h-0", outputExpanded && "h-[50%]")}>
          <div ref={editorRef} className="h-full w-full" />
        </div>

        {/* Output panel */}
        <div
          className={cn(
            "border-t border-black/[0.06] dark:border-white/[0.06] bg-zinc-950 dark:bg-zinc-900",
            "transition-all duration-300",
            outputExpanded ? "h-[40%]" : "h-10"
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
        >
          <button
            onClick={() => setOutputExpanded(!outputExpanded)}
            className="flex items-center justify-between w-full px-4 py-2 text-[12px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Terminal className="size-3.5" />
              Output
            </div>
            {outputExpanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </button>
          {outputExpanded && (
            <pre className="px-4 pb-4 overflow-auto h-[calc(100%-40px)]">
              <code className="text-[12px] font-mono leading-relaxed text-zinc-300 whitespace-pre-wrap">
                {output}
              </code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
