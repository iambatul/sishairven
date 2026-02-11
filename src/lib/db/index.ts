/**
 * Database Layer - SQLite Implementation
 * 
 * Replaces JSON file storage with proper SQLite database
 * using better-sqlite3 for synchronous, high-performance operations
 * 
 * @module lib/db
 * @author Hairven Dev Team
 * @since 2026-02-11
 */

import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

const DB_PATH = process.env.DB_PATH || '/data/appointments.db';

// Ensure data directory exists
try {
	mkdirSync(dirname(DB_PATH), { recursive: true });
} catch {
	// Directory might already exist
}

// Create database connection with optimizations
const db = new Database(DB_PATH, {
	verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
});

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = NORMAL');

// Initialize schema if not exists
export function initializeDatabase(): void {
	// Appointments table
	db.exec(`
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
			ip_hash TEXT,
			user_agent TEXT
		);
	`);

	// Indexes
	db.exec(`
		CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
		CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
		CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(email);
		CREATE INDEX IF NOT EXISTS idx_appointments_created ON appointments(created_at);
	`);

	// Click tracking table
	db.exec(`
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
	`);

	db.exec(`
		CREATE INDEX IF NOT EXISTS idx_clicks_asin ON click_tracking(asin);
		CREATE INDEX IF NOT EXISTS idx_clicks_country ON click_tracking(country);
		CREATE INDEX IF NOT EXISTS idx_clicks_timestamp ON click_tracking(timestamp);
		CREATE INDEX IF NOT EXISTS idx_clicks_session ON click_tracking(session_id);
	`);

	// Newsletter subscriptions
	db.exec(`
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
	`);

	db.exec(`
		CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON newsletter_subscriptions(email);
		CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON newsletter_subscriptions(status);
	`);

	// Audit log
	db.exec(`
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
	`);

	db.exec(`
		CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id);
		CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
		CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);
	`);

	// Schema migrations tracking
	db.exec(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version TEXT PRIMARY KEY,
			applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			description TEXT
		);
	`);

	// Update trigger for appointments
	db.exec(`
		CREATE TRIGGER IF NOT EXISTS appointments_updated_at
		AFTER UPDATE ON appointments
		BEGIN
			UPDATE appointments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
		END;
	`);
}

// Initialize on module load
initializeDatabase();

// =============================================================================
// APPOINTMENT OPERATIONS
// =============================================================================

export interface Appointment {
	id: string;
	name: string;
	phone: string;
	email: string;
	service: string;
	date: string;
	message?: string;
	status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
	createdAt: string;
	updatedAt: string;
	ipHash?: string;
	userAgent?: string;
}

export function saveAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { ipHash?: string; userAgent?: string }): string {
	const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	
	const stmt = db.prepare(`
		INSERT INTO appointments (id, name, phone, email, service, date, message, ip_hash, user_agent)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`);

	stmt.run(
		id,
		appointment.name,
		appointment.phone,
		appointment.email,
		appointment.service,
		appointment.date,
		appointment.message || null,
		appointment.ipHash || null,
		appointment.userAgent || null
	);

	return id;
}

export function getAllAppointments(limit: number = 100, offset: number = 0): Appointment[] {
	const stmt = db.prepare(`
		SELECT 
			id, name, phone, email, service, date, message, status,
			created_at as createdAt, updated_at as updatedAt,
			ip_hash as ipHash, user_agent as userAgent
		FROM appointments
		ORDER BY created_at DESC
		LIMIT ? OFFSET ?
	`);

	return stmt.all(limit, offset) as Appointment[];
}

export function getAppointmentById(id: string): Appointment | undefined {
	const stmt = db.prepare(`
		SELECT 
			id, name, phone, email, service, date, message, status,
			created_at as createdAt, updated_at as updatedAt,
			ip_hash as ipHash, user_agent as userAgent
		FROM appointments
		WHERE id = ?
	`);

	return stmt.get(id) as Appointment | undefined;
}

export function updateAppointmentStatus(id: string, status: Appointment['status']): boolean {
	const stmt = db.prepare(`
		UPDATE appointments SET status = ? WHERE id = ?
	`);
	const result = stmt.run(status, id);
	return result.changes > 0;
}

export function deleteAppointment(id: string): boolean {
	const stmt = db.prepare(`DELETE FROM appointments WHERE id = ?`);
	const result = stmt.run(id);
	return result.changes > 0;
}

export function getAppointmentsByDateRange(startDate: string, endDate: string): Appointment[] {
	const stmt = db.prepare(`
		SELECT 
			id, name, phone, email, service, date, message, status,
			created_at as createdAt, updated_at as updatedAt,
			ip_hash as ipHash, user_agent as userAgent
		FROM appointments
		WHERE date BETWEEN ? AND ?
		ORDER BY date ASC
	`);

	return stmt.all(startDate, endDate) as Appointment[];
}

export function getAppointmentStats(): { total: number; pending: number; confirmed: number; today: number } {
	const today = new Date().toISOString().split('T')[0];

	const totalStmt = db.prepare(`SELECT COUNT(*) as count FROM appointments`);
	const pendingStmt = db.prepare(`SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'`);
	const confirmedStmt = db.prepare(`SELECT COUNT(*) as count FROM appointments WHERE status = 'confirmed'`);
	const todayStmt = db.prepare(`SELECT COUNT(*) as count FROM appointments WHERE date = ?`);

	return {
		total: (totalStmt.get() as { count: number }).count,
		pending: (pendingStmt.get() as { count: number }).count,
		confirmed: (confirmedStmt.get() as { count: number }).count,
		today: (todayStmt.get(today) as { count: number }).count,
	};
}

