import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/**
 * POST /api/clika/track-session
 * 
 * Proxies session start/end events to Phoenix Clika service.
 * Tracks session lifecycle for traffic quality analysis.
 */

const CLIKA_API_URL = env.CLIKA_API_URL || 'http://localhost:8080';
const CLIKA_API_KEY = env.CLIKA_API_KEY || '';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	try {
		const body = await request.json();
		
		// Validate required fields
		if (!body.event || !body.session_id) {
			return json({
				success: false,
				error: 'Event type and session_id are required'
			}, { status: 400 });
		}

		// Validate event type
		if (!['start', 'end'].includes(body.event)) {
			return json({
				success: false,
				error: 'Event must be "start" or "end"'
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
			`${CLIKA_API_URL}/api/clika/adfraud/domains/sishairven/session`,
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
			console.warn('Clika session API error:', await clikaResponse.text());
			return json({
				success: true,
				tracked: false
			});
		}

		return json({
			success: true,
			tracked: true,
			event: body.event
		});

	} catch (error) {
		console.error('Session tracking error:', error);
		return json({
			success: true,
			tracked: false
		});
	}
};
