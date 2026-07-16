import express from "express"
import type { Response, Request } from "express"
import { redisClient, subscriberClient } from "./config/redis.js"
import z from "zod"
import { submissionObject } from "./types/types.js"
import { Responses } from "./types/responses.js"
import 'dotenv/config'
import { listenOutput } from "./subscriber/listener.js"
import cors from "cors"
import { auth } from "./lib/auth.js"
import { toNodeHandler } from "better-auth/node"
import { prisma } from "./lib/prisma.js"
import path from "path"
import { existsSync } from "fs"

export const clients = new Map<string, Response>();

const app = express()
const PORT = process.env.PORT || 3000
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.all("/api/auth/*path", toNodeHandler(auth))
app.use(express.json())

const frontendDistCandidates = [
  path.resolve(process.cwd(), "frontend", "dist"),
  path.resolve(process.cwd(), "..", "frontend", "dist"),
  path.resolve(process.cwd(), "..", "..", "frontend", "dist"),
]

const frontendDistPath = frontendDistCandidates.find((candidate) => existsSync(candidate))

if (frontendDistPath) {
  app.use(express.static(frontendDistPath))
}

await redisClient.connect()
await subscriberClient.connect()
listenOutput()

/* ─── Helper: get authenticated session or return 401 ─── */
async function getSession(req: Request, res: Response) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(401).json(Responses.AUTH_ERROR);
    return null;
  }
  return session;
}

/* ──────────────────────────────────────────────────────────
   POST /submit — existing code submission endpoint
   ────────────────────────────────────────────────────────── */
app.post("/submit", async (req: Request, res: Response) => {
  console.log(req.body)
  const { data, error } = submissionObject.safeParse(req.body)
  if (error) {
    res.status(400).json(Responses.VAL_ERROR)
    return
  }

  try {
    const submission = await prisma.submission.create({
      data: {
        code: data.code,
        language: data.language,
        userId: data.userId ?? null,
        status: "pending",
        isExecuted: false,
      },
    })

    await redisClient.lPush("submissions", JSON.stringify({
      submissionId: submission.submissionId,
      code: data.code,
      language: data.language,
      userId: data.userId ?? null,
    }))

    res.status(200).json({
      ...Responses.OK,
      submissionId: submission.submissionId,
      submission,
    })
  } catch (err) {
    console.error("Failed to create submission", err)
    res.status(500).json(Responses.RUNTIME_ERROR)
  }
})

/* ──────────────────────────────────────────────────────────
   GET /events — SSE stream
   ────────────────────────────────────────────────────────── */
app.get("/events", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers
  });

  if (!session) return res.sendStatus(401);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  res.write("event: connected\n");
  clients.set(session.user.id, res);

  req.on("close", () => {
    clients.delete(session.user.id);
    res.end();
  });
});

/* ──────────────────────────────────────────────────────────
   GET /api/dashboard — dashboard stats + recent submissions
   ────────────────────────────────────────────────────────── */
