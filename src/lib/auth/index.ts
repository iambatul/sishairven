/**
 * Authentication System
 * 
 * Simple token-based authentication for admin endpoints.
 * In production, consider using Auth0, Clerk, or Supabase Auth.
 * 
 * @module lib/auth
 * @author Hairven Dev Team
 * @since 2026-02-11
 */

import { error, type RequestEvent } from '@sveltejs/kit';
import { createHash, timingSafeEqual, randomUUID } from 'crypto';
import { env } from '$env/dynamic/private';

// =============================================================================
// TYPES
// =============================================================================

export interface User {
	id: string;
	email: string;
	role: 'admin' | 'editor' | 'viewer';
	name: string;
}

export interface AuthSession {
	user: User;
	expiresAt: number;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const ADMIN_TOKEN = env.ADMIN_API_TOKEN || '';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// In-memory session store (use Redis in production with multiple servers)
const sessions = new Map<string, AuthSession>();

// Cleanup old sessions periodically
setInterval(() => {
	const now = Date.now();
	for (const [token, session] of sessions.entries()) {
		if (session.expiresAt < now) {
			sessions.delete(token);
		}
	}
}, 60 * 60 * 1000); // Clean up every hour

// =============================================================================
// PASSWORD HASHING (for future user system)
// =============================================================================

export function hashPassword(password: string): string {
	const salt = randomUUID();
	const hash = createHash('sha256')
		.update(password + salt)
		.digest('hex');
	return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashed: string): boolean {
	const [salt, hash] = hashed.split(':');
	if (!salt || !hash) return false;
	
	const computed = createHash('sha256')
		.update(password + salt)
		.digest('hex');
	
	// Timing-safe comparison
	try {
		const hashBuf = Buffer.from(hash, 'hex');
		const computedBuf = Buffer.from(computed, 'hex');
		return timingSafeEqual(hashBuf, computedBuf);
	} catch {
		return false;
	}
}

// =============================================================================
// TOKEN AUTHENTICATION
// =============================================================================

/**
 * Generate a secure random token
 */
export function generateToken(): string {
	return randomUUID().replace(/-/g, '');
}

/**
 * Create a new session for a user
 */
export function createSession(user: User): string {
	const token = generateToken();
	const session: AuthSession = {
		user,
		expiresAt: Date.now() + SESSION_DURATION_MS,
	};
	sessions.set(token, session);
	return token;
}

/**
 * Validate a session token
 */
export function validateSession(token: string): User | null {
	if (!token) return null;
	
	const session = sessions.get(token);
	if (!session) return null;
	
	if (session.expiresAt < Date.now()) {
		sessions.delete(token);
		return null;
	}
	
	return session.user;
}

/**
 * Revoke a session
 */
export function revokeSession(token: string): boolean {
	return sessions.delete(token);
}

// =============================================================================
// API TOKEN AUTHENTICATION (for server-to-server)
// =============================================================================

/**
 * Validate admin API token from environment
 */
export function validateAdminToken(token: string): boolean {
	if (!ADMIN_TOKEN || !token) return false;
	
	// Use timing-safe comparison to prevent timing attacks
	try {
		const tokenBuf = Buffer.from(token);
		const adminBuf = Buffer.from(ADMIN_TOKEN);
		
		if (tokenBuf.length !== adminBuf.length) return false;
		
		return timingSafeEqual(tokenBuf, adminBuf);
	} catch {
		return false;
	}
}

// =============================================================================
// SVELTEKIT INTEGRATION
// =============================================================================

/**
 * Extract bearer token from Authorization header
 */
export function extractBearerToken(request: Request): string | null {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader) return null;
	
	const match = authHeader.match(/^Bearer\s+(.+)$/i);
	return match ? match[1] : null;
}

/**
 * Extract session token from cookie
 */
export function extractSessionCookie(event: RequestEvent): string | null {
	const cookie = event.cookies.get('session');
	return cookie || null;
}

/**
 * Middleware to require authentication
 * Use in +server.ts files
 */
export function requireAuth(event: RequestEvent): User {
	// Check for bearer token first (API access)
	const bearerToken = extractBearerToken(event.request);
	if (bearerToken) {
		if (validateAdminToken(bearerToken)) {
			// Return admin user for API token
			return {
				id: 'api',
				email: 'api@sishairven.com',
				role: 'admin',
				name: 'API User',
			};
		}
		
		// Check session token
		const user = validateSession(bearerToken);
		if (user) return user;
	}
	
	// Check for session cookie (browser access)
	const sessionToken = extractSessionCookie(event);
	if (sessionToken) {
		const user = validateSession(sessionToken);
		if (user) return user;
	}
	
	// Not authenticated
	throw error(401, 'Authentication required');
}

/**
 * Middleware to require admin role
 */
export function requireAdmin(event: RequestEvent): User {
	const user = requireAuth(event);
	
	if (user.role !== 'admin') {
		throw error(403, 'Admin access required');
	}
	
	return user;
}

/**
 * Set session cookie
 */
export function setSessionCookie(event: RequestEvent, token: string): void {
	event.cookies.set('session', token, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 60 * 60 * 24, // 24 hours
	});
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(event: RequestEvent): void {
	event.cookies.delete('session', { path: '/' });
}

// =============================================================================
// LOGIN/LOGOUT HANDLERS
// =============================================================================

/**
 * Simple admin login (for initial setup)
 * In production, use a proper user database
 */
export async function loginAdmin(email: string, password: string): Promise<{ token: string; user: User } | null> {
	// For initial setup, check against environment variables
	const adminEmail = env.ADMIN_EMAIL;
	const adminPasswordHash = env.ADMIN_PASSWORD_HASH;
	
	if (!adminEmail || !adminPasswordHash) {
		console.error('Admin credentials not configured');
		return null;
	}
	
	if (email !== adminEmail) return null;
	if (!verifyPassword(password, adminPasswordHash)) return null;
	
	const user: User = {
		id: 'admin-1',
		email,
		role: 'admin',
		name: 'Administrator',
	};
	
	const token = createSession(user);
	return { token, user };
}

/**
 * Login with API token (for CLI/automated tools)
 */
export function loginWithApiToken(token: string): User | null {
	if (!validateAdminToken(token)) return null;
	
	return {
		id: 'api',
		email: 'api@sishairven.com',
		role: 'admin',
		name: 'API User',
	};
}
