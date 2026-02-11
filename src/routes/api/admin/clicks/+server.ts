import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth';
import { getClickStats, trackClick, db } from '$lib/db';
import type { TimeRange } from '$lib/admin/types';

export const GET: RequestHandler = async (event) => {
	try {
		// Require admin authentication
		requireAdmin(event);

		const { url } = event;
		const range = (url.searchParams.get('range') as TimeRange) || '7d';
		const country = url.searchParams.get('country');
		const days = getDaysFromRange(range);
		
		// Get click stats from database
		const stats = getClickStats(days);
		
		// Get recent clicks with optional filtering
		let query = `
			SELECT 
				id, asin, product_name as productName, category, country, 
				timestamp, estimated_commission as estimatedCommission,
				proxy_id as proxyId, is_business_hours as isBusinessHours
			FROM click_tracking
			WHERE timestamp > datetime('now', '-${days} days')
		`;
		
		if (country) {
			query += ` AND country = '${country}'`;
		}
		
		query += ` ORDER BY timestamp DESC LIMIT 100`;
		
		const clicks = db.prepare(query).all();
		
		return json({
			success: true,
			data: {
				clicks,
				total: stats.total,
				byCountry: stats.byCountry,
				byProduct: stats.byProduct,
				totalCommission: clicks.reduce((sum: number, c: any) => sum + (c.estimatedCommission || 0), 0)
			},
			timestamp: Date.now()
		});
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		
		console.error('Clicks API error:', err);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};

function getDaysFromRange(range: TimeRange): number {
	switch (range) {
		case '24h': return 1;
		case '7d': return 7;
		case '30d': return 30;
		case '90d': return 90;
		case '1y': return 365;
		case 'all': return 3650;
		default: return 7;
	}
}
