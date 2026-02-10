import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { validateCountryCode } from '$lib/security/validation';
import { applyRateLimit, createRateLimitHeaders } from '$lib/security/rate-limit';

export interface SessionTrackingData {
  sessionId: string;
  country?: string;
  timezone?: string;
  referrer?: string;
  landingPage?: string;
}

/**
 * POST /api/clika/track-session
 * Track user sessions for analytics
 */
export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
  try {
    // Apply rate limiting
    const rateLimitResult = applyRateLimit(request, {
      maxRequests: 30,  // Lower limit for sessions
      windowMs: 60000,
      burst: 5,
    });
    
    const data: SessionTrackingData = await request.json();
    
    // Validate session ID
    if (!data.sessionId || typeof data.sessionId !== 'string' || data.sessionId.length > 100) {
      return json({ error: 'Invalid session ID' }, { status: 400 });
    }
    
    // Validate country if provided
    if (data.country) {
      const countryResult = validateCountryCode(data.country);
      if (!countryResult.success) {
        return json({ error: 'Invalid country code' }, { status: 400 });
      }
    }
    
    const sessionRecord = {
      sessionId: data.sessionId,
      country: data.country || locals.geo?.country || 'US',
      timezone: data.timezone || locals.geo?.timezone || 'UTC',
      referrer: data.referrer?.substring(0, 500),
      landingPage: data.landingPage?.substring(0, 500),
      ipHash: hashIP(getClientAddress()),
      userAgent: request.headers.get('User-Agent')?.substring(0, 500),
      timestamp: Date.now(),
    };
    
    // Log session (in production, save to database)
    console.log('[Clika Session]', {
      sessionId: sessionRecord.sessionId,
      country: sessionRecord.country,
    });
    
    return json(
      { success: true },
      { headers: createRateLimitHeaders(rateLimitResult) }
    );
    
  } catch (error) {
    console.error('Session tracking error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

function hashIP(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}
