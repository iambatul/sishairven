# Sishairven.com - Phoenix Clika AdFraud Integration

## Overview

This document describes the integration of sishairven.com into the Phoenix Clika adfraud system as a "parked active" target domain for automated traffic amplification and revenue generation.

**Status:** IN DEVELOPMENT  
**Target Revenue:** $1,450/month (Target Scenario)  
**Risk Level:** Target (100 sessions/day)  
**Primary Monetization:** Amazon Affiliate (6% commission)  
**Secondary Monetization:** Display Ads (AdSense/Ezoic)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PHOENIX CLIKA SYSTEM                                │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ADFRAUD ENGINE (clika-service)                                      │    │
│  │  ├── Campaign: "sishairven_beauty_hair"                             │    │
│  │  ├── Niche Profile: beauty_hair (NEW)                               │    │
│  │  ├── Target Domain: sishairven.com                                  │    │
│  │  └── Revenue Model: affiliate + display_ads                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│  ┌─────────────────────────────────▼─────────────────────────────────────┐   │
│  │  COMMAND DISPATCH                                                      │   │
│  │  Hooked browsers receive commands via C2:                             │   │
│  │  - "visit_sishairven" → Browse site, view products                    │   │
│  │  - "click_affiliate" → Click Amazon link with human delay             │   │
│  │  - "view_ads" → Trigger display ad impressions                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
└────────────────────────────────────┼─────────────────────────────────────────┘
                                     │ WebSocket / C2 Channel
                                     │
