import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateEmail, validateName } from '$lib/security/validation';
import { applyRateLimit, createRateLimitHeaders } from '$lib/security/rate-limit';
import { subscribeNewsletter } from '$lib/db';
import { createHash } from 'crypto';

interface SubscribeRequest {
	email: string;
	name?: string;
}

/**
 * Hash IP for privacy
 */
function hashIP(ip: string): string {
	return createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

/**
 * POST /api/subscribe
 * Handle newsletter subscription with validation
 */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	try {
		// Get client IP
		const clientIP = getClientAddress();
		const ipHash = hashIP(clientIP);

		// Apply rate limiting (3 subscriptions per 10 minutes per IP)
		const rateLimitResult = applyRateLimit(request, {
			maxRequests: 3,
			windowMs: 600000, // 10 minutes
			burst: 1,
		});
		
		// Parse request body
		let data: SubscribeRequest;
		try {
			data = await request.json();
		} catch {
			return json(
				{ error: 'Invalid JSON in request body' },
				{ 
					status: 400,
					headers: createRateLimitHeaders(rateLimitResult)
				}
			);
		}
		
		// Validate email
		const emailResult = validateEmail(data.email);
		if (!emailResult.success) {
			return json(
				{ error: emailResult.errors?.join(', ') || 'Invalid email' },
				{ 
					status: 400,
					headers: createRateLimitHeaders(rateLimitResult)
				}
			);
		}
		
		// Validate name if provided
		let validatedName: string | undefined;
		if (data.name) {
			const nameResult = validateName(data.name, 'Name');
			if (!nameResult.success) {
				return json(
					{ error: nameResult.errors?.join(', ') || 'Invalid name' },
					{ 
						status: 400,
						headers: createRateLimitHeaders(rateLimitResult)
					}
				);
			}
			validatedName = nameResult.data;
		}

		// Save subscription to database
		const result = subscribeNewsletter(emailResult.data!, validatedName, ipHash);

		if (!result.success) {
			return json(
				{ error: result.error || 'Subscription failed' },
				{ 
					status: 400,
					headers: createRateLimitHeaders(rateLimitResult)
				}
			);
		}
		
		// TODO: Send welcome email via SendGrid/Mailchimp
		// This would typically be done via a background job or webhook
		// For now, just log it
		console.log('Newsletter subscription:', {
			email: emailResult.data,
			name: validatedName,
			subscriptionId: result.id,
			timestamp: new Date().toISOString()
		});
		
		return json({
			success: true,
			message: result.id 
				? 'Subscription successful! Please check your email to confirm.' 
				: 'You are already subscribed!'
		}, {
			headers: createRateLimitHeaders(rateLimitResult)
		});
		
	} catch (err: unknown) {
		// Handle rate limit errors
		if (err && typeof err === 'object' && 'status' in err && err.status === 429) {
			return json(
				{ error: 'Too many requests. Please try again later.' },
				{ status: 429 }
			);
		}

		// Handle validation errors
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		
		console.error('Subscription error:', err);
		
		return json(
			{ error: 'Failed to process subscription' },
			{ status: 500 }
		);
	}
};

/**
 * GET /api/subscribe
 * Get subscription count (admin only)
 */
export const GET: RequestHandler = async ({ url }) => {
	// Simple stats endpoint - in production, require auth
	const token = url.searchParams.get('token');
	
	// Check for a simple stats token (different from admin token)
	// This is a simple implementation - in production use proper auth
	if (!token) {
		return json(
			{ error: 'Authentication required' },
			{ status: 401 }
		);
	}

	// TODO: Implement proper authentication check
	// For now return placeholder data
	return json({
		success: true,
		data: {
			total: 0,
			active: 0,
			confirmed: 0
		}
	});
};
