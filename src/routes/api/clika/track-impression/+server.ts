import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/**
 * POST /api/clika/track-impression
 * 
 * Proxies ad impression tracking to Phoenix Clika service.
 * Tracks when ads are 50%+ visible for 1+ seconds.
 */

const CLIKA_API_URL = env.CLIKA_API_URL || 'http://localhost:8080';
const CLIKA_API_KEY = env.CLIKA_API_KEY || '';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	try {
		const body = await request.json();
		
		// Validate required fields
		if (!body.position) {
			return json({
				success: false,
				error: 'Position is required'
			}, { status: 400 });
		}

		// Add client metadata
		const enrichedData = {
			...body,
			ad_network: 'google_adsense', // Default, can be overridden
			client_ip: getClientAddress(),
			user_agent: request.headers.get('user-agent'),
			tracked_at: Date.now()
		};

		// Forward to Clika service
		const clikaResponse = await fetch(
			`${CLIKA_API_URL}/api/clika/adfraud/domains/sishairven/impression`,
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
			console.warn('Clika impression API error:', await clikaResponse.text());
			return json({
				success: true,
				tracked: false
			});
		}

		return json({
			success: true,
			tracked: true
		});

	} catch (error) {
		console.error('Impression tracking error:', error);
		return json({
			success: true,
			tracked: false
		});
	}
};
