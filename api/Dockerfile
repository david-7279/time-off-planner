# ── Stage 1: builder — all deps + compile
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build \
 && cp -r src/core/database/migrations dist/core/database/migrations

# ── Stage 2: production deps only
FROM node:22-alpine AS prod-deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# ── Stage 3: runner — minimal, non-root
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs expressjs

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

USER expressjs
EXPOSE 3000

# Migrations run before boot (fail-fast: if they fail, the container exits)
CMD ["node", "dist/core/database/migrate.js", "&&", "node", "dist/server.js"]