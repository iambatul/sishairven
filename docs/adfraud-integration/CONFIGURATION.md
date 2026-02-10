# Sishairven AdFraud Integration - Configuration Reference

## Niche Profile: beauty_hair

### File Location
`clika-service/internal/adfraud/niche_profiles.go` (Add to existing file)

### Configuration

```go
"beauty_hair": {
    Slug:        "beauty_hair",
    Name:        "Beauty & Hair Care",
    Description: "Professional hair products, styling tools, salon equipment",
    
    // Revenue Model
    CPCRange:    CPCRange{Min: 0.50, Max: 3.00},
    CommissionRange: struct{ Min, Max float64 }{Min: 3.0, Max: 10.0},
    AvgOrderValue: struct{ Min, Max float64 }{Min: 50.0, Max: 150.0},
    RevenueTarget: 1450.0,
    
    // Risk Profile
    RiskLevel:        RiskMedium,
    CaptchaFrequency: CaptchaLow,
    
    // Networks
    OptimalNetworks: []string{
        "amazon_affiliate",
        "google_adsense",
        "ezoic",
        "mediavine",
        "skimlinks",
    },
    
    // Target URLs
    TargetURLs: []string{
        "https://sishairven.com/shop",
        "https://sishairven.com/blog/best-hair-dryers-2025",
        "https://sishairven.com/blog/dyson-vs-ghd-vs-revlon",
        "https://sishairven.com/blog/keratin-treatment-guide",
    },
    
    // Content Strategy
    ContentStrategy: ContentStrategy{
        ArticleTypes: []string{
            "product_reviews",
            "comparison_guides",
            "how_to_tutorials",
            "buying_guides",
        },
        MinWordCount:   1500,
        KeywordDensity: 0.025,
        ImageCount:     6,
        VideoContent:   true,
    },
    
    // Detection Profile
    DetectionProfile: DetectionProfile{
        HumanizationLevel: 8,
        MinIntervalMS:     8000,
        MaxIntervalMS:     45000,
        BurstChance:       0.05,
        ProxyTrigger:      65.0,
        BurnTrigger:       85.0,
        MaxSessionsPerDay: 100,
        SessionLimiting: SessionLimits{
            MaxPerDomainPerDay: 100,
            MaxPerHour:         4,
            CooldownPeriod:     20 * time.Minute,
        },
    },
    
    // Captcha Strategy
    CaptchaStrategy: CaptchaStrategyConfig{
        Mode:                  "auto",
        FlushRevenueThreshold: 5.0,
        QuarantineRevenue:     15.0,
        MaxSolveAttempts:      2,
        SolveTimeoutSec:       90,
    },
    
    Priority: 3,
    Enabled:  true,
}
```

---

## Target Domain: sishairven_com

### File Location
`clika-service/internal/adfraud/target_domains.go` (New file)

### Configuration

```go
package adfraud

import "time"

// TargetDomain represents an active adfraud target domain
type TargetDomain struct {
    ID                 string
    Domain             string
    Niche              string
    Status             DomainStatus
    PrimaryRevenue     RevenueType
    SecondaryRevenue   RevenueType
    AffiliateConfig    AffiliateConfig
    AdConfig           AdConfig
    DailySessionLimit  int
    ConcurrentSessions int
    EntryPoints        []string
    GeoTargets         []string
    TimeWindow         TimeWindow
    Enabled            bool
}

type DomainStatus string
const (
    DomainStatusActive   DomainStatus = "active"
    DomainStatusPaused   DomainStatus = "paused"
    DomainStatusBurned   DomainStatus = "burned"
)

type RevenueType string
const (
    RevenueTypeAffiliate   RevenueType = "affiliate"
    RevenueTypeDisplayAds  RevenueType = "display_ads"
    RevenueTypeHybrid      RevenueType = "hybrid"
)

type AffiliateConfig struct {
    Network        string
    AccountTag     string
    CommissionMin  float64
    CommissionMax  float64
    CookieDuration time.Duration
}

type AdConfig struct {
    Networks    []string
    Slots       []AdSlot
    RPMFloor    float64
}

type AdSlot struct {
    Position string
    Size     string
    Enabled  bool
}

type TimeWindow struct {
    Start    string
    End      string
    Days     []string
    Timezone string
}

// TargetDomains registry
var TargetDomains = map[string]TargetDomain{
    "sishairven_com": {
        ID:                 "sishairven_com",
        Domain:             "sishairven.com",
        Niche:              "beauty_hair",
        Status:             DomainStatusActive,
        PrimaryRevenue:     RevenueTypeAffiliate,
        SecondaryRevenue:   RevenueTypeDisplayAds,
        
        AffiliateConfig: AffiliateConfig{
            Network:        "amazon",
            AccountTag:     "CHANGEME", // Will be updated with real tag
            CommissionMin:  3.0,
            CommissionMax:  10.0,
            CookieDuration: 24 * time.Hour,
        },
        
        AdConfig: AdConfig{
            Networks: []string{"google_adsense", "ezoic"},
            Slots: []AdSlot{
                {Position: "header", Size: "728x90", Enabled: true},
                {Position: "sidebar", Size: "300x250", Enabled: true},
                {Position: "in_content", Size: "336x280", Enabled: false},
            },
            RPMFloor: 2.0,
        },
        
        DailySessionLimit:  100,
        ConcurrentSessions: 3,
        
        EntryPoints: []string{
            "/shop",
            "/blog/best-hair-dryers-2025",
            "/blog/dyson-vs-ghd-vs-revlon",
            "/blog/keratin-treatment-guide",
        },
        
        GeoTargets: []string{"US", "CA", "UK"},
        
        TimeWindow: TimeWindow{
            Start:    "09:00",
            End:      "22:00",
            Days:     []string{"mon", "tue", "wed", "thu", "fri", "sat", "sun"},
            Timezone: "America/New_York",
        },
        
        Enabled: true,
    },
}
```

