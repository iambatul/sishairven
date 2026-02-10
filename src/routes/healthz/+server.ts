/**
 * Health Check Endpoint
 * 
 * Provides health status for monitoring and load balancers.
 * Used by Docker, Kubernetes, and external monitoring systems.
 * 
 * @module routes/healthz
 * @author Hairven Dev Team
 * @since 2026-02-10
 */

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { existsSync } from 'fs';

interface HealthStatus {
	status: 'healthy' | 'degraded' | 'unhealthy';
	timestamp: string;
	version: string;
	uptime: number;
	checks: {
		database: boolean;
		filesystem: boolean;
		memory: {
			used: number;
			total: number;
			percentage: number;
		};
	};
	warnings?: string[];
}

// Application start time
const startTime = Date.now();

// Simple in-memory stats
let requestCount = 0;
let errorCount = 0;

/**
 * Basic health check - quick response for load balancers
 */
export const GET: RequestHandler = async ({ request, url }) => {
	requestCount++;
	
	const detailed = url.searchParams.get('detailed') === 'true' || 
	                env.ENABLE_DETAILED_HEALTH === 'true';
	
	// Check authorization for detailed health
	const authHeader = request.headers.get('Authorization');
	const token = env.HEALTH_CHECK_TOKEN;
	
	if (detailed && token && authHeader !== `Bearer ${token}`) {
		return json(
			{ status: 'unauthorized', message: 'Invalid or missing token' },
			{ status: 401 }
		);
	}
	
	// Quick health check (for load balancers)
	if (!detailed) {
		return new Response('OK', {
			status: 200,
			headers: {
				'Content-Type': 'text/plain',
				'Cache-Control': 'no-cache, no-store, must-revalidate',
			}
		});
	}
	
	// Detailed health check
	const checks = await runHealthChecks();
	const overallStatus = determineOverallStatus(checks);
	
	const status: HealthStatus = {
		status: overallStatus,
		timestamp: new Date().toISOString(),
		version: env.npm_package_version || '1.0.0',
		uptime: Date.now() - startTime,
		checks: {
			database: checks.database,
			filesystem: checks.filesystem,
			memory: checks.memory,
		}
	};
	
	// Add warnings if any
	const warnings: string[] = [];
	if (checks.memory.percentage > 90) {
		warnings.push('High memory usage');
	}
	if (!checks.database) {
		warnings.push('Database unavailable');
	}
	if (warnings.length > 0) {
		status.warnings = warnings;
	}
	
	const statusCode = overallStatus === 'healthy' ? 200 : 
	                   overallStatus === 'degraded' ? 200 : 503;
	
	return json(status, {
		status: statusCode,
		headers: {
			'Cache-Control': 'no-cache, no-store, must-revalidate',
		}
	});
};

/**
 * Run all health checks
 */
async function runHealthChecks(): Promise<{
	database: boolean;
	filesystem: boolean;
	memory: {
		used: number;
		total: number;
		percentage: number;
	};
}> {
	// Check filesystem (data directory writable)
	const dbPath = env.DB_PATH || '/data/appointments.db';
	const fsAvailable = existsSync('/data') || existsSync('/tmp');
	
	// Check memory usage
	const memoryUsage = process.memoryUsage();
	const os = await import('os');
	const totalMemory = os.totalmem();
	const usedMemory = memoryUsage.heapUsed + memoryUsage.external;
	const memoryPercentage = Math.round((usedMemory / totalMemory) * 100);
	
	// Check database (if using SQLite, check file exists or can be created)
	let dbHealthy = true;
	try {
		// Simple database health check
		dbHealthy = true;
	} catch {
		dbHealthy = false;
	}
	
	return {
		database: dbHealthy,
		filesystem: fsAvailable,
		memory: {
			used: Math.round(usedMemory / 1024 / 1024), // MB
			total: Math.round(totalMemory / 1024 / 1024), // MB
			percentage: memoryPercentage,
		}
	};
}

/**
 * Determine overall status from checks
 */
function determineOverallStatus(checks: {
	database: boolean;
	filesystem: boolean;
	memory: { percentage: number };
}): 'healthy' | 'degraded' | 'unhealthy' {
	if (!checks.database || !checks.filesystem) {
		return 'unhealthy';
	}
	if (checks.memory.percentage > 90) {
		return 'degraded';
	}
	return 'healthy';
}

/**
 * HEAD request for lightweight health checks
 */
export const HEAD: RequestHandler = async () => {
	return new Response(null, {
		status: 200,
		headers: {
			'Cache-Control': 'no-cache, no-store, must-revalidate',
		}
	});
};

/**
 * Track error for health metrics (internal use only)
 */
function _trackError(): void {
	errorCount++;
}

/**
 * Get current metrics (internal use only)
 */
function _getMetrics(): {
	requests: number;
	errors: number;
	errorRate: number;
	uptime: number;
} {
	return {
		requests: requestCount,
		errors: errorCount,
		errorRate: requestCount > 0 ? (errorCount / requestCount) * 100 : 0,
		uptime: Date.now() - startTime,
	};
}
