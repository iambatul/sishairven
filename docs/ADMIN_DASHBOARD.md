# Hairven Admin Dashboard

A comprehensive admin dashboard for the Hairven salon website with geo-analytics, revenue tracking, Clika evasion analytics, and translation management.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Dashboard Sections](#dashboard-sections)
- [API Endpoints](#api-endpoints)
- [Data Storage](#data-storage)
- [Security](#security)
- [Customization](#customization)

## Overview

The Hairven Admin Dashboard provides real-time insights into:

- **Geographic Analytics**: Visitor distribution by country and language
- **Revenue Tracking**: Amazon affiliate earnings across 12 regions
- **Clika Evasion Analytics**: Proxy usage, click distribution, and health metrics
- **Translation Management**: Blog post translation status and job control

## Features

### 1. Dashboard Overview
- Real-time KPI cards (Visitors, Clicks, Revenue, Active Proxies)
- Live activity feed with WebSocket updates
- Quick navigation to all sections
- Time range filtering (24h, 7d, 30d, 90d)

### 2. Geo Analytics
- Visitors by country (bar chart)
- Language distribution (doughnut chart)
- Traffic trends over time (line chart)
- Detailed country breakdown table
- Export to CSV

### 3. Revenue Dashboard
- Revenue by Amazon region (pie chart)
- Revenue and clicks trend (dual-axis line chart)
- Top performing products by geography
- Conversion rates and CTR by country
- Currency conversion display
- Export to CSV

### 4. Clika Evasion Analytics
- Proxy usage by country
- Click distribution (target vs actual)
- Business hours alignment
- ISP diversity metrics
- Health scores with visual indicators
- Export to CSV

### 5. Translation Management
- Translation status for all blog posts
- Language-by-language progress tracking
- Active job queue with progress bars
- Trigger new translations
- Cancel pending jobs

## Getting Started

### Access the Dashboard

1. Navigate to `/admin` on your Hairven site
2. Enter the default credentials:
   - **Username**: `admin` (or any value)
   - **Password**: `hairven2026`
3. Click "Sign In"

### Navigation

The dashboard features a collapsible sidebar with navigation to all sections:

- **Dashboard**: Overview with KPIs and live activity
- **Geo Analytics**: Geographic visitor data
- **Revenue**: Amazon affiliate earnings
- **Clika Evasion**: Proxy and evasion metrics
- **Translations**: Blog post translation management

## Dashboard Sections

### Dashboard Overview

The main dashboard displays:

| KPI | Description | Update Frequency |
|-----|-------------|------------------|
| Today's Visitors | Unique visitors today | Real-time |
| Affiliate Clicks | Total affiliate link clicks | Real-time |
| Est. Revenue | Estimated earnings (6% commission) | Real-time |
| Active Proxies | Currently active Clika proxies | Real-time |

### Geo Analytics

**Charts:**
- Visitors by Country: Top 8 countries by visitor count
- Language Distribution: Proportion of visitors by language
- Traffic Trend: Daily visitors and page views

**Metrics:**
- Total Visitors
- Total Page Views
- Average Session Duration
- Bounce Rate

### Revenue Dashboard

**Charts:**
- Revenue by Region: Pie chart of earnings by Amazon marketplace
- Revenue & Clicks Trend: Dual-axis line chart

**Tables:**
- Revenue by Amazon Region: Detailed breakdown by country
- Top Performing Products: Best-selling items by geography

**Commission Calculation:**
- Average commission rate: 6%
- Automatically calculated from click data

### Clika Evasion Analytics

**Charts:**
- Proxy Usage: Proxies and clicks by country
- Click Distribution: Target vs actual click volumes
- ISP Diversity: Distribution across ISPs
- Business Hours: Work hours vs after-hours clicks

**Health Scoring:**
- 90-100%: Green (Excellent)
- 70-89%: Yellow (Good)
- <70%: Red (Needs Attention)

### Translation Management

**Features:**
- View all blog posts and their translation status
- See translation progress per language
- Trigger new translations
- Monitor active translation jobs
- Cancel queued jobs

**Status Types:**
- **Completed**: Translation finished
- **In Progress**: Currently translating
- **Pending**: Not yet started
- **Failed**: Translation error occurred

## API Endpoints

All admin API endpoints are prefixed with `/api/admin`:

### GET /api/admin/stats

Returns dashboard statistics or geo analytics.

**Parameters:**
- `type`: `'dashboard'` | `'geo'`
- `range`: `'24h'` | `'7d'` | `'30d'` | `'90d'`

**Response:**
```json
{
  "success": true,
  "data": { /* stats object */ },
  "timestamp": 1234567890
}
```

### GET /api/admin/revenue

Returns revenue analytics data.

**Parameters:**
- `range`: `'24h'` | `'7d'` | `'30d'` | `'90d'`

### POST /api/admin/revenue

Export revenue data to CSV.

**Body:**
```json
{
  "action": "export",
  "range": "30d"
}
```

### GET /api/admin/clika

Returns Clika evasion analytics.

**Parameters:**
- `range`: `'24h'` | `'7d'` | `'30d'`

### POST /api/admin/clika

Export Clika data to CSV.

### GET /api/admin/translations

Returns translation status for all posts.

### POST /api/admin/translations

Trigger a new translation job.

**Body:**
```json
{
  "slug": "post-slug",
  "language": "es"
}
```

### DELETE /api/admin/translations

Cancel a translation job.

**Parameters:**
- `jobId`: The job ID to cancel

### GET /api/admin/clicks

Returns click tracking data.

**Parameters:**
- `range`: Time range
- `country`: Filter by country (optional)
- `product`: Filter by product (optional)

### POST /api/admin/clicks

Record a new click.

**Body:**
```json
{
  "asin": "B01FIG3JA4",
  "productName": "Dyson Supersonic",
  "category": "Hair Dryers",
  "country": "US",
  "estimatedCommission": 25.00
}
```

### GET /api/admin/live

Server-Sent Events endpoint for real-time updates.

**Events:**
- `pageview`: User viewed a page
- `click`: Affiliate link clicked
- `conversion`: Purchase completed
- `proxy_request`: New proxy request

## Data Storage

### Current Implementation

The dashboard currently uses **in-memory storage** for simplicity. Data is stored in:

- `adminDataStore`: Click and visitor data
- Mock data generators for analytics

### Migration to SQLite

To add persistent storage with SQLite:

1. Install better-sqlite3:
   ```bash
   npm install better-sqlite3
   npm install -D @types/better-sqlite3
   ```

2. Create database schema:
   ```sql
   -- clicks table
   CREATE TABLE clicks (
     id TEXT PRIMARY KEY,
     asin TEXT NOT NULL,
     product_name TEXT NOT NULL,
     category TEXT,
     country TEXT,
     timestamp INTEGER,
     commission REAL,
     proxy_id TEXT,
     is_business_hours BOOLEAN
   );

   -- visitors table
   CREATE TABLE visitors (
     id TEXT PRIMARY KEY,
     country TEXT,
     timestamp INTEGER,
     session_id TEXT
   );

   -- translations table
   CREATE TABLE translations (
     id TEXT PRIMARY KEY,
     post_slug TEXT NOT NULL,
     language TEXT NOT NULL,
     status TEXT,
     progress INTEGER,
     created_at TEXT,
     completed_at TEXT
   );
   ```

3. Update the `AdminDataStore` class to use SQLite instead of arrays.

## Security

### Current Security Measures

1. **Simple Password Authentication**: Default password `hairven2026`
2. **Local Storage Token**: Session stored in browser localStorage
3. **No Server-Side Session**: Stateless authentication

### Production Security Recommendations

1. **Implement JWT Authentication**:
   ```typescript
   // Use a proper JWT library
   import jwt from 'jsonwebtoken';
   
   // Validate tokens on each request
   export const handle: Handle = async ({ event, resolve }) => {
     const token = event.cookies.get('admin_token');
     if (token) {
       try {
         const user = jwt.verify(token, JWT_SECRET);
         event.locals.user = user;
       } catch {
         event.cookies.delete('admin_token');
       }
     }
     return resolve(event);
   };
   ```

2. **Rate Limiting**:
   ```typescript
   // Implement rate limiting on auth endpoints
   import { RateLimiter } from 'sveltekit-rate-limiter';
   ```

3. **HTTPS Only**: Ensure all admin routes use HTTPS

4. **IP Whitelisting**: Restrict admin access to specific IPs

5. **Two-Factor Authentication**: Add TOTP for additional security

## Customization

### Changing the Default Password

Edit `src/lib/admin/stores.ts`:

```typescript
login: (username: string, password: string) => {
  if (password === 'your-new-password') {
    // ...
  }
}
```

### Adding New Widgets

1. Create a new component in `src/lib/admin/components/`
2. Add the route to the sidebar in `src/routes/admin/+layout.svelte`
3. Create the API endpoint in `src/routes/api/admin/`

### Changing Chart Colors

Edit the Chart.js configurations in each page:

```typescript
// Example: Change line color
borderColor: '#your-color',
backgroundColor: 'rgba(r, g, b, 0.1)',
```

### Modifying Time Ranges

Add new options to the time range arrays:

```typescript
const timeRanges: { value: TimeRange; label: string }[] = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'Last Year' }, // New option
];
```

### Styling

The dashboard uses Tailwind CSS with the Hairven color palette:

- **Primary**: `#ff1493` (pink-bright)
- **Background**: `#000000` (black)
- **Surface**: `#1a1a1a` (black-soft)
- **Text**: `#e5e5e5` (gray-light)
- **Muted**: `#6b6b6b` (gray-medium)

Modify `tailwind.config.js` to change the theme.

## Troubleshooting

### Charts Not Loading

1. Check browser console for errors
2. Ensure Chart.js is installed: `npm list chart.js`
3. Verify canvas elements are rendered before chart initialization

### Live Updates Not Working

1. Check if EventSource is supported in your browser
2. Verify the `/api/admin/live` endpoint is accessible
3. Check for ad blockers or browser extensions blocking SSE

### Authentication Issues

1. Clear localStorage and try again
2. Check if `localStorage.setItem` is allowed
3. Verify the password matches in `stores.ts`

## Contributing

When adding new features:

1. Follow the existing code style
2. Add TypeScript types to `src/lib/admin/types.ts`
3. Update this documentation
4. Test all time ranges
5. Verify responsive design

## License

This admin dashboard is part of the Hairven salon website and follows the same license terms.
