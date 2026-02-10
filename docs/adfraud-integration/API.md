# Sishairven AdFraud Integration - API Specification

## Overview

This document describes the API endpoints for integrating sishairven.com with the Phoenix Clika adfraud system.

---

## Clika Service Endpoints

### 1. Get Site Configuration

Returns configuration for the Phoenix worker running on sishairven.com.

**Endpoint:** `GET /api/clika/adfraud/domains/sishairven/config`

**Response:**
```json
{
  "success": true,
  "config": {
    "site_id": "sishairven_com",
    "niche": "beauty_hair",
    "amazon_tag": "sishairven-20",
    "ad_slots": [
      { "position": "header", "enabled": true, "size": "728x90" },
      { "position": "sidebar", "enabled": true, "size": "300x250" },
      { "position": "in_content", "enabled": false, "size": "336x280" }
    ],
    "products": [
      {
        "asin": "B01LSUQSB0",
        "name": "Dyson Supersonic",
        "category": "hair_dryer",
        "priority": 1,
        "commission": 6
      }
    ],
    "behavior": {
      "min_session_duration": 60,
      "max_session_duration": 300,
      "click_probability": 0.35,
      "conversion_probability": 0.08
    },
    "thresholds": {
      "proxy_trigger": 65,
      "burn_trigger": 85
    }
  }
}
```

---

### 2. Report Affiliate Click

Reports when a user clicks an Amazon affiliate link.

**Endpoint:** `POST /api/clika/adfraud/domains/sishairven/click`

**Request:**
```json
{
  "asin": "B01LSUQSB0",
  "product_name": "Dyson Supersonic Hair Dryer",
  "category": "hair_dryer",
  "context": "shop_page",
  "page_url": "https://sishairven.com/shop",
  "session_id": "sess_abc123",
  "click_timestamp": 1739200000000,
  "potential_revenue": 24.00
}
```

**Response:**
```json
{
  "success": true,
  "message": "Click recorded",
  "click_id": "click_xyz789"
}
```

---

### 3. Report Ad Impression

Reports when an ad is viewed (50%+ visible for 1+ seconds).

**Endpoint:** `POST /api/clika/adfraud/domains/sishairven/impression`

**Request:**
```json
{
  "position": "sidebar",
  "ad_network": "google_adsense",
  "session_id": "sess_abc123",
  "timestamp": 1739200000000,
  "viewability": 0.75
}
```

**Response:**
```json
{
  "success": true,
  "message": "Impression recorded"
}
```

---

### 4. Report Ad Click

Reports when a user clicks a display ad.

**Endpoint:** `POST /api/clika/adfraud/domains/sishairven/ad-click`

**Request:**
```json
{
  "position": "sidebar",
  "ad_network": "google_adsense",
  "session_id": "sess_abc123",
  "timestamp": 1739200000000,
  "destination_url": "https://advertiser.com/product"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ad click recorded"
}
```

---

### 5. Session Events

Reports session start/end events.

**Endpoint:** `POST /api/clika/adfraud/domains/sishairven/session`

**Request (Start):**
```json
{
  "event": "start",
  "session_id": "sess_abc123",
  "hook_id": "hook_def456",
  "entry_url": "https://sishairven.com/shop",
  "timestamp": 1739200000000,
  "geo": "US",
  "device": "desktop"
}
```

**Request (End):**
```json
{
  "event": "end",
  "session_id": "sess_abc123",
  "duration": 145,
  "pages_viewed": 3,
  "clicks": 1,
  "revenue": 6.00,
  "timestamp": 1739200145000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session event recorded"
}
```

---

## Sishairven Site Endpoints

These endpoints proxy to the Clika service and add session management.

### 1. Get Config (Proxy)

**Endpoint:** `GET /api/clika/config`

**Description:** Returns configuration for the Phoenix worker. Proxies to Clika service with session initialization.

**Response:** Same as Clika config endpoint.

---

### 2. Track Click (Proxy)

**Endpoint:** `POST /api/clika/track-click`

**Description:** Receives click from frontend, adds session info, proxies to Clika.

**Request:**
```json
{
  "asin": "B01LSUQSB0",
  "context": "shop_page"
}
```

**Response:**
```json
{
  "success": true,
  "tracked": true
}
```

---

### 3. Track Impression (Proxy)

**Endpoint:** `POST /api/clika/track-impression`

**Request:**
```json
{
  "position": "sidebar",
  "viewability": 0.65
}
```

**Response:**
```json
{
  "success": true,
  "tracked": true
}
```

---

## Error Responses

All endpoints return consistent error formats:

```json
{
  "success": false,
  "error": "Invalid session ID",
  "code": "INVALID_SESSION"
}
```

**Error Codes:**

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_SESSION` | Session ID not found or expired | 401 |
| `RATE_LIMITED` | Too many requests from this IP | 429 |
| `INVALID_REQUEST` | Malformed request body | 400 |
| `CAMPAIGN_PAUSED` | Campaign is not active | 403 |
| `INTERNAL_ERROR` | Server error | 500 |

---

## Authentication

All endpoints require authentication via:

1. **Session Token:** `X-Session-ID` header (for client requests)
2. **API Key:** `X-API-Key` header (for server-to-server)
3. **Origin Check:** Requests must come from sishairven.com domain

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| GET /config | 10 | per minute |
| POST /track-click | 60 | per minute |
| POST /track-impression | 120 | per minute |
| POST /session | 30 | per minute |

---

## WebSocket Events

Real-time events are sent via WebSocket to the Clika C2 channel:

```javascript
// Event: Session started
{
  type: "sishairven_session_start",
  session_id: "sess_abc123",
  timestamp: 1739200000000,
  data: { entry_url: "https://sishairven.com/shop" }
}

// Event: Affiliate clicked
{
  type: "sishairven_affiliate_click",
  session_id: "sess_abc123",
  timestamp: 1739200050000,
  data: { asin: "B01LSUQSB0", revenue: 24.00 }
}

// Event: Ad impression
{
  type: "sishairven_ad_impression",
  session_id: "sess_abc123",
  timestamp: 1739200100000,
  data: { position: "sidebar", network: "adsense" }
}
```
