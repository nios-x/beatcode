# ---------- Stage 1: build ----------
FROM oven/bun:1-debian AS builder

RUN apt-get update && apt-get install -y curl python3 python3-pip && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend
COPY worker ./worker

# Frontend
WORKDIR /app/frontend
RUN bun install
RUN bun run build

# Backend
WORKDIR /app/backend
RUN bun install
RUN bunx prisma generate
RUN bun run build

# Worker (no build, just deps)
WORKDIR /app/worker
RUN bun install

# ---------- Stage 2: runtime ----------
FROM oven/bun:1-debian AS runner
WORKDIR /app

# Backend: only compiled dist + prod deps + prisma client
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/backend/prisma ./backend/prisma

# Frontend: only the build output (adjust if backend serves it from elsewhere)
COPY --from=builder /app/frontend/dist ./frontend/dist

# Worker: needs source since it isn't built
COPY --from=builder /app/worker ./worker

RUN echo '#!/bin/bash\n\
echo "Starting Backend server..."\n\
cd /app/backend && bun dist/index.js &\n\
\n\
echo "Starting Worker process..."\n\
cd /app/worker && bun index.ts &\n\
\n\
wait -n\n\
exit $?' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 3000
CMD ["/app/start.sh"]