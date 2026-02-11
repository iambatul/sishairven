# =============================================================================
# HAIRVEN SALON - PRODUCTION DOCKERFILE
# =============================================================================
# Multi-stage build for optimized production image
# Uses Node.js 20 Alpine for minimal size and security
# =============================================================================

# -----------------------------------------------------------------------------
# STAGE 1: Dependencies
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps

WORKDIR /app

# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    sqlite-dev

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for build)
RUN npm ci && npm cache clean --force

# -----------------------------------------------------------------------------
# STAGE 2: Build
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    sqlite-dev

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy package files
COPY package*.json ./

# Copy source code
COPY . .

# Build the application
ENV NODE_ENV=production
RUN npm run build

# -----------------------------------------------------------------------------
# STAGE 3: Production
# -----------------------------------------------------------------------------
FROM node:20-alpine AS production

# Install runtime dependencies for SQLite
RUN apk add --no-cache sqlite-libs

# Security: Run as non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 sveltekit

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy production dependencies (only production deps)
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./

# Create data directory with correct permissions
RUN mkdir -p /data && chown -R sveltekit:nodejs /data

# Switch to non-root user
USER sveltekit

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV DB_PATH=/data/appointments.db

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://localhost:3000/healthz').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "build"]

# -----------------------------------------------------------------------------
# STAGE 4: Development (optional)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS development

# Install runtime dependencies
RUN apk add --no-cache sqlite-dev

WORKDIR /app

# Install dependencies for hot reload
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Expose port for development
EXPOSE 3000
EXPOSE 24678

# Start in dev mode
CMD ["npm", "run", "dev"]