app.get("/api/dashboard", async (req: Request, res: Response) => {
  const session = await getSession(req, res);
  if (!session) return;

  try {
    const userId = session.user.id;

    const [allSubs, recentSubs] = await Promise.all([
      prisma.submission.findMany({ where: { userId }, select: { language: true, status: true, createdAt: true } }),
      prisma.submission.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const totalRuns = allSubs.length;
    const successCount = allSubs.filter((s: { status: string }) => s.status === "success").length;

    // Language breakdown
    const langMap: Record<string, number> = {};
    for (const s of allSubs) {
      langMap[s.language] = (langMap[s.language] || 0) + 1;
    }
    const languageBreakdown = Object.entries(langMap)
      .map(([name, count]) => ({ name, count, pct: totalRuns > 0 ? Math.round((count / totalRuns) * 100) : 0 }))
      .sort((a, b) => b.count - a.count);

    const languagesUsed = languageBreakdown.length;

    const now = new Date();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    let thisWeek = 0;
    for (const submission of allSubs) {
      if (new Date(submission.createdAt) >= weekStart) {
        thisWeek += 1;
      }
    }

    res.json({
      user: { name: session.user.name, image: session.user.image ?? null },
      stats: {
        totalRuns,
        successCount,
        languagesUsed,
        thisWeek,
      },
      recentSubmissions: recentSubs,
      languageBreakdown,
    });
  } catch (err) {
    console.error("Dashboard error", err);
    res.status(500).json(Responses.RUNTIME_ERROR);
  }
});

/* ──────────────────────────────────────────────────────────
   GET /api/submissions — list user submissions with filters
   ────────────────────────────────────────────────────────── */
app.get("/api/submissions", async (req: Request, res: Response) => {
  const session = await getSession(req, res);
  if (!session) return;

  try {
    const userId = session.user.id;
    const language = req.query.language as string | undefined;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));

    const where: Record<string, unknown> = { userId };
    if (language) where.language = language;
    if (status) where.status = status;
    if (search) where.code = { contains: search, mode: "insensitive" };

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.submission.count({ where }),
    ]);

    res.json({ submissions, total, page, limit });
  } catch (err) {
    console.error("Submissions list error", err);
    res.status(500).json(Responses.RUNTIME_ERROR);
  }
});

/* ──────────────────────────────────────────────────────────
   GET /api/submissions/:id — single submission detail
   ────────────────────────────────────────────────────────── */
app.get("/api/submissions/:id", async (req: Request, res: Response) => {
  const session = await getSession(req, res);
  if (!session) return;

  try {
    const submission = await prisma.submission.findFirst({
      where: {
        submissionId: String(req.params.id),
        userId: session.user.id,
      },
    });

    if (!submission) {
      res.status(404).json({ code: 404, status: "Not found" });
      return;
    }

    res.json(submission);
  } catch (err) {
    console.error("Submission detail error", err);
    res.status(500).json(Responses.RUNTIME_ERROR);
  }
});

/* ──────────────────────────────────────────────────────────
   GET /api/profile — user profile + computed stats
   ────────────────────────────────────────────────────────── */
app.get("/api/profile", async (req: Request, res: Response) => {
  const session = await getSession(req, res);
  if (!session) return;

  try {
    const userId = session.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) { res.status(404).json({ code: 404, status: "User not found" }); return; }

    const allSubs = await prisma.submission.findMany({
      where: { userId },
      select: { language: true, status: true, createdAt: true },
    });

    const totalRuns = allSubs.length;
    const successCount = allSubs.filter((s: { status: string }) => s.status === "success").length;
    const successRate = totalRuns > 0 ? Math.round((successCount / totalRuns) * 100) : 0;

    // Language breakdown
    const langMap: Record<string, number> = {};
    for (const s of allSubs) {
      langMap[s.language] = (langMap[s.language] || 0) + 1;
    }
    const languageStats:any = Object.entries(langMap)
      .map(([name, count]) => ({ name, count, pct: totalRuns > 0 ? Math.round((count / totalRuns) * 100) : 0 }))
      .sort((a, b) => b.count - a.count);

    const favoriteLanguage = languageStats.length > 0 ? languageStats[0].name : "—";

    // This month count
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = allSubs.filter((s: { createdAt: Date | string }) => new Date(s.createdAt) >= monthStart).length;

    // Heatmap: last 24 weeks (168 days), 7 rows per week
    const heatmap: number[][] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let week = 23; week >= 0; week--) {
      const weekData: number[] = [];
      for (let day = 0; day < 7; day++) {
        const d = new Date(today);
        d.setDate(d.getDate() - (week * 7 + (6 - day)));
        const nextD = new Date(d);
        nextD.setDate(nextD.getDate() + 1);
        const count = allSubs.filter((s: { createdAt: Date | string }) => {
          const sd = new Date(s.createdAt);
          return sd >= d && sd < nextD;
        }).length;
        weekData.push(count);
      }
      heatmap.push(weekData);
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image ?? null,
        createdAt: user.createdAt.toISOString(),
      },
      stats: { totalRuns, successRate, favoriteLanguage, thisMonth },
      languageStats,
      heatmap,
    });
  } catch (err) {
    console.error("Profile error", err);
    res.status(500).json(Responses.RUNTIME_ERROR);
  }
});

