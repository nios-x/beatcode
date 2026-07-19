<center>
# Beatcode - Online Coding Platform
</center>
Beatcode is a scalable, real-time online coding platform that allows users to write, submit, and execute code in various programming languages (e.g., Node.js, Python), and instantly view their output. It features a modern user interface, robust backend processing, and an isolated code execution environment.

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/486e8d50-3db3-4c45-b756-1b3dc0827bb5" />

## 🏗 System Architecture

<img width="6204" height="3274" alt="Untitled-2026-07-16-0001" src="https://github.com/user-attachments/assets/ebe7981b-952d-4bf6-9658-3f02e95d1a82" />

The application is built on a distributed microservices architecture designed to handle high concurrency and isolate the risk of code execution.

1. **Frontend (Client)**: A React-based SPA built with Vite. It features a rich code editor (Monaco) and a dashboard for users to track their progress and submission history.
2. **Backend (API Gateway)**: An Express/Node.js server that handles authentication, database operations, and orchestrates code submissions.
3. **Database**: PostgreSQL (via Prisma ORM) stores user profiles, settings, and submission records.
4. **Task Queue**: A Redis List (`submissions`) is used to queue incoming code executions to prevent the backend from blocking or crashing due to heavy computation.
5. **Worker Node(s)**: A separate Node.js process that continuously pops tasks from the Redis queue. It uses `child_process.spawn` to execute the user's code in a secure environment.
6. **Pub/Sub Broker**: A Redis Pub/Sub channel (`worker-response`) where workers publish the final output (or error) of the executed code.
7. **Real-time Streaming**: The backend subscribes to the Pub/Sub channel and routes the execution results back to the original client using **Server-Sent Events (SSE)**.

### ⚡ Why Server-Sent Events (SSE)?
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/43525b80-6862-4951-b3f6-3a9d2c2f8973" />

When building the real-time execution feedback loop, SSE was deliberately chosen over alternatives:
* **WebSockets**: Requires maintaining a persistent, full-duplex connection for every active client. This consumes a significant amount of memory on the server and is notoriously difficult to scale under a large number of concurrent users.
* **Long Polling**: Can simulate real-time updates but increases overall coding complexity and introduces unnecessary HTTP overhead and latency due to repeated request-response cycles.
* **SSE (Server-Sent Events)**: Is the optimal choice because the communication pattern here is strictly unidirectional (server pushing results to the client). SSE allows the server to transmit data at any time with minimal implementation complexity and drastically lower memory footprint compared to WebSockets.

---

## 🛠 Tech Stack
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/06c9c044-c0a9-43c0-9402-5039b05e8365" />

### Frontend
- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React (Icons), Shadcn UI components
- **State & Data Fetching**: React Query, Zustand
- **Routing**: React Router
- **Editor**: Monaco Editor (`monaco-editor`)

### Backend
- **Server**: Node.js, Express (TypeScript)
- **Database / ORM**: PostgreSQL, Prisma
- **Authentication**: Better Auth (`better-auth`)
- **Queue & Pub/Sub**: Redis (`redis` client)

### Worker
- **Runtime**: Node.js (TypeScript)
- **Execution Engine**: `node:child_process` (spawns `python3` or `node` depending on the language selected)
- **Broker**: Redis

---

## 📂 Project Structure

```text
beatcode/
├── backend/                  # Express API Server
│   ├── index.ts              # Main server, SSE endpoint, API routes
│   ├── lib/                  # Authentication (Better Auth) and Prisma clients
│   ├── prisma/               # Database schema and migrations
│   └── subscriber/           # Redis Pub/Sub listener routing messages to SSE
├── frontend/                 # React UI Client
│   ├── src/
│   │   ├── components/       # Reusable UI components (Shadcn, etc.)
│   │   ├── lib/              # API hooks, utilities, auth clients
│   │   ├── pages/            # Application routes (Playground, Settings, Dashboard, etc.)
│   │   └── App.tsx           # React Router configuration
├── worker/                   # Code Execution Engine
│   ├── index.ts              # Dequeues tasks, spawns processes, publishes results
│   └── config/               # Redis connection setup
└── README.md                 # You are here
```

---

## 🚀 Step-by-Step Code Execution Flow