┌────────────────────────────────────▼─────────────────────────────────────────┐
│                         SISHAIRVEN.COM (Target Site)                        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  CLIENT-SIDE INTEGRATION                                             │    │
│  │  - phoenix-worker.js (injected via C2)                              │    │
│  │  - Tracks affiliate link clicks                                     │    │
│  │  - Reports to Clika API (/api/clika/*)                              │    │
│  │  - Manages session persistence                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│  ┌─────────────────────────────────▼─────────────────────────────────────┐   │
│  │  REVENUE GENERATION                                                    │   │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐            │   │
│  │  │ Amazon       │    │ AdSense/     │    │ Ezoic        │            │   │
│  │  │ Affiliate    │◄──►│ Display Ads  │◄──►│ (Backup)     │            │   │
│  │  │ 4-10% comm   │    │ $2-5 RPM     │    │ $3-10 RPM    │            │   │
│  │  └──────────────┘    └──────────────┘    └──────────────┘            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Niche Profile: beauty_hair

### Configuration

```go
Profile: "beauty_hair"
Name: "Beauty & Hair Care"
Description: "Professional hair products, styling tools, salon equipment"

// Revenue Settings
Commission Range: 3-10%
Average Order Value: $50-150
Target Conversion Rate: 8%
Monthly Revenue Target: $1,450

// Risk Profile
Risk Level: Medium
Proxy Trigger: 65 (early switching)
Burn Trigger: 85
Max Sessions Per Day: 100 (Target scenario)
Max Sessions Per Hour: 4
Cooldown: 20 minutes

// Target URLs
Entry Points:
- https://sishairven.com/shop
- https://sishairven.com/blog/best-hair-dryers-2025
- https://sishairven.com/blog/dyson-vs-ghd-vs-revlon
- https://sishairven.com/blog/keratin-treatment-guide

// Networks (Priority)
1. amazon_affiliate (Primary)
2. google_adsense (Secondary)
3. ezoic (Backup)
```

### Behavior Profile

| Parameter | Value | Reason |
|-----------|-------|--------|
| Session Duration | 60-300 seconds | Realistic browsing time |
| Pages Per Session | 2-4 | Browse multiple products |
| Scroll Depth | 50-90% | Read content, not just bounce |
| Click Probability | 35% | 35% click affiliate links |
| Conversion Rate | 8% | 8% of clicks result in purchase |
| Mouse Entropy | 0.7+ | Human-like movement patterns |
| Min Interval | 8 seconds | Between actions |
| Max Interval | 45 seconds | Natural browsing pace |

---

## Revenue Projections (Target Scenario)

### Amazon Affiliate (Primary)

| Metric | Daily | Monthly |
|--------|-------|---------|
| Sessions | 100 | 3,000 |
| Affiliate Clicks (35%) | 35 | 1,050 |
| Purchases (8% conv) | 2.8 | 84 |
| Avg Order Value | $100 | $100 |
| Commission (6%) | $6 | $6 |
| **Commission Revenue** | **$16.80** | **$504** |

### Display Ads (Secondary)

| Metric | Daily | Monthly |
|--------|-------|---------|
| Impressions | 5,000 | 150,000 |
| RPM | $3 | $3 |
| **Ad Revenue** | **$15** | **$450** |

### Combined

| Source | Monthly |
|--------|---------|
| Amazon Affiliate | $504 |
| Display Ads | $450 |
| **Total Target** | **$954** |

*Note: Conservative estimate. Optimized scenario targets $1,450-3,200/month.*

---

## File Structure

### Clika-Service Modifications

```
clika-service/
├── internal/
│   └── adfraud/
│       ├── niche_profiles.go          # ADD: beauty_hair profile
│       ├── target_domains.go          # NEW: Target domain registry
│       └── sishairven_integration.go  # NEW: Site-specific logic
├── internal/
│   └── api/
│       └── adfraud_handler.go         # ADD: Sishairven endpoints
```

### Sishairven Site Modifications

```
sishairven/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   └── AdSlot.svelte          # NEW: Ad container component
│   │   └── utils/
│   │       └── amazon.ts              # ENHANCE: Add tracking
│   └── routes/
│       └── api/
│           └── clika/
│               ├── config/
│               │   └── +server.ts     # NEW: Config endpoint
│               └── track/
│                   └── +server.ts     # NEW: Click tracking endpoint
├── static/
│   └── phoenix-worker.js              # NEW: Client-side worker
└── docs/
    └── adfraud-integration/           # THIS DOCUMENTATION
```

---

## API Endpoints

### Clika Service (Backend)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/clika/adfraud/domains/sishairven/config` | GET | Returns site config for worker |
| `/api/clika/adfraud/domains/sishairven/click` | POST | Reports affiliate click |
| `/api/clika/adfraud/domains/sishairven/impression` | POST | Reports ad impression |
| `/api/clika/adfraud/domains/sishairven/session` | POST | Session start/end events |

### Sishairven Site (Frontend)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/clika/config` | GET | Proxies to Clika service |
| `/api/clika/track-click` | POST | Proxies click to Clika |
| `/api/clika/track-impression` | POST | Proxies impression to Clika |

---

## Safety Limits

### Session Management

```
Global Max Sessions/Day: 100
Max Per Domain/Day: 100 (sishairven.com only for now)
Max Per Hour: 4
Cooldown Period: 20 minutes
Concurrent Sessions: 3 max
```

### Geographic Distribution

```
US Traffic: 70% (primary market)
CA Traffic: 20% (English-speaking)
UK Traffic: 10% (testing)
```

### Time Windows

```
Active Hours: 9:00 AM - 10:00 PM EST
Peak Hours: 12:00 PM - 8:00 PM EST (higher volume)
Off Hours: 10:00 PM - 9:00 AM EST (no traffic)
```

### Burn Triggers

| Condition | Action |
|-----------|--------|
| Risk Score > 85 | Burn session immediately |
| > 5 captchas/hour | Switch to proxy mode |
| > 10 sessions burned/hour | Pause campaign 2 hours |
| Commission drop > 50% | Alert + manual review |
| Amazon account health < 80% | Rotate to backup account |

---

## Amazon Account Strategy

### Account Rotation

| Account | Purpose | Monthly Cap | Status |
|---------|---------|-------------|--------|
| Primary | High-ticket items | $500 | Active |
| Secondary | Mid-range items | $400 | Standby |
| Tertiary | Volume/Budget | $300 | Standby |

### Safety Rules

1. **Never exceed $1,000/month per account**
2. **7-day cooldown between account switches**
3. **Maintain 5-12% conversion rate** (never 100%)
4. **Use residential proxies only** (no datacenter)
5. **Realistic purchase timing** (1-3 per session max)
6. **Different payment methods per account**

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [x] Create documentation (this file)
- [ ] Add beauty_hair niche profile to clika-service
- [ ] Add sishairven_com target domain config
- [ ] Create API endpoints for tracking

### Phase 2: Client Integration (Week 2)
- [ ] Add AdSlot.svelte component
- [ ] Enhance amazon.ts with tracking
- [ ] Create phoenix-worker.js
- [ ] Add /api/clika/* endpoints

### Phase 3: Testing (Week 3)
- [ ] Test session flow end-to-end
- [ ] Verify click tracking
- [ ] Test proxy switching
- [ ] Validate revenue reporting

### Phase 4: Launch (Week 4)
- [ ] Deploy to production
- [ ] Start with 10 sessions/day
- [ ] Scale to 50 sessions/day
- [ ] Target 100 sessions/day

---

## Monitoring

### Key Metrics

| Metric | Target | Alert If |
|--------|--------|----------|
| Daily Sessions | 100 | < 50 or > 150 |
| Click-through Rate | 35% | < 20% or > 50% |
| Conversion Rate | 8% | < 5% or > 12% |
| Commission/Session | $0.17 | < $0.10 |
| Ad RPM | $3 | < $2 |
| Risk Score Avg | < 60 | > 75 |
| Burn Rate | < 5%/day | > 10%/day |

### Dashboard Views

1. **Real-time:** Active sessions, current revenue, risk scores
2. **Daily:** Clicks, conversions, commission by product
3. **Weekly:** Network performance, A/B test results
4. **Monthly:** Total revenue, ROI, optimization suggestions

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Amazon account ban | Medium | High | Rotate 3+ accounts, realistic behavior |
| AdSense ban | Low | Medium | Use Ezoic backup, conservative CTR |
| Detection by Amazon | Medium | High | Residential proxies, human behavior |
| Revenue shortfall | Medium | Medium | Scale gradually, monitor metrics |
| Site blocklist | Low | High | Use aged domain, quality content |

---

## Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2026-02-10 | 0.1.0 | Initial documentation |

---

## Contacts

- **Integration Lead:** Development team
- **Clika Service:** phoenix/clika-service
- **Site:** sishairven.com

---

**Next Steps:**
1. Review and approve documentation
2. Begin Phase 1: Add niche profile to clika-service
3. Proceed to Phase 2: Client-side integration
