/**
 * Rate Limiting Implementation
 * 
 * Simple in-memory rate limiter for API endpoints.
 * For production with multiple servers, use Redis or similar.
 * 
 * @module lib/security/rate-limit
 * @author Hairven Dev Team
 * @since 2026-02-10
 */

import { error } from '@sveltejs/kit';

// Rate limit entry
interface RateLimitEntry {
	count: number;
	resetTime: number;
	windowStart: number;
}

// In-memory store (use Redis in production multi-server setup)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const DEFAULT_WINDOW_MS = 60000; // 1 minute
const DEFAULT_MAX_REQUESTS = 60; // 60 requests per minute
const DEFAULT_BURST = 10; // Allow burst of 10

// Cleanup interval (run every 5 minutes)
setInterval(() => {
	const now = Date.now();
	for (const [key, entry] of rateLimitStore.entries()) {
		if (entry.resetTime < now) {
			rateLimitStore.delete(key);
		}
	}
}, 300000);

export interface RateLimitOptions {
	// Time window in milliseconds
	windowMs?: number;
	// Maximum requests per window
	maxRequests?: number;
	// Burst allowance
	burst?: number;
	// Skip successful requests from counting
	skipSuccessful?: boolean;
	// Custom key generator
	keyGenerator?: (request: Request) => string;
	// Custom handler for rate limit exceeded
	handler?: (retryAfter: number) => never;
}

export interface RateLimitResult {
	allowed: boolean;
	limit: number;
	remaining: number;
	resetTime: number;
	retryAfter?: number;
}

/**
 * Generate rate limit key from request
 */
export function getRateLimitKey(request: Request, prefix: string = ''): string {
	// Get IP from various headers
	const forwarded = request.headers.get('X-Forwarded-For');
	const realIP = request.headers.get('X-Real-IP');
	const cfConnectingIP = request.headers.get('CF-Connecting-IP');
	
	// Use Cloudflare IP first, then fall back
	const ip = cfConnectingIP || realIP || forwarded?.split(',')[0]?.trim() || 'unknown';
	
	// Include path in key for per-endpoint limiting
	const url = new URL(request.url);
	return `${prefix}:${ip}:${url.pathname}`;
}

/**
 * Check rate limit for a key
 */
export function checkRateLimit(
	key: string,
	options: RateLimitOptions = {}
): RateLimitResult {
	const now = Date.now();
	const windowMs = options.windowMs || DEFAULT_WINDOW_MS;
	const maxRequests = options.maxRequests || DEFAULT_MAX_REQUESTS;
	const burst = options.burst || DEFAULT_BURST;
	
	const entry = rateLimitStore.get(key);
	
	// If no entry or window expired, create new entry
	if (!entry || entry.resetTime < now) {
		const newEntry: RateLimitEntry = {
			count: 1,
			resetTime: now + windowMs,
			windowStart: now,
		};
		rateLimitStore.set(key, newEntry);
		
		return {
			allowed: true,
			limit: maxRequests,
			remaining: maxRequests - 1,
			resetTime: newEntry.resetTime,
		};
	}
	
	// Check if under limit (including burst)
	if (entry.count < maxRequests + burst) {
		entry.count++;
		
		return {
			allowed: entry.count <= maxRequests + burst,
			limit: maxRequests,
			remaining: Math.max(0, maxRequests + burst - entry.count),
			resetTime: entry.resetTime,
		};
	}
	
	// Rate limit exceeded
	const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
	
	return {
		allowed: false,
		limit: maxRequests,
		remaining: 0,
		resetTime: entry.resetTime,
		retryAfter,
	};
}

/**
 * Apply rate limiting to a request
 * Throws error if rate limit exceeded
 */
export function applyRateLimit(
	request: Request,
	options: RateLimitOptions = {}
): RateLimitResult {
	const keyGenerator = options.keyGenerator || ((req) => getRateLimitKey(req));
	const key = keyGenerator(request);
	
	const result = checkRateLimit(key, options);
	
	if (!result.allowed) {
		const handler = options.handler || ((retryAfter) => {
			throw error(429, `Too many requests. Retry after ${retryAfter} seconds.`);
		});
		handler(result.retryAfter || 60);
	}
	
	return result;
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
	return {
		'X-RateLimit-Limit': String(result.limit),
		'X-RateLimit-Remaining': String(result.remaining),
		'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
	};
}

/**
 * Middleware-style rate limiter for SvelteKit
 * Usage in +server.ts:
 * 
 * export const POST = async ({ request }) => {
 *   const rateLimit = createRateLimiter({ maxRequests: 5, windowMs: 60000 });
 *   rateLimit(request);
 *   // ... handle request
 * };
 */
export function createRateLimiter(options: RateLimitOptions = {}) {
	return (request: Request): RateLimitResult => {
		return applyRateLimit(request, options);
	};
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const rateLimiters = {
	// Strict limit for admin endpoints
	admin: createRateLimiter({
		maxRequests: 10,
		windowMs: 60000,
		burst: 2,
	}),
	
	// Standard API limit
	api: createRateLimiter({
		maxRequests: 60,
		windowMs: 60000,
		burst: 10,
	}),
	
	// Relaxed limit for public pages
	public: createRateLimiter({
		maxRequests: 120,
		windowMs: 60000,
		burst: 20,
	}),
	
	// Strict limit for form submissions (booking, contact)
	forms: createRateLimiter({
		maxRequests: 5,
		windowMs: 300000, // 5 minutes
		burst: 1,
	}),
};
