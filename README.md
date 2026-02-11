# Hairven by Elyn - Salon Website

A production-ready, feature-rich website for Hairven by Elyn hair salon and beauty services. Features dynamic backgrounds, dark theme design, online booking with admin dashboard, multi-language support, and affiliate marketing integration.

## 🚀 Features

### Core Website
- 🎨 **Immersive Dynamic Background** - Cycles through 5 beautiful background images
- 🌙 **Dark Theme Design** - Elegant dark theme with pink and gold accents
- 📱 **Fully Responsive** - Mobile-first design with optimized mobile navigation
- ✨ **Collapsible Pricing** - Click service images to expand/collapse pricing tables
- 📞 **Quick Call Button** - Instant contact button

### Booking & Business
- 📝 **Online Booking** - Appointment booking form with validation
- 🗄️ **Admin Dashboard** - Manage appointments, view analytics
- 🔐 **Secure Authentication** - Token-based admin access
- 📊 **Analytics** - Click tracking, appointment stats

### International
- 🌍 **Multi-Language** - English, Spanish, French, German
- 💱 **Multi-Currency** - USD, EUR, GBP support
- 🌐 **Geo-Localization** - Auto-detect user location and language
- 🛒 **Regional Amazon** - Auto-redirect to local Amazon stores

### Technical
- ⚡ **High Performance** - SQLite with WAL mode, optimized queries
- 🐳 **Docker Ready** - Production-grade containerization
- 🔒 **Security** - Rate limiting, input validation, security headers
- 📈 **SEO Ready** - Meta tags, sitemap, structured data

## Tech Stack

- **Frontend**: SvelteKit 5, TailwindCSS, TypeScript
- **Database**: SQLite (better-sqlite3) with WAL mode
- **Authentication**: Token-based with session management
- **Container**: Docker (Alpine-based with SQLite support)
- **Reverse Proxy**: Caddy with Cloudflare integration
- **i18n**: svelte-i18n with lazy loading

## Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- Cloudflare account with API token (for SSL certificates)

## Quick Start

### 1. Clone the Repository

```bash
git clone git@github.com:shamarrz/hairven.git
cd hairven
```

### 2. Copy Images

Ensure background images are in place:
```bash
# Background images should be in static/bg/
ls static/bg/
# Should show: bg1.webp, bg2.webp, bg3.webp, bg4.webp, bg5.webp
```

### 3. Configure Environment

```bash
# Copy production environment template
cp .env.production .env

# Generate admin credentials
npm run setup:admin
# Follow prompts to create admin email and password
```

### 4. Pre-Deployment Check

```bash
./scripts/prepare-deployment.sh
```

### 5. Deploy

```bash
docker compose up --build -d
```

The website will be available at:
- Website: `https://sishairven.com`
- Admin: `https://sishairven.com/admin`

## Manual Setup

### Install Dependencies

```bash
npm install
```

### Build for Production

```bash
npm run build
```

### Run with Docker

```bash
docker compose up --build -d
```

### View Logs

```bash
docker compose logs -f
```

### Stop Services

```bash
docker compose down
```

## Caddy Integration

This website is designed to work behind Caddy reverse proxy with Cloudflare.

### Caddy Configuration

Add to your Caddyfile:

```
sishairven.com, *.sishairven.com {
  tls {
    dns cloudflare {env.CLOUDFLARE_API_TOKEN}
  }
  
  @sishairven host sishairven.com
  reverse_proxy @sishairven http://172.22.0.4:8080 {
    header_up Host {host}
    header_up X-Real-IP {remote}
    header_up X-Forwarded-For {remote}
    header_up X-Forwarded-Proto {scheme}
  }
}
```

**Note**: Update `172.22.0.4` with your server's internal IP address.

## Project Structure

```
sishairven/
├── src/
│   ├── routes/
│   │   ├── +page.svelte           # Main landing page
│   │   ├── admin/                 # Admin dashboard
│   │   │   ├── +page.svelte       # Admin overview
│   │   │   ├── analytics/         # Analytics dashboard
│   │   │   └── appointments/      # Appointment management
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── login/         # Admin login API
│   │   │   │   ├── stats/         # Statistics API
│   │   │   │   ├── appointments/  # Appointment CRUD API
│   │   │   │   └── clicks/        # Click tracking API
│   │   │   ├── book/              # Booking API
│   │   │   └── subscribe/         # Newsletter API
│   │   ├── shop/                  # Shop page
│   │   └── blog/                  # Blog pages
│   ├── lib/
│   │   ├── auth/                  # Authentication system
│   │   ├── db/                    # SQLite database layer
│   │   ├── i18n/                  # Internationalization
│   │   │   └── locales/           # Translation files
│   │   │       ├── en/            # English
│   │   │       ├── es/            # Spanish
│   │   │       ├── fr/            # French
│   │   │       └── de/            # German
│   │   ├── security/              # Security utilities
│   │   └── types/                 # TypeScript types
│   ├── app.css                    # Global styles
│   └── app.html                   # HTML template
├── static/
│   ├── bg/                        # Background images
│   └── phoenix-worker.js          # Analytics worker
│   ├── hair.WEBP
│   ├── nails.WEBP
│   ├── skincare.WEBP
│   └── events.WEBP
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `PUBLIC_SITE_URL` | Your website URL | `https://sishairven.com` |
| `ADMIN_EMAIL` | Admin login email | `admin@sishairven.com` |
| `ADMIN_PASSWORD_HASH` | Hashed admin password | (generate with `npm run setup:admin`) |
| `ADMIN_API_TOKEN` | API access token | (generate with `npm run setup:admin`) |