// =============================================================================
// CLICK TRACKING OPERATIONS
// =============================================================================

export interface ClickEvent {
	id: string;
	asin: string;
	productName: string;
	category?: string;
	country: string;
	timezone: string;
	timestamp: string;
	source?: string;
	campaign?: string;
	estimatedCommission: number;
	proxyId?: string;
	isBusinessHours: boolean;
	ipHash: string;
	userAgent?: string;
	referrer?: string;
	sessionId?: string;
}

export function trackClick(event: Omit<ClickEvent, 'id' | 'timestamp'>): string {
	const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

	const stmt = db.prepare(`
		INSERT INTO click_tracking 
		(id, asin, product_name, category, country, timezone, source, campaign, 
		 estimated_commission, proxy_id, is_business_hours, ip_hash, user_agent, referrer, session_id)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`);

	stmt.run(
		id,
		event.asin,
		event.productName,
		event.category || null,
		event.country,
		event.timezone,
		event.source || null,
		event.campaign || null,
		event.estimatedCommission,
		event.proxyId || null,
		event.isBusinessHours ? 1 : 0,
		event.ipHash,
		event.userAgent || null,
		event.referrer || null,
		event.sessionId || null
	);

	return id;
}

export function getClickStats(days: number = 30): { total: number; byCountry: Record<string, number>; byProduct: Record<string, number> } {
	const date = new Date();
	date.setDate(date.getDate() - days);
	const since = date.toISOString();

	const totalStmt = db.prepare(`
		SELECT COUNT(*) as count FROM click_tracking WHERE timestamp > ?
	`).get(since) as { count: number };

	const byCountryStmt = db.prepare(`
		SELECT country, COUNT(*) as count 
		FROM click_tracking 
		WHERE timestamp > ?
		GROUP BY country
	`);

	const byProductStmt = db.prepare(`
		SELECT asin, product_name, COUNT(*) as count 
		FROM click_tracking 
		WHERE timestamp > ?
		GROUP BY asin
		ORDER BY count DESC
		LIMIT 10
	`);

	const byCountry = byCountryStmt.all(since) as { country: string; count: number }[];
	const byProduct = byProductStmt.all(since) as { asin: string; product_name: string; count: number }[];

	return {
		total: totalStmt.count,
		byCountry: byCountry.reduce((acc, curr) => {
			acc[curr.country] = curr.count;
			return acc;
		}, {} as Record<string, number>),
		byProduct: byProduct.reduce((acc, curr) => {
			acc[curr.asin] = curr.count;
			return acc;
		}, {} as Record<string, number>),
	};
}

