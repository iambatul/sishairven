import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth';
import { 
	getAllAppointments, 
	getAppointmentById, 
	updateAppointmentStatus,
	deleteAppointment,
	getAppointmentStats 
} from '$lib/db';

/**
 * GET /api/admin/appointments
 * List all appointments with optional filtering
 */
export const GET: RequestHandler = async (event) => {
	try {
		requireAdmin(event);
		
		const { url } = event;
		const status = url.searchParams.get('status');
		const limit = parseInt(url.searchParams.get('limit') || '50');
		const offset = parseInt(url.searchParams.get('offset') || '0');
		
		let appointments = getAllAppointments(limit, offset);
		
		if (status) {
			appointments = appointments.filter(a => a.status === status);
		}
		
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
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		console.error('Appointments API error:', err);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};

/**
 * PATCH /api/admin/appointments
 * Update appointment status
 */
export const PATCH: RequestHandler = async (event) => {
	try {
		requireAdmin(event);
		
		const body = await event.request.json();
		const { id, status } = body;
		
		if (!id || !status) {
			return json(
				{ success: false, error: 'Missing id or status' },
				{ status: 400 }
			);
		}
		
		if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
			return json(
				{ success: false, error: 'Invalid status' },
				{ status: 400 }
			);
		}
		
		const success = updateAppointmentStatus(id, status);
		
		if (!success) {
			return json(
				{ success: false, error: 'Appointment not found' },
				{ status: 404 }
			);
		}
		
		return json({
			success: true,
			message: `Appointment ${status}`
		});
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		console.error('Update appointment error:', err);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};

/**
 * DELETE /api/admin/appointments
 * Delete an appointment
 */
export const DELETE: RequestHandler = async (event) => {
	try {
		requireAdmin(event);
		
		const { url } = event;
		const id = url.searchParams.get('id');
		
		if (!id) {
			return json(
				{ success: false, error: 'Missing id' },
				{ status: 400 }
			);
		}
		
		const success = deleteAppointment(id);
		
		if (!success) {
			return json(
				{ success: false, error: 'Appointment not found' },
				{ status: 404 }
			);
		}
		
		return json({
			success: true,
			message: 'Appointment deleted'
		});
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		console.error('Delete appointment error:', err);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};
