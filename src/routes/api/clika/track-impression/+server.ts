import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { validateASIN } from '$lib/security/validation';
import { applyRateLimit, createRateLimitHeaders } from '$lib/security/rate-limit';

export interface ImpressionTrackingData {
  asin: string;
  productName: string;
  category?: string;
  country?: string;
  visibleDuration?: number;
}

/**
 * POST /api/clika/track-impression
 * Track product impressions with validation
 */
export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
  try {
    // Apply rate limiting
    const rateLimitResult = applyRateLimit(request, {
      maxRequests: 200,  // Higher limit for impressions
      windowMs: 60000,
      burst: 50,
    });
    
    const data: ImpressionTrackingData = await request.json();
    
    // Validate ASIN
    const asinResult = validateASIN(data.asin);
    if (!asinResult.success) {
      return json({ error: 'Invalid ASIN' }, { status: 400 });
    }
    
    const impressionRecord = {
      asin: asinResult.data,
      productName: data.productName?.substring(0, 200),
      category: data.category,
      country: data.country || locals.geo?.country || 'US',
      visibleDuration: Math.min(data.visibleDuration || 0, 300000), // Max 5 minutes
      ipHash: hashIP(getClientAddress()),
      timestamp: Date.now(),
    };
    
    // Log impression (in production, save to database)
    console.log('[Clika Impression]', {
      asin: impressionRecord.asin,
      country: impressionRecord.country,
      duration: impressionRecord.visibleDuration,
    });
    
    return json(
      { success: true },
      { headers: createRateLimitHeaders(rateLimitResult) }
    );
    
  } catch (error) {
    console.error('Impression tracking error:', error);
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
