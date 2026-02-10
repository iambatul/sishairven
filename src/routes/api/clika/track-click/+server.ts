import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/**
 * POST /api/clika/track-click
 * 
 * Proxies affiliate click tracking to Phoenix Clika service.
 * Adds session info and validates request before forwarding.
 */

const CLIKA_API_URL = env.CLIKA_API_URL || 'http://localhost:8080';
const CLIKA_API_KEY = env.CLIKA_API_KEY || '';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	try {
		const body = await request.json();
		
		// Validate required fields
		if (!body.asin || !body.session_id) {
			return json({
				success: false,
				error: 'ASIN and session_id are required'
			}, { status: 400 });
		}

		// Add client metadata
		const enrichedData = {
			...body,
			client_ip: getClientAddress(),
			user_agent: request.headers.get('user-agent'),
			referrer: request.headers.get('referer'),
			tracked_at: Date.now()
		};

		// Forward to Clika service
		const clikaResponse = await fetch(
			`${CLIKA_API_URL}/api/clika/adfraud/domains/sishairven/click`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-API-Key': CLIKA_API_KEY,
					'X-Forwarded-For': getClientAddress()
				},
				body: JSON.stringify(enrichedData)
			}
		);

		if (!clikaResponse.ok) {
			const errorText = await clikaResponse.text();
			console.warn('Clika API error:', errorText);
			// Return success to client even if backend fails (don't block user)
			return json({
				success: true,
				tracked: false,
				warning: 'Backend tracking failed but click registered locally'
			});
		}

		const result = await clikaResponse.json();

		return json({
			success: true,
			tracked: true,
			click_id: result.click_id
		});

	} catch (error) {
		console.error('Click tracking error:', error);
		// Return success to not block user experience
		return json({
			success: true,
			tracked: false,
			error: 'Tracking error logged'
		});
	}
};
