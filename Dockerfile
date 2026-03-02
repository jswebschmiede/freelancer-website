FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || '4321') + '/').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
