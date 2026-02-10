# Deployment Guide

Complete guide for deploying the Hairven Salon website to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Docker Deployment](#docker-deployment)
- [Caddy Reverse Proxy](#caddy-reverse-proxy)
- [SSL/HTTPS](#sslhttps)
- [Database Setup](#database-setup)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git
- Node.js 20+ (for local development)

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sishairven
   ```

2. Copy environment template:
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

3. Run the deployment script:
   ```bash
   ./scripts/deploy.sh
   ```

4. Verify deployment:
   ```bash
   ./scripts/health-check.sh --detailed
   ```

## Environment Setup

### Required Variables

Edit `.env` with your production values:

```bash
# Site Configuration
PUBLIC_SITE_URL=https://sishairven.com
PUBLIC_SITE_NAME="Hairven by Elyn"
NODE_ENV=production

# Analytics (optional)
PUBLIC_GA4_ID=G-XXXXXXXXXX
PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX

# Database
DB_PATH=/data/appointments.db

# Security
CSP_NONCE_SECRET=$(openssl rand -hex 32)
```

See [ENVIRONMENT.md](ENVIRONMENT.md) for complete variable reference.

## Docker Deployment

### Build and Run

```bash
# Build the image
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### With Caddy (Recommended)

```bash
# Start with Caddy reverse proxy
docker-compose --profile with-caddy up -d
```

### Production Build

```bash
# Build for production
DOCKER_BUILDKIT=1 docker-compose build --no-cache

# Deploy
docker-compose up -d
```

## Caddy Reverse Proxy

Caddy provides automatic HTTPS via Let's Encrypt.

### Configuration

The `Caddyfile` includes:

- Automatic HTTPS
- Security headers (HSTS, CSP, etc.)
- Compression (gzip, zstd)
- Cloudflare IP forwarding
- Static asset caching

### Custom Domain

Edit `Caddyfile` and replace:

```
https://sishairven.com, https://www.sishairven.com {
```

with your domain.

### Cloudflare Setup

1. Add your domain to Cloudflare
2. Set DNS A record to your server IP
3. Enable "Full (Strict)" SSL/TLS mode
4. Add Cloudflare IPs to Caddy trusted proxies (already configured)

## SSL/HTTPS

### Let's Encrypt (Automatic)

Caddy automatically obtains and renews certificates.

### Cloudflare Origin Certificates

1. Generate Origin Certificate in Cloudflare
2. Save as `certs/cloudflare-origin.pem` and `certs/cloudflare-origin.key`
3. Update Caddyfile to use these certificates

### Manual Certificates

```bash
# Using Certbot
sudo certbot certonly --standalone -d sishairven.com -d www.sishairven.com
```

## Database Setup

### Initial Migration

```bash
# Run migrations
./database/migrate.sh up

# Check status
./database/migrate.sh status
```

### Backup Strategy

The deployment script automatically creates backups. Manual backup:

```bash
# Create backup
./database/migrate.sh backup

# Backups are stored in database/backups/
```

### Automated Backups

Add to crontab for daily backups:

```bash
0 2 * * * cd /opt/hairven && ./database/migrate.sh backup
```

## Monitoring

### Health Checks

```bash
# Basic check
curl http://localhost:3000/healthz

# Detailed check with authentication
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/healthz?detailed=true
```

### Continuous Monitoring

```bash
# Start watch mode
./scripts/health-check.sh --watch --interval 60
```

### Docker Health Check

The container includes a built-in health check:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://localhost:3000/healthz').then(r => r.ok ? process.exit(0) : process.exit(1))"
```

### External Monitoring

Recommended services:

- **UptimeRobot**: Free uptime monitoring
- **Pingdom**: Paid with advanced features
- **Sentry**: Error tracking (configure `SENTRY_DSN`)

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs hairven

# Check for port conflicts
sudo netstat -tlnp | grep 3000

# Verify environment variables
docker-compose config
```

### Database Errors

```bash
# Check database permissions
ls -la /data/

# Run migrations manually
docker-compose exec hairven ./database/migrate.sh up

# Restore from backup
cp database/backups/appointments_*.db /data/appointments.db
```

### SSL Issues

```bash
# Check certificate
curl -vI https://sishairven.com

# Force certificate refresh
docker-compose exec caddy caddy reload
```

### High Memory Usage

```bash
# Check memory usage
docker stats hairven-salon

# Restart container
docker-compose restart hairven

# Adjust memory limits in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 512M
```

### Logs and Debugging

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f hairven

# View recent errors
docker-compose logs --tail=100 hairven | grep ERROR
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates working
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] Rate limiting tested
- [ ] Security headers verified
- [ ] CDN configured (Cloudflare)
- [ ] DNS records updated

## Update Procedure

1. Pull latest code:
   ```bash
   git pull origin main
   ```

2. Run migrations:
   ```bash
   ./database/migrate.sh up
   ```

3. Deploy:
   ```bash
   ./scripts/deploy.sh
   ```

4. Verify:
   ```bash
   ./scripts/health-check.sh --detailed
   ```

## Rollback

If deployment fails:

```bash
# Stop current containers
docker-compose down

# Restore database from backup
cp database/backups/appointments_<timestamp>.db /data/appointments.db

# Restart with previous image
docker-compose up -d
```
