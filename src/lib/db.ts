/**
 * Database exports (backwards compatibility)
 * @deprecated Use $lib/db/index instead
 */

export {
	saveAppointment,
	getAllAppointments,
	getAppointmentById,
	updateAppointmentStatus,
	deleteAppointment,
	getAppointmentsByDateRange,
	getAppointmentStats,
	trackClick,
	getClickStats,
	subscribeNewsletter,
	confirmSubscription,
	unsubscribeNewsletter,
	getNewsletterSubscribers,
	logAudit,
	getAuditLog,
	db,
	initializeDatabase,
	type Appointment,
	type ClickEvent,
	type NewsletterSubscription,
} from './db/index';
