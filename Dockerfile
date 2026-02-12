# HAIRVEN SALON - PRODUCTION DOCKERFILE
FROM node:20-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM node:20-slim AS production
RUN apt-get update && apt-get install -y dumb-init curl && rm -rf /var/lib/apt/lists/*
RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 sveltekit
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
RUN mkdir -p /data && chown -R sveltekit:nodejs /data
USER sveltekit
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV DB_PATH=/data/appointments.db
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://localhost:3000/healthz || exit 1
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "build"]
