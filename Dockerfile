# Development image
FROM oven/bun:1 as development

WORKDIR /app

# Copy package files
COPY package.json .
COPY bun.lockb .

# Install dependencies
RUN bun install

# Copy the Prisma schema into the image
COPY prisma ./prisma

# Generate Prisma Client
RUN bunx prisma generate

# Start development server
CMD ["bun", "run", "dev"]

# Production build stage
FROM oven/bun:1 as builder

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --frozen-lockfile

# Generate Prisma Client for the builder stage
RUN bunx prisma generate

COPY . .

RUN bun run build

# Production image
FROM oven/bun:1-slim as production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .

EXPOSE 3000

CMD ["bun", "run", "start"]