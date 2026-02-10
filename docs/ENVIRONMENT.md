# Environment Variables Documentation

Complete reference for all environment variables used by the Hairven Salon website.

## Table of Contents

- [Required Variables](#required-variables)
- [Analytics & Tracking](#analytics--tracking)
- [Amazon Associates](#amazon-associates)
- [Phoenix Clika Integration](#phoenix-clika-integration)
- [MaxMind GeoIP](#maxmind-geoip)
- [Sentry Error Tracking](#sentry-error-tracking)
- [Security](#security)
- [Database](#database)
- [Monitoring](#monitoring)
- [Feature Flags](#feature-flags)

## Required Variables

### `PUBLIC_SITE_URL`
- **Type**: Public
- **Required**: Yes
- **Default**: `https://sishairven.com`
- **Description**: The canonical URL of your website

### `PUBLIC_SITE_NAME`
- **Type**: Public
- **Required**: Yes
- **Default**: `Hairven by Elyn`
- **Description**: The name of your website for SEO and branding

### `NODE_ENV`
- **Type**: Server
- **Required**: Yes
- **Default**: `production`
- **Description**: Node.js environment mode (`development` | `production` | `test`)

---

## Analytics & Tracking

### `PUBLIC_GA4_ID`
- **Type**: Public
- **Required**: No (graceful degradation)
- **Format**: `G-XXXXXXXXXX`
- **Description**: Google Analytics 4 tracking ID
- **Get from**: https://analytics.google.com/

### `PUBLIC_ADSENSE_CLIENT`
- **Type**: Public
- **Required**: No (graceful degradation)
- **Format**: `ca-pub-XXXXXXXXXXXXXXXX`
- **Description**: Google AdSense publisher ID
- **Get from**: https://www.google.com/adsense/

---

## Amazon Associates

All Amazon Associates tags are optional. If not set, the site will display products without affiliate links.

### `PUBLIC_AMAZON_ASSOC_TAG_US`
- **Marketplace**: amazon.com
- **Format**: `yourtag-20`

### `PUBLIC_AMAZON_ASSOC_TAG_UK`
- **Marketplace**: amazon.co.uk
- **Format**: `yourtag-21`

### `PUBLIC_AMAZON_ASSOC_TAG_CA`
- **Marketplace**: amazon.ca
- **Format**: `yourtag-20`

### `PUBLIC_AMAZON_ASSOC_TAG_DE`
- **Marketplace**: amazon.de
- **Format**: `yourtag-21`

### `PUBLIC_AMAZON_ASSOC_TAG_FR`
- **Marketplace**: amazon.fr
- **Format**: `yourtag-21`

### `PUBLIC_AMAZON_ASSOC_TAG_IT`
- **Marketplace**: amazon.it
- **Format**: `yourtag-21`

### `PUBLIC_AMAZON_ASSOC_TAG_ES`
- **Marketplace**: amazon.es
- **Format**: `yourtag-21`

### `PUBLIC_AMAZON_ASSOC_TAG_JP`
- **Marketplace**: amazon.co.jp
- **Format**: `yourtag-22`

### `PUBLIC_AMAZON_ASSOC_TAG_IN`
- **Marketplace**: amazon.in
- **Format**: `yourtag-21`

### `PUBLIC_AMAZON_ASSOC_TAG_BR`
- **Marketplace**: amazon.com.br
- **Format**: `yourtag-20`

### `PUBLIC_AMAZON_ASSOC_TAG_AU`
- **Marketplace**: amazon.com.au
- **Format**: `yourtag-22`

### `PUBLIC_AMAZON_ASSOC_TAG_MX`
- **Marketplace**: amazon.com.mx
- **Format**: `yourtag-20`

### `PUBLIC_AMAZON_ASSOC_TAG`
- **Type**: Public
- **Description**: Default fallback tag if no regional match found

**Note**: You need separate Amazon Associates accounts for each marketplace. Apply at https://affiliate-program.amazon.com/

---

## Phoenix Clika Integration

### `CLIKA_API_URL`
- **Type**: Server-only (never expose to client)
- **Required**: No
- **Default**: `http://localhost:8080`
- **Description**: Phoenix Clika API endpoint for traffic amplification

### `CLIKA_API_KEY`
- **Type**: Server-only (never expose to client)
- **Required**: No
- **Description**: API key for Phoenix Clika authentication

**Warning**: These variables contain sensitive credentials. Never expose them to the client side.

---

## MaxMind GeoIP

### `MAXMIND_LICENSE_KEY`
- **Type**: Server
- **Required**: No (Cloudflare headers used as fallback)
- **Get from**: https://www.maxmind.com/en/geolite2/signup
- **Description**: MaxMind GeoIP2 license key for enhanced geo detection

### `MAXMIND_ACCOUNT_ID`
- **Type**: Server
- **Required**: No
- **Description**: MaxMind account ID

---

## Sentry Error Tracking

### `SENTRY_DSN`
- **Type**: Server-only
- **Required**: No
- **Format**: `https://xxxxx@xxxx.ingest.sentry.io/xxxxx`
- **Description**: Sentry DSN for server-side error tracking

### `PUBLIC_SENTRY_DSN`
- **Type**: Public
- **Required**: No
- **Format**: `https://xxxxx@xxxx.ingest.sentry.io/xxxxx`
- **Description**: Sentry DSN for client-side error tracking (limited permissions)

### `SENTRY_ENVIRONMENT`
- **Type**: Server
- **Required**: No
- **Default**: `production`
- **Description**: Environment tag for Sentry errors

---

## Security

### `CSP_NONCE_SECRET`
- **Type**: Server
- **Required**: Recommended for production
- **Generate**: `openssl rand -hex 32`
- **Description**: Secret for generating CSP nonces

### `RATE_LIMIT_REQUESTS_PER_MINUTE`
- **Type**: Server
- **Default**: `60`
- **Description**: Maximum requests per minute per IP

### `RATE_LIMIT_BURST`
- **Type**: Server
- **Default**: `10`
- **Description**: Burst allowance for rate limiting

### `TRUSTED_PROXIES`
- **Type**: Server
- **Default**: `127.0.0.1,::1`
- **Description**: Comma-separated list of trusted proxy IPs

---

## Database

### `DB_PATH`
- **Type**: Server
- **Default**: `/data/appointments.db`
- **Description**: Path to SQLite database file

### `DATABASE_URL`
- **Type**: Server
- **Default**: `file:/data/appointments.db`
- **Description**: Database connection URL

---

## Monitoring

### `HEALTH_CHECK_TOKEN`
- **Type**: Server
- **Required**: No
- **Description**: Optional token for authenticated health endpoints

### `ENABLE_DETAILED_HEALTH`
- **Type**: Server
- **Default**: `false`
- **Description**: Enable detailed health check reporting

---

## Feature Flags

### `ENABLE_CLICK_TRACKING`
- **Type**: Server
- **Default**: `true`
- **Description**: Enable affiliate click tracking

### `ENABLE_IMPRESSION_TRACKING`
- **Type**: Server
- **Default**: `true`
- **Description**: Enable product impression tracking

### `ENABLE_ADMIN_DASHBOARD`
- **Type**: Server
- **Default**: `false`
- **Description**: Enable admin dashboard (requires authentication setup)

---

## Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your values in `.env`

3. For production deployment:
   ```bash
   cp .env.production .env
   # Edit .env with your production values
   ```

4. **Never commit `.env` to version control!** It's already in `.gitignore`.

---

## Graceful Degradation

The site is designed to work without optional variables:

- **No GA4 ID**: Analytics simply won't load
- **No AdSense**: No ads will be displayed
- **No Amazon tags**: Products shown without affiliate links
- **No Clika**: Click tracking disabled
- **No Sentry**: Errors logged to console only
- **No MaxMind**: Uses Cloudflare geo headers

This ensures the site remains functional even if third-party services are unavailable or not configured.
