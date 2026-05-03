# ── Stage 1: Install deps and build ─────────────────────────────────────────
FROM node:20-bookworm-slim AS builder

WORKDIR /app

ENV NODE_ENV=production

ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
ARG NEXT_PUBLIC_API_URL=http://backend:3001/api/v1
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm ci

COPY next.config.ts ./
COPY jsconfig.json ./
COPY eslint.config.mjs ./
COPY public ./public
COPY src ./src

RUN npm run build

# ── Stage 2: Production runtime ──────────────────────────────────────────────
FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only what Next.js needs at runtime
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Force Next.js standalone to bind on all interfaces, not just the container hostname IP
ENV HOSTNAME=0.0.0.0

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => process.exit(r.statusCode < 400 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