1. **Write Code**: The user types code into the Monaco Editor on the `PlaygroundPage` and clicks "Run".
2. **Submit**: A POST request is sent to the backend `/submit` endpoint.
3. **Persist & Queue**: The backend creates a `Pending` record in PostgreSQL (via Prisma) and pushes the raw code, language, and submission ID into the Redis `submissions` list.
4. **Wait for SSE**: The frontend establishes an SSE connection to `/events` and waits for a server push.
5. **Execute**: The `worker` pops the item from the Redis list. It spawns a child process (e.g., `python3` or `node`) and pipes the code into the process's standard input.
6. **Capture**: The worker listens to `stdout` and `stderr` streams of the spawned process, capturing the output or compilation errors.
7. **Publish**: The worker publishes a JSON payload containing the output to the Redis `worker-response` Pub/Sub channel.
8. **Relay**: The backend's `listener.ts` catches the Pub/Sub event, updates the PostgreSQL record to `Success`/`Error` with the output, and writes the data to the specific user's open SSE stream.
9. **Display**: The frontend receives the SSE payload, closes the loading state, and renders the output in the terminal panel.

---

## 🛡️ Security & Execution Limits

To ensure the safety and stability of the platform, the worker node implements several protective measures during code execution:

- **Malicious Code Prevention**: Before execution, the code is analyzed using regular expressions (`isMalicious` check) to block dangerous modules and functions.
  - **Python**: Blocks `os`, `sys`, `subprocess`, `shutil`, `importlib`, `builtins`, `socket`, `eval`, `exec`, `open`, and `__import__`.
  - **Node.js**: Blocks `require`, `import ... from`, `child_process`, `fs`, `process`, `eval`, and `Function`.
  Submissions violating these rules immediately fail with a "Security Error".
- **Execution Timeout**: A strict 5-second (5000ms) time limit is enforced on all code executions. If a process exceeds this limit (e.g., due to an infinite loop), it is forcefully terminated (`SIGKILL`), and a "Time Limit Exceeded" error is returned.
- **Reliable Result Delivery**: The worker publishes the execution results (output, error, and exit code) to the `worker-response` Redis channel. It features a retry mechanism (up to 3 times) if the initial publish operation fails.

---

## 🔧 Setup & Local Development

### Prerequisites
- Node.js & Bun
- PostgreSQL (Running locally or via Docker)
- Redis (Running locally or via Docker)
- Python (If you wish to execute Python code locally)

### Installation
1. **Clone the repository**
2. **Install dependencies in all workspaces**:
   ```bash
   cd backend && bun install
   cd ../frontend && npm install
   cd ../worker && bun install
   ```
3. **Environment Variables**: Set up your `.env` files in `backend/` and `worker/` with your `DATABASE_URL` and `REDIS_URL`.
4. **Database Migration**:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

### Environment Variables

**Backend (`backend/.env`)**
```env
REDIS_URL="..." # Upstash or local Redis URL
DATABASE_URL="..." # PostgreSQL connection string
BETTER_AUTH_SECRET="..." # Random secret for auth
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..." # Google OAuth Client ID
GOOGLE_CLIENT_SECRET="..." # Google OAuth Client Secret
```

**Worker (`worker/.env`)**
```env
REDIS_URL="..." # Must match the backend's REDIS_URL
```

### Running the Services
You need to start all three services simultaneously:

```bash
# Terminal 1: Backend
cd backend && bun run dev

# Terminal 2: Worker
cd worker && bun run dev

# Terminal 3: Frontend
cd frontend && npm run dev
```

---

## 🌐 API Endpoints

### Core Execution
- **`POST /submit`**: Accepts `{ language, code, userId }`. Pushes the task to Redis and returns a `submissionId`.
- **`GET /events`**: Establishes a Server-Sent Events (SSE) connection to stream real-time output updates.

### Dashboard & Submissions
- **`GET /api/dashboard`**: Returns aggregate user stats (total runs, languages used) and recent submissions.
- **`GET /api/daily`**: Fetches the curated code snippet of the day and recent successful runs for the user.
- **`GET /api/submissions`**: Lists the user's past code submissions with pagination and filters (`?page=1&limit=20`).
- **`GET /api/submissions/:id`**: Fetches details for a specific code submission.

### User Profile & Settings
- **`GET /api/profile`**: Retrieves user profile data and computed statistics (e.g., GitHub-style heatmap data).
- **`PUT /api/profile`**: Updates the user's profile information.
- **`PUT /api/settings`**: Updates user application settings.
