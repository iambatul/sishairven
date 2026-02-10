/**
 * Security Module Index
 * 
 * Central export point for all security utilities.
 * 
 * @module lib/security
 * @author Hairven Dev Team
 * @since 2026-02-10
 */

// Security headers
export {
	generateNonce,
	buildCSPHeader,
	getSecurityHeaders,
	applySecurityHeaders,
	cspDirectives,
	isTrustedProxy,
	getClientIP,
} from './headers';

// Input validation
export {
	validateEmail,
	validatePhone,
	validateName,
	validateMessage,
	validateASIN,
	validateURL,
	validateCountryCode,
	validateLanguageCode,
	validateDate,
	sanitizeHTML,
	validateOrThrow,
	validateBookingData,
} from './validation';

// Rate limiting
export {
	getRateLimitKey,
	checkRateLimit,
	applyRateLimit,
	createRateLimitHeaders,
	createRateLimiter,
	rateLimiters,
} from './rate-limit';

// Re-export types
export type { ValidationResult } from './validation';
export type { RateLimitOptions, RateLimitResult } from './rate-limit';