### Database

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_PATH` | SQLite database path | `/data/appointments.db` |
| `DATABASE_URL` | Database connection URL | `file:/data/appointments.db` |

### Optional Integrations

| Variable | Description | Required For |
|----------|-------------|--------------|
| `PUBLIC_GA4_ID` | Google Analytics 4 ID | Analytics |
| `PUBLIC_ADSENSE_CLIENT` | Google AdSense Publisher ID | Ads |
| `PUBLIC_AMAZON_ASSOC_TAG_US` | Amazon Associates US tag | Affiliate links |
| `PUBLIC_AMAZON_ASSOC_TAG_UK` | Amazon Associates UK tag | UK affiliate links |
| `PUBLIC_AMAZON_ASSOC_TAG_DE` | Amazon Associates DE tag | German affiliate links |
| `SENTRY_DSN` | Sentry error tracking | Error monitoring |
| `CLIKA_API_KEY` | Phoenix Clika API key | Ad fraud protection |

### Security

| Variable | Description | Default |
|----------|-------------|---------|
| `RATE_LIMIT_REQUESTS_PER_MINUTE` | Rate limit per IP | `60` |
| `CSP_NONCE_SECRET` | CSP nonce secret | (generate with openssl) |

## Data Persistence

All data is stored in SQLite database (`/data/appointments.db`) with the following tables:
- `appointments` - Booking requests
- `click_tracking` - Affiliate link clicks
- `newsletter_subscriptions` - Email subscribers
- `audit_log` - Admin actions

The data directory is mounted as a Docker volume for persistence across container restarts.

## Admin Dashboard

Access the admin dashboard at `https://sishairven.com/admin`

### First Time Setup

1. Generate admin credentials:
   ```bash
   npm run setup:admin
   ```

2. Add generated values to `.env`:
   ```env
   ADMIN_EMAIL=your-email@domain.com
   ADMIN_PASSWORD_HASH=<generated-hash>
   ADMIN_API_TOKEN=<generated-token>
   ```

3. Restart the application:
   ```bash
   docker compose restart
   ```

### Features

- **Dashboard Overview** - View today's stats, recent appointments, click analytics
- **Appointments** - View, confirm, cancel, or delete bookings
- **Analytics** - Track affiliate clicks by country and product
- **Real-time Data** - All data pulled from SQLite database

### API Authentication

For programmatic access, use the Admin API Token:

```bash
curl -H "Authorization: Bearer YOUR_ADMIN_API_TOKEN" \
  https://sishairven.com/api/admin/stats
```

## Development

### Local Development

```bash
npm run dev
```

Access at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Customization

### Colors

Edit `tailwind.config.js` to customize the color palette:
- Pink shades for feminine aesthetic
- Gold accents for elegance
- Black/gray for dark theme

### Background Images

Replace images in `static/bg/`:
- bg1.webp through bg5.webp
- Images cycle every 5 seconds
- Recommended: 1920x1080 or higher resolution

### Services & Pricing

Edit `src/routes/+page.svelte` to update:
- Service categories
- Pricing tables
- Service descriptions

## Mobile View

Mobile navigation shows only:
- Salon title (left)
- Book button (right)

All other navigation is hidden on mobile for a clean, minimal interface.

## Security Features

- Security headers (HSTS, X-Frame-Options, etc.)
- Input validation on booking form
- Secure data storage
- HTTPS via Caddy/Cloudflare

## Troubleshooting

### Port Already in Use

```bash
# Check what's using port 8080
sudo lsof -i :8080

# Or change port in docker-compose.yml
ports:
  - "8081:3000"  # Change 8080 to 8081
```

### Docker Build Fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker compose build --no-cache
```

### Images Not Loading

Ensure all images are in `static/` directory:
- Background images: `static/bg/bg1.webp` through `bg5.webp`
- Service images: `static/hair.WEBP`, `static/nails.WEBP`, etc.

## License

Private repository - All rights reserved.

## Contact

Hairven by Elyn
64 OWEGO ST, CORTLAND NY 13045
Phone: 607.252.6610
