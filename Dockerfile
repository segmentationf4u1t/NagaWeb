# Development image
FROM oven/bun:1 as development

WORKDIR /app

# Copy package files
COPY package.json .
COPY bun.lockb .

# Install dependencies
RUN bun install

# Start development server
CMD ["bun", "run", "dev"]

# Production build stage
FROM oven/bun:1 as builder

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

# Production image
FROM oven/bun:1-slim as production

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["bun", "run", "start"]