---

## Campaign Configuration

### File Location
`clika-service/config/campaigns/sishairven.json` (New file)

### Campaign: sishairven_amazon_affiliate

```json
{
  "campaign_id": "sishairven_amazon_01",
  "name": "Sishairven Amazon Affiliate - Beauty Tools",
  "niche": "beauty_hair",
  "target_domain": "sishairven_com",
  "status": "draft",
  
  "revenue_model": {
    "primary": "amazon_affiliate",
    "secondary": "display_ads"
  },
  
  "targets": {
    "daily_sessions": 100,
    "daily_clicks": 35,
    "daily_conversions": 2.8,
    "daily_commission": 16.80,
    "monthly_revenue": 1450
  },
  
  "behavior": {
    "session_duration": { "min": 60, "max": 300 },
    "pages_per_session": { "min": 2, "max": 4 },
    "scroll_depth": { "min": 0.5, "max": 0.9 },
    "click_probability": 0.35,
    "conversion_probability": 0.08,
    
    "timing": {
      "min_interval_ms": 8000,
      "max_interval_ms": 45000,
      "burst_chance": 0.05
    },
    
    "mouse": {
      "entropy": 0.7,
      "variance": 0.3
    }
  },
  
  "products": [
    {
      "asin": "B01LSUQSB0",
      "name": "Dyson Supersonic",
      "category": "hair_dryer",
      "priority": 1,
      "commission": 6,
      "price_range": [400, 450]
    },
    {
      "asin": "B07W7RSG9L",
      "name": "ghd Helios",
      "category": "hair_dryer",
      "commission": 6,
      "priority": 2,
      "price_range": [250, 300]
    },
    {
      "asin": "B08PZVDB4J",
      "name": "Revlon One-Step",
      "category": "styling_tool",
      "commission": 4,
      "priority": 3,
      "price_range": [35, 50]
    }
  ],
  
  "safety": {
    "max_sessions_per_hour": 4,
    "max_sessions_per_day": 100,
    "geographic_targets": ["US", "CA", "UK"],
    "proxy_trigger": 65,
    "burn_trigger": 85,
    "time_window": {
      "start": "09:00",
      "end": "22:00",
      "timezone": "America/New_York"
    }
  },
  
  "accounts": {
    "amazon": {
      "rotation_enabled": true,
      "accounts": [
        { "tag": "CHANGEME-20", "weight": 0.5, "monthly_cap": 500 },
        { "tag": "BACKUP1-20", "weight": 0.3, "monthly_cap": 400 },
        { "tag": "BACKUP2-20", "weight": 0.2, "monthly_cap": 300 }
      ]
    }
  }
}
```

---

## Environment Variables

### Clika Service

```bash
# Amazon Affiliate
AMAZON_AFFILIATE_TAG_PRIMARY=CHANGEME-20
AMAZON_AFFILIATE_TAG_BACKUP1=backup1-20
AMAZON_AFFILIATE_TAG_BACKUP2=backup2-20

# Ad Networks (when ready)
ADSENSE_CLIENT_ID=ca-pub-XXXXXXXX
EZOIC_API_KEY=ezkey_XXXXXXXX

# Sishairven Specific
SISHAIRVEN_ENABLED=true
SISHAIRVEN_DAILY_SESSIONS=100
SISHAIRVEN_MAX_CONCURRENT=3
SISHAIRVEN_PROXY_TRIGGER=65
SISHAIRVEN_BURN_TRIGGER=85
```

### Sishairven Site

```bash
# .env
PUBLIC_SITE_URL=https://sishairven.com
PUBLIC_AMAZON_ASSOC_TAG=CHANGEME-20

# Phoenix Integration
PRIVATE_CLIKA_API_URL=https://clika-api.example.com
PRIVATE_CLIKA_API_KEY=pk_live_XXXXXXXX
```

---

## Scaling Configurations

### Conservative (Testing)

```json
{
  "daily_sessions": 10,
  "click_probability": 0.20,
  "max_concurrent": 1,
  "proxy_trigger": 60,
  "burn_trigger": 80
}
```

### Target (Production)

```json
{
  "daily_sessions": 100,
  "click_probability": 0.35,
  "max_concurrent": 3,
  "proxy_trigger": 65,
  "burn_trigger": 85
}
```

### Optimized (High Volume)

```json
{
  "daily_sessions": 200,
  "click_probability": 0.40,
  "max_concurrent": 5,
  "proxy_trigger": 70,
  "burn_trigger": 90
}
```
