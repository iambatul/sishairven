import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { loginAdmin, setSessionCookie } from '$lib/auth';
import { env } from '$env/dynamic/private';

/**
 * POST /api/admin/login
 * Admin login endpoint
 */
export const POST: RequestHandler = async (event) => {
	try {
		const { request } = event;
		const body = await request.json();
		const { email, password } = body;

		if (!email || !password) {
			return json(
				{ success: false, error: 'Email and password are required' },
				{ status: 400 }
			);
		}

		// Check if admin is configured
		if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD_HASH) {
			return json(
				{ 
					success: false, 
					error: 'Admin account not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH in environment.' 
				},
				{ status: 503 }
			);
		}

		const result = await loginAdmin(email, password);

		if (!result) {
			return json(
				{ success: false, error: 'Invalid credentials' },
				{ status: 401 }
			);
		}

		// Set session cookie
		setSessionCookie(event, result.token);

		return json({
			success: true,
			user: result.user,
			token: result.token // Also return token for API usage
		});
	} catch (err) {
		console.error('Login error:', err);
		return json(
			{ success: false, error: 'Login failed' },
			{ status: 500 }
		);
	}
};

/**
 * GET /api/admin/login
 * Check if admin is configured
 */
export const GET: RequestHandler = async () => {
	const isConfigured = !!(env.ADMIN_EMAIL && env.ADMIN_PASSWORD_HASH);
	
	return json({
		isConfigured,
		message: isConfigured 
			? 'Admin account is configured' 
			: 'Admin account not configured. Run setup script.'
	});
};
