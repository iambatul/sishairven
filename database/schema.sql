-- =============================================================================
-- HAIRVEN SALON - DATABASE SCHEMA
-- =============================================================================
-- SQLite database schema for:
-- - Appointment bookings
-- - Click tracking (Phoenix Clika integration)
-- - Newsletter subscriptions
-- - Admin audit logs
-- =============================================================================

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- -----------------------------------------------------------------------------
-- APPOINTMENTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    service TEXT NOT NULL,
    date TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_hash TEXT, -- Hashed IP for abuse detection
    user_agent TEXT
);

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(email);
CREATE INDEX IF NOT EXISTS idx_appointments_created ON appointments(created_at);

-- -----------------------------------------------------------------------------
-- CLICK TRACKING TABLE (Phoenix Clika Integration)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS click_tracking (
    id TEXT PRIMARY KEY,
    asin TEXT NOT NULL,
    product_name TEXT NOT NULL,
    category TEXT,
    country TEXT DEFAULT 'US',
    timezone TEXT DEFAULT 'UTC',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    source TEXT,
    campaign TEXT,
    estimated_commission REAL DEFAULT 0,
    proxy_id TEXT,
    is_business_hours BOOLEAN DEFAULT 0,
    ip_hash TEXT NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    session_id TEXT
);

-- Indexes for click tracking analytics
CREATE INDEX IF NOT EXISTS idx_clicks_asin ON click_tracking(asin);
CREATE INDEX IF NOT EXISTS idx_clicks_country ON click_tracking(country);
CREATE INDEX IF NOT EXISTS idx_clicks_timestamp ON click_tracking(timestamp);
CREATE INDEX IF NOT EXISTS idx_clicks_session ON click_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_clicks_proxy ON click_tracking(proxy_id);

-- -----------------------------------------------------------------------------
-- IMPRESSION TRACKING TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS impression_tracking (
    id TEXT PRIMARY KEY,
    asin TEXT NOT NULL,
    product_name TEXT NOT NULL,
    category TEXT,
    country TEXT DEFAULT 'US',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    visible_duration INTEGER DEFAULT 0, -- milliseconds
    ip_hash TEXT NOT NULL,
    user_agent TEXT,
    session_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_impressions_asin ON impression_tracking(asin);
CREATE INDEX IF NOT EXISTS idx_impressions_timestamp ON impression_tracking(timestamp);
CREATE INDEX IF NOT EXISTS idx_impressions_session ON impression_tracking(session_id);

-- -----------------------------------------------------------------------------
-- NEWSLETTER SUBSCRIPTIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at DATETIME,
    ip_hash TEXT,
    confirmation_token TEXT,
    confirmed BOOLEAN DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON newsletter_subscriptions(status);

-- -----------------------------------------------------------------------------
-- AUDIT LOG TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    user_id TEXT,
    details TEXT,
    ip_hash TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);

-- -----------------------------------------------------------------------------
-- RATE LIMIT TRACKING (for persistent rate limiting across restarts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rate_limit_tracking (
    key TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0,
    window_start DATETIME DEFAULT CURRENT_TIMESTAMP,
    reset_time DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_reset ON rate_limit_tracking(reset_time);

-- -----------------------------------------------------------------------------
-- VIEWS FOR ANALYTICS
-- -----------------------------------------------------------------------------

-- Daily click summary
CREATE VIEW IF NOT EXISTS v_daily_clicks AS
SELECT 
    date(timestamp) as date,
    country,
    COUNT(*) as click_count,
    SUM(estimated_commission) as total_estimated_commission
FROM click_tracking
GROUP BY date(timestamp), country;

-- Top products by clicks
CREATE VIEW IF NOT EXISTS v_top_products AS
SELECT 
    asin,
    product_name,
    category,
    COUNT(*) as click_count,
    SUM(estimated_commission) as total_commission
FROM click_tracking
GROUP BY asin, product_name, category
ORDER BY click_count DESC;

-- Appointment summary
CREATE VIEW IF NOT EXISTS v_appointment_summary AS
SELECT 
    date(created_at) as date,
    service,
    status,
    COUNT(*) as count
FROM appointments
GROUP BY date(created_at), service, status;

-- -----------------------------------------------------------------------------
-- CLEANUP TRIGGER (remove old rate limit entries)
-- -----------------------------------------------------------------------------
CREATE TRIGGER IF NOT EXISTS cleanup_old_rate_limits
AFTER INSERT ON rate_limit_tracking
BEGIN
    DELETE FROM rate_limit_tracking WHERE reset_time < datetime('now', '-1 hour');
END;

-- -----------------------------------------------------------------------------
-- UPDATE TRIGGER (automatic updated_at)
-- -----------------------------------------------------------------------------
CREATE TRIGGER IF NOT EXISTS appointments_updated_at
AFTER UPDATE ON appointments
BEGIN
    UPDATE appointments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
