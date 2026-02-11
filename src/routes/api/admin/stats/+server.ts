import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth';
import { getAppointmentStats, getClickStats } from '$lib/db';
import type { TimeRange } from '$lib/admin/types';

export const GET: RequestHandler = async (event) => {
	try {
		// Require admin authentication
		requireAdmin(event);

		const { url } = event;
		const type = url.searchParams.get('type') || 'dashboard';
		const range = (url.searchParams.get('range') as TimeRange) || '7d';
		
		switch (type) {
			case 'dashboard': {
				const appointmentStats = getAppointmentStats();
				const clickStats = getClickStats(30);
				
				return json({
					success: true,
					data: {
						todayVisitors: Math.floor(Math.random() * 100) + 50, // Placeholder until analytics
						todayClicks: clickStats.total,
						todayRevenue: clickStats.total * 0.06, // Estimated commission
						appointments: appointmentStats,
						visitorChange: 5.2,
						clickChange: -2.1,
						revenueChange: 8.5,
					},
					timestamp: Date.now()
				});
			}
			
			case 'geo': {
				const clickStats = getClickStats(getDaysFromRange(range));
				
				return json({
					success: true,
					data: {
						countries: Object.entries(clickStats.byCountry).map(([country, count]) => ({
							country,
							countryName: country,
							visitors: count,
							percentage: Math.round((count / clickStats.total) * 100) || 0,
							change: 0,
						})),
						languages: [],
						traffic: [],
						totalVisitors: clickStats.total,
						totalPageViews: clickStats.total * 2, // Estimate
						avgSessionDuration: 180,
						bounceRate: 0.45,
					},
					timestamp: Date.now()
				});
			}

			case 'appointments': {
				const stats = getAppointmentStats();
				return json({
					success: true,
					data: stats,
					timestamp: Date.now()
				});
			}
			
			default:
				return json({
					success: false,
					error: 'Invalid stats type',
					timestamp: Date.now()
				}, { status: 400 });
		}
	} catch (err: unknown) {
		// Handle auth errors
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}

		console.error('Admin stats error:', err);
		return json({
			success: false,
			error: 'Internal server error',
			timestamp: Date.now()
		}, { status: 500 });
	}
};

function getDaysFromRange(range: TimeRange): number {
	switch (range) {
		case '24h': return 1;
		case '7d': return 7;
		case '30d': return 30;
		case '90d': return 90;
		case '1y': return 365;
		case 'all': return 3650; // 10 years
		default: return 7;
	}
}
