import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { validateASIN, validateCountryCode } from '$lib/security/validation';
import { applyRateLimit, createRateLimitHeaders } from '$lib/security/rate-limit';

export interface ClickTrackingData {
  asin: string;
  productName: string;
  category: string;
  country: string;
  timezone?: string;
  timestamp: number;
  source?: string;
  campaign?: string;
  estimatedCommission?: number;
  proxyId?: string;
  isBusinessHours?: boolean;
}

/**
 * POST /api/clika/track-click
 * Track affiliate link clicks with validation and rate limiting
 */
export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
  try {
    // Apply rate limiting for click tracking
    const rateLimitResult = applyRateLimit(request, {
      maxRequests: 120,  // Higher limit for clicks
      windowMs: 60000,
      burst: 20,
    });
    
    const data: ClickTrackingData = await request.json();
    
    // Validate ASIN
    const asinResult = validateASIN(data.asin);
    if (!asinResult.success) {
      return json({ error: 'Invalid ASIN' }, { status: 400 });
    }
    
    // Validate product name
    if (!data.productName || typeof data.productName !== 'string' || data.productName.length > 200) {
      return json({ error: 'Invalid product name' }, { status: 400 });
    }
    
    // Validate country if provided
    if (data.country) {
      const countryResult = validateCountryCode(data.country);
      if (!countryResult.success) {
        return json({ error: 'Invalid country code' }, { status: 400 });
      }
    }
    
    const trackingRecord = {
      ...data,
      asin: asinResult.data,
      country: data.country || locals.geo?.country || 'US',
      timezone: data.timezone || locals.geo?.timezone || 'UTC',
      ipHash: hashIP(getClientAddress()),
      serverTimestamp: Date.now(),
      userAgent: request.headers.get('User-Agent') || 'unknown',
    };
    
    // Log click (in production, save to database)
    console.log('[Clika Click]', {
      asin: trackingRecord.asin,
      country: trackingRecord.country,
      estimatedCommission: trackingRecord.estimatedCommission,
    });
    
    return json(
      { success: true, id: generateTrackingId() },
      { headers: createRateLimitHeaders(rateLimitResult) }
    );
    
  } catch (error) {
    console.error('Click tracking error:', error);
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

function generateTrackingId(): string {
  return `clk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