/* ──────────────────────────────────────────────────────────
   PUT /api/profile — update user profile
   ────────────────────────────────────────────────────────── */
app.put("/api/profile", async (req: Request, res: Response) => {
  const session = await getSession(req, res);
  if (!session) return;

  try {
    const { name } = req.body;
    if (name && typeof name === "string") {
      await prisma.user.update({ where: { id: session.user.id }, data: { name } });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Profile update error", err);
    res.status(500).json(Responses.RUNTIME_ERROR);
  }
});

/* ──────────────────────────────────────────────────────────
   PUT /api/settings — update user settings (name for now)
   ────────────────────────────────────────────────────────── */
app.put("/api/settings", async (req: Request, res: Response) => {
  const session = await getSession(req, res);
  if (!session) return;

  try {
    const { name } = req.body;
    if (name && typeof name === "string") {
      await prisma.user.update({ where: { id: session.user.id }, data: { name } });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Settings update error", err);
    res.status(500).json(Responses.RUNTIME_ERROR);
  }
});

if (frontendDistPath) {
  app.use((req: Request, res: Response) => {
    if (req.path.startsWith("/api/") || req.path === "/events" || req.path.startsWith("/api-auth")) {
      return res.status(404).json({ status: "Not found" });
    }

    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

const DAILY_SNIPPETS = [
  {
    title: "Binary Search in Python",
    category: "Algorithms",
    tags: ["Python", "Search", "Algorithms"],
    description: "Binary search is a fundamental algorithm that finds the position of a target value within a sorted array. It works by repeatedly dividing the search interval in half.",
    code: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n\n    while left <= right:\n        mid = (left + right) // 2\n\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n\n    return -1\n\n# Example usage\nnumbers = [1, 3, 5, 7, 9, 11, 13, 15]\nresult = binary_search(numbers, 7)\nprint(f"Found at index: {result}")`,
    fileName: "binary_search.py",
    tips: [
      "Binary search only works on sorted arrays — always ensure your input is sorted first.",
      "The time complexity is O(log n), making it much faster than linear search for large datasets.",
      "Watch out for integer overflow when calculating mid — use `left + (right - left) // 2` in languages where this matters.",
    ],
  },
  {
    title: "Quick Sort in C++",
    category: "Algorithms",
    tags: ["C++", "Sorting", "Algorithms"],
    description: "Quick sort is an efficient, in-place sorting algorithm that uses a divide-and-conquer strategy. It picks a pivot and partitions the array around it.",
    code: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint partition(vector<int>& arr, int low, int high) {\n    int pivot = arr[high];\n    int i = low - 1;\n    for (int j = low; j < high; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            swap(arr[i], arr[j]);\n        }\n    }\n    swap(arr[i + 1], arr[high]);\n    return i + 1;\n}\n\nvoid quickSort(vector<int>& arr, int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}\n\nint main() {\n    vector<int> arr = {10, 7, 8, 9, 1, 5};\n    quickSort(arr, 0, arr.size() - 1);\n    for (int x : arr) cout << x << " ";\n    return 0;\n}`,
    fileName: "quick_sort.cpp",
    tips: [
      "Quick sort has O(n log n) average time but O(n²) worst case — randomizing the pivot helps avoid this.",
      "It's an in-place algorithm, so it uses O(log n) extra space for the recursion stack.",
      "For small sub-arrays, switching to insertion sort can improve performance.",
    ],
  },
  {
    title: "HTTP Server in Go",
    category: "Networking",
    tags: ["Go", "HTTP", "Networking"],
    description: "Go's standard library makes it incredibly easy to build performant HTTP servers. Here's a basic example with routing and JSON responses.",
    code: `package main\n\nimport (\n    "encoding/json"\n    "fmt"\n    "net/http"\n)\n\ntype Response struct {\n    Message string \`json:"message"\`\n    Status  int    \`json:"status"\`\n}\n\nfunc helloHandler(w http.ResponseWriter, r *http.Request) {\n    resp := Response{Message: "Hello, World!", Status: 200}\n    w.Header().Set("Content-Type", "application/json")\n    json.NewEncoder(w).Encode(resp)\n}\n\nfunc main() {\n    http.HandleFunc("/", helloHandler)\n    fmt.Println("Server starting on :8080")\n    http.ListenAndServe(":8080", nil)\n}`,
    fileName: "server.go",
    tips: [
      "Go's net/http package is production-ready — many companies use it without any framework.",
      "Always set Content-Type headers explicitly for JSON APIs.",
      "Use http.ListenAndServeTLS for HTTPS support in production.",
    ],
  },
  {
    title: "Linked List in Rust",
    category: "Data Structures",
    tags: ["Rust", "Data Structures", "LinkedList"],
    description: "Implementing a singly linked list in Rust demonstrates ownership and the Box smart pointer for heap allocation.",
    code: `#[derive(Debug)]\nenum List {\n    Cons(i32, Box<List>),\n    Nil,\n}\n\nimpl List {\n    fn new() -> List {\n        List::Nil\n    }\n\n    fn push(self, value: i32) -> List {\n        List::Cons(value, Box::new(self))\n    }\n\n    fn display(&self) {\n        let mut current = self;\n        while let List::Cons(val, next) = current {\n            print!("{} -> ", val);\n            current = next;\n        }\n        println!("Nil");\n    }\n}\n\nfn main() {\n    let list = List::new()\n        .push(1)\n        .push(2)\n        .push(3);\n    list.display(); // 3 -> 2 -> 1 -> Nil\n}`,
    fileName: "linked_list.rs",
    tips: [
      "Rust's ownership model makes linked lists tricky — Box<T> is the simplest approach for a basic list.",
      "For a doubly-linked list, you'd need Rc<RefCell<T>> or unsafe code.",
      "The standard library provides std::collections::LinkedList if you need a production-ready implementation.",
    ],
  },
  {
    title: "Async/Await in JavaScript",
    category: "Concurrency",
    tags: ["JavaScript", "Async", "Concurrency"],
    description: "Async/await makes asynchronous JavaScript code look synchronous, improving readability. Here's how to use it with fetch and error handling.",
    code: `// Simulated API call\nfunction fetchUser(id) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (id > 0) {\n        resolve({ id, name: "Alice", role: "Developer" });\n      } else {\n        reject(new Error("Invalid user ID"));\n      }\n    }, 1000);\n  });\n}\n\nasync function main() {\n  try {\n    console.log("Fetching user...");\n    const user = await fetchUser(1);\n    console.log("User:", JSON.stringify(user, null, 2));\n\n    // Parallel fetches\n    const [user1, user2] = await Promise.all([\n      fetchUser(1),\n      fetchUser(2),\n    ]);\n    console.log("Parallel results:", user1.name, user2.name);\n  } catch (error) {\n    console.error("Error:", error.message);\n  }\n}\n\nmain();`,
    fileName: "async_demo.js",
    tips: [
      "Always wrap await calls in try/catch for proper error handling.",
      "Use Promise.all() for parallel async operations — it's much faster than sequential awaits.",
      "An async function always returns a Promise, even if you return a plain value.",
    ],
  },
  {
    title: "File I/O in Python",
    category: "System",
    tags: ["Python", "File I/O", "System"],
    description: "Python provides clean abstractions for reading and writing files. Using context managers (with statement) ensures proper resource cleanup.",
    code: `import json\nfrom pathlib import Path\n\n# Writing to a file\ndata = {\n    "name": "Beatcode",\n    "version": "1.0",\n    "languages": ["Python", "C++", "Rust", "Go"]\n}\n\nwith open("config.json", "w") as f:\n    json.dump(data, f, indent=2)\n    print("Written to config.json")\n\n# Reading from a file\nwith open("config.json", "r") as f:\n    loaded = json.load(f)\n    print(f"App: {loaded['name']} v{loaded['version']}")\n    print(f"Languages: {', '.join(loaded['languages'])}")\n\n# Using pathlib for modern file operations\npath = Path("config.json")\nprint(f"File size: {path.stat().st_size} bytes")\nprint(f"Exists: {path.exists()}")`,
    fileName: "file_io.py",
    tips: [
      "Always use 'with' statements for file operations — they guarantee the file is closed even if an exception occurs.",
      "pathlib.Path is the modern Python way to handle file paths — it's more intuitive than os.path.",
      "For large files, read line-by-line instead of loading the entire file into memory.",
    ],
  },
  {
    title: "Hash Map in Java",
    category: "Data Structures",
    tags: ["Java", "Data Structures", "HashMap"],
    description: "Java's HashMap provides O(1) average-case lookup, insertion, and deletion. It's one of the most commonly used data structures in Java.",
    code: `import java.util.HashMap;\nimport java.util.Map;\n\npublic class Main {\n    public static void main(String[] args) {\n        HashMap<String, Integer> scores = new HashMap<>();\n\n        // Insert\n        scores.put("Alice", 95);\n        scores.put("Bob", 87);\n        scores.put("Charlie", 92);\n\n        // Lookup\n        System.out.println("Alice: " + scores.get("Alice"));\n\n        // Check existence\n        System.out.println("Has Dave? " + scores.containsKey("Dave"));\n\n        // Default value\n        int daveScore = scores.getOrDefault("Dave", 0);\n        System.out.println("Dave: " + daveScore);\n\n        // Iterate\n        for (Map.Entry<String, Integer> entry : scores.entrySet()) {\n            System.out.println(entry.getKey() + " => " + entry.getValue());\n        }\n\n        System.out.println("Total students: " + scores.size());\n    }\n}`,
    fileName: "Main.java",
    tips: [
      "HashMap allows one null key and multiple null values — be careful with NullPointerExceptions.",
      "For thread-safe operations, use ConcurrentHashMap instead.",
      "The default load factor is 0.75 — when exceeded, the map rehashes, which is O(n).",
    ],
  },
];

app.get("/api/daily", async (req: Request, res: Response) => {
  const session = await getSession(req, res);
  if (!session) return;

  try {
    // Deterministic rotation based on day-of-year for today's curated snippet
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const todayIndex = dayOfYear % DAILY_SNIPPETS.length;

    const today = DAILY_SNIPPETS[todayIndex];

    // Past snippets: real user submissions from recent days (by createdAt)
    const recentSubs = await prisma.submission.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 7,
      select: {
        submissionId: true,
        language: true,
        createdAt: true,
        status: true,
        code: true,
      },
    });

    const past = recentSubs.map((sub: { language: string; createdAt: Date | string; status: string; submissionId: string }) => {
      const d = new Date(sub.createdAt);

      const langDisplay = {
        python: "Python", cpp: "C++", javascript: "JavaScript", typescript: "TypeScript",
        rust: "Rust", go: "Go", java: "Java", node: "Node.js"
      }[sub.language] || sub.language;
      const title = `${langDisplay} Run`;

      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        title,
        category: sub.status === "success" ? "Successful Run" : sub.status === "error" ? "Error" : "Pending",
        language: sub.language,
        submissionId: sub.submissionId,
      };
    });

    res.json({ today, past });
  } catch (err) {
    console.error("Daily error", err);
    res.status(500).json(Responses.RUNTIME_ERROR);
  }
});

/* ─── Start server ─── */
const server = app.listen(PORT, () => {
  console.log("listening on port", PORT)
})

function gracefulShutdown(signal: string) {
  console.log(`Shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Could not close connections in time. Forcefully shutting down.");
    process.exit(1);
  }, 10000);
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); 