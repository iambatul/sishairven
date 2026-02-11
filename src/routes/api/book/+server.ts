import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { saveAppointment, getAllAppointments, getAppointmentStats } from '$lib/db';
import { validateBookingData, validateOrThrow } from '$lib/security/validation';
import { applyRateLimit, createRateLimitHeaders } from '$lib/security/rate-limit';
import { env } from '$env/dynamic/private';
import { createHash } from 'crypto';

/**
 * Hash IP for privacy
 */
function hashIP(ip: string): string {
	return createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

/**
 * POST /api/book
 * Handle appointment booking with validation and rate limiting
 */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	try {
		// Get client IP for rate limiting and tracking
		const clientIP = getClientAddress();
		const ipHash = hashIP(clientIP);

		// Apply rate limiting (5 requests per 5 minutes per IP)
		const rateLimitResult = applyRateLimit(request, {
			maxRequests: parseInt(env.RATE_LIMIT_REQUESTS_PER_MINUTE || '5'),
			windowMs: 300000, // 5 minutes
			burst: 1,
		});

		// Parse request body
		let data;
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

		// Validate input data
		const validationResult = validateBookingData(data);
		if (!validationResult.success) {
			return json(
				{ error: validationResult.errors?.join(', ') || 'Validation failed' },
				{ 
					status: 400,
					headers: createRateLimitHeaders(rateLimitResult)
				}
			);
		}

		const validatedData = validationResult.data!;

		// Check if date is in the past
		const appointmentDate = new Date(validatedData.date);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		
		if (appointmentDate < today) {
			return json(
				{ error: 'Appointment date cannot be in the past' },
				{ 
					status: 400,
					headers: createRateLimitHeaders(rateLimitResult)
				}
			);
		}

		// Check if date is too far in the future (max 3 months)
		const maxDate = new Date();
		maxDate.setMonth(maxDate.getMonth() + 3);
		if (appointmentDate > maxDate) {
			return json(
				{ error: 'Appointments can only be booked up to 3 months in advance' },
				{ 
					status: 400,
					headers: createRateLimitHeaders(rateLimitResult)
				}
			);
		}

		// Get user agent for tracking
		const userAgent = request.headers.get('user-agent') || undefined;

		// Save to database
		const id = saveAppointment({
			name: validatedData.name,
			phone: validatedData.phone,
			email: validatedData.email,
			service: validatedData.service,
			date: validatedData.date,
			message: validatedData.message || '',
			ipHash,
			userAgent,
		});

		// Return success response with rate limit headers
		return json({
			success: true,
			id,
			message: 'Appointment request submitted successfully! We will contact you shortly to confirm.'
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

		console.error('Booking error:', err);

		return json(
			{ error: 'Failed to process booking request. Please try again.' },
			{ status: 500 }
		);
	}
};

/**
 * GET /api/book
 * Get all appointments (admin only - requires authentication)
 */
export const GET: RequestHandler = async ({ request, locals }) => {
	// Check if user is authenticated as admin
	// @ts-ignore - locals.user would be set by auth middleware
	if (!locals.user || locals.user.role !== 'admin') {
		return json(
			{ error: 'Authentication required' },
			{ status: 401 }
		);
	}

	try {
		// Get query parameters
		const url = new URL(request.url);
		const limit = parseInt(url.searchParams.get('limit') || '100');
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const status = url.searchParams.get('status');

		// Get appointments
		let appointments = getAllAppointments(limit, offset);

		// Filter by status if provided
		if (status) {
			appointments = appointments.filter(a => a.status === status);
		}

		// Get stats
		const stats = getAppointmentStats();

		return json({
			success: true,
			data: {
				appointments,
				stats,
				pagination: {
					limit,
					offset,
					total: stats.total,
					hasMore: offset + appointments.length < stats.total
				}
			}
		});
	} catch (err) {
		console.error('Error fetching appointments:', err);
		return json(
			{ error: 'Failed to fetch appointments' },
			{ status: 500 }
		);
	}
};