// =============================================================================
// NEWSLETTER OPERATIONS
// =============================================================================

export interface NewsletterSubscription {
	id: string;
	email: string;
	name?: string;
	status: 'active' | 'unsubscribed' | 'bounced';
	subscribedAt: string;
	unsubscribedAt?: string;
	confirmed: boolean;
}

export function subscribeNewsletter(email: string, name?: string, ipHash?: string): { success: boolean; id?: string; error?: string } {
	// Check if already subscribed
	const checkStmt = db.prepare(`SELECT id, status FROM newsletter_subscriptions WHERE email = ?`);
	const existing = checkStmt.get(email) as { id: string; status: string } | undefined;

	if (existing) {
		if (existing.status === 'active') {
			return { success: false, error: 'Email already subscribed' };
		}
		// Resubscribe
		const updateStmt = db.prepare(`
			UPDATE newsletter_subscriptions 
			SET status = 'active', name = ?, unsubscribed_at = NULL, confirmed = 0
			WHERE id = ?
		`);
		updateStmt.run(name || null, existing.id);
		return { success: true, id: existing.id };
	}

	const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	const token = Math.random().toString(36).substr(2, 16);

	const stmt = db.prepare(`
		INSERT INTO newsletter_subscriptions (id, email, name, confirmation_token, ip_hash)
		VALUES (?, ?, ?, ?, ?)
	`);

	stmt.run(id, email, name || null, token, ipHash || null);

	return { success: true, id };
}

export function confirmSubscription(token: string): boolean {
	const stmt = db.prepare(`
		UPDATE newsletter_subscriptions 
		SET confirmed = 1, confirmation_token = NULL
		WHERE confirmation_token = ?
	`);
	const result = stmt.run(token);
	return result.changes > 0;
}

export function unsubscribeNewsletter(email: string): boolean {
	const stmt = db.prepare(`
		UPDATE newsletter_subscriptions 
		SET status = 'unsubscribed', unsubscribed_at = CURRENT_TIMESTAMP
		WHERE email = ?
	`);
	const result = stmt.run(email);
	return result.changes > 0;
}

export function getNewsletterSubscribers(onlyConfirmed: boolean = true, onlyActive: boolean = true): NewsletterSubscription[] {
	let query = `
		SELECT id, email, name, status, subscribed_at as subscribedAt, 
		       unsubscribed_at as unsubscribedAt, confirmed
		FROM newsletter_subscriptions
		WHERE 1=1
	`;

	if (onlyActive) {
		query += ` AND status = 'active'`;
	}
	if (onlyConfirmed) {
		query += ` AND confirmed = 1`;
	}

	query += ` ORDER BY subscribed_at DESC`;

	return db.prepare(query).all() as NewsletterSubscription[];
}

// =============================================================================
// AUDIT LOG
// =============================================================================

export function logAudit(
	action: string,
	entityType: string,
	entityId?: string,
	userId?: string,
	details?: string,
	ipHash?: string,
	userAgent?: string
): void {
	const stmt = db.prepare(`
		INSERT INTO audit_log (action, entity_type, entity_id, user_id, details, ip_hash, user_agent)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`);

	stmt.run(action, entityType, entityId || null, userId || null, details || null, ipHash || null, userAgent || null);
}

export function getAuditLog(limit: number = 100): unknown[] {
	const stmt = db.prepare(`
		SELECT * FROM audit_log
		ORDER BY created_at DESC
		LIMIT ?
	`);
	return stmt.all(limit);
}

// Export database instance for advanced queries
export { db };
