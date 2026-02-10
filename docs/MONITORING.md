# Monitoring Setup

Guide for monitoring the Hairven Salon website in production.

## Table of Contents

- [Health Checks](#health-checks)
- [Error Tracking](#error-tracking)
- [Performance Monitoring](#performance-monitoring)
- [Uptime Monitoring](#uptime-monitoring)
- [Log Aggregation](#log-aggregation)
- [Alerting](#alerting)

## Health Checks

### Built-in Health Endpoint

The application provides a health check endpoint:

```bash
# Basic health check
curl http://localhost:3000/healthz
# Response: OK

# Detailed health check
curl http://localhost:3000/healthz?detailed=true
```

### Detailed Health Response

```json
{
  "status": "healthy",
  "timestamp": "2026-02-10T17:57:17.923Z",
  "version": "1.0.0",
  "uptime": 86400000,
  "checks": {
    "database": true,
    "filesystem": true,
    "memory": {
      "used": 128,
      "total": 1024,
      "percentage": 12.5
    }
  }
}
```

### Status Codes

| Status | HTTP Code | Description |
|--------|-----------|-------------|
| healthy | 200 | All systems operational |
| degraded | 200 | Functional with warnings |
| unhealthy | 503 | Critical issues |

### Health Check Script

Use the included health check script:

```bash
# Basic check
./scripts/health-check.sh

# Detailed check
./scripts/health-check.sh --detailed

# Watch mode (continuous monitoring)
./scripts/health-check.sh --watch --interval 60

# With authentication
./scripts/health-check.sh --detailed --token $HEALTH_TOKEN
```

## Error Tracking

### Sentry Integration

Configure Sentry for error tracking:

1. Create account at https://sentry.io/
2. Create a new project
3. Add DSN to `.env`:

```bash
SENTRY_DSN=https://xxxxx@xxxx.ingest.sentry.io/xxxxx
PUBLIC_SENTRY_DSN=https://xxxxx@xxxx.ingest.sentry.io/xxxxx
```

### Manual Error Logging

Errors are logged to console and can be aggregated:

```bash
# View recent errors
docker-compose logs hairven | grep ERROR

# Save to file
docker-compose logs hairven > /var/log/hairven/app.log
```

### Error Categories

| Category | Source | Action |
|----------|--------|--------|
| Validation | User input | Log and return 400 |
| Database | SQLite | Log and alert |
| External | APIs | Retry with backoff |
| System | Memory/Disk | Alert immediately |

## Performance Monitoring

### Web Vitals

Core Web Vitals are tracked (when GA4 is configured):

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Server Metrics

Monitor server performance:

```bash
# Container stats
docker stats hairven-salon

# Memory usage
docker exec hairven-salon ps aux

# Disk usage
df -h
```

### Database Performance

```sql
-- Check database size
SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();

-- Analyze slow queries
EXPLAIN QUERY PLAN SELECT * FROM click_tracking WHERE timestamp > date('now', '-1 day');
```

## Uptime Monitoring

### Recommended Services

#### UptimeRobot (Free)

1. Sign up at https://uptimerobot.com/
2. Add monitor:
   - Type: HTTP(s)
   - URL: https://sishairven.com/healthz
   - Interval: 5 minutes

#### Pingdom (Paid)

- More frequent checks (1 minute)
- Multi-location monitoring
- Transaction monitoring

#### StatusCake (Freemium)

- Good free tier
- Page speed monitoring
- SSL monitoring

### Self-Hosted Option

Use the health check script with cron:

```bash
# Add to crontab
crontab -e

# Check every 5 minutes
*/5 * * * * /opt/hairven/scripts/health-check.sh || curl -X POST $ALERT_WEBHOOK
```

## Log Aggregation

### Docker Logs

```bash
# View logs
docker-compose logs -f hairven

# Follow with grep
docker-compose logs -f hairven | grep ERROR

# Export logs
docker-compose logs --no-color hairven > hairven-$(date +%Y%m%d).log
```

### Log Rotation

Configure log rotation in `docker-compose.yml`:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "100m"
    max-file: "5"
```

### Centralized Logging

For production, consider:

- **CloudWatch Logs** (AWS)
- **Stackdriver** (GCP)
- **Papertrail** (SaaS)
- **ELK Stack** (Self-hosted)

## Alerting

### Email Alerts

Configure in your uptime monitoring service.

### Slack Notifications

```bash
# Example webhook integration
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Hairven health check failed!"}' \
  $SLACK_WEBHOOK_URL
```

### PagerDuty

For critical alerts:

1. Create service in PagerDuty
2. Get integration key
3. Configure in monitoring tool

### Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Response Time | > 1s | > 3s |
| Error Rate | > 1% | > 5% |
| Memory Usage | > 70% | > 90% |
| Disk Usage | > 80% | > 95% |
| Uptime | < 99.9% | < 99% |

## Dashboard

### Recommended Tools

1. **Grafana** - Visualization
   - Connect to Prometheus/InfluxDB
   - Custom dashboards

2. **Datadog** - Full observability (paid)
   - APM, logs, metrics
   - Automatic correlation

3. **New Relic** - Application monitoring (paid)
   - Detailed transaction traces
   - Error analysis

### Custom Dashboard

Create a simple status page:

```html
<!-- status.html -->
<script>
fetch('/healthz?detailed=true')
  .then(r => r.json())
  .then(data => {
    document.body.innerHTML = `
      <h1>Status: ${data.status}</h1>
      <p>Uptime: ${data.uptime}ms</p>
      <p>Memory: ${data.checks.memory.percentage}%</p>
    `;
  });
</script>
```

## Monitoring Checklist

### Setup

- [ ] Health endpoint responding
- [ ] Sentry configured
- [ ] Uptime monitoring active
- [ ] Log rotation configured
- [ ] Alerting channels tested

### Regular Tasks

- [ ] Review error logs weekly
- [ ] Check performance metrics monthly
- [ ] Update alert thresholds quarterly
- [ ] Test incident response annually

### Emergency Contacts

| Service | Contact | Notes |
|---------|---------|-------|
| Server | DigitalOcean | Infrastructure |
| DNS | Cloudflare | SSL/DNS |
| Monitoring | Sentry | Errors |
| Domain | Registrar | DNS issues |

## Cost Optimization

### Free Tier Limits

| Service | Free Tier | Upgrade When |
|---------|-----------|--------------|
| UptimeRobot | 50 monitors | > 50 endpoints |
| Sentry | 5k errors/mo | > 5k errors |
| LogRocket | 1k sessions | Need more sessions |

### Self-Hosted Alternatives

- **Uptime Kuma** - Self-hosted uptime monitoring
- **Sentry On-Premise** - Self-hosted error tracking
- **Prometheus + Grafana** - Metrics and visualization
