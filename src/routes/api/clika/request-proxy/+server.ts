import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { applyRateLimit, createRateLimitHeaders } from '$lib/security/rate-limit';
import { validateURL } from '$lib/security/validation';

/**
 * POST /api/clika/request-proxy
 * Proxy requests to Phoenix Clika backend
 * Requires CLIKA_API_KEY to be configured
 */
export const POST: RequestHandler = async ({ request }) => {
  // Check if Clika is configured
  if (!env.CLIKA_API_KEY || !env.CLIKA_API_URL) {
    throw error(503, 'Clika service not configured');
  }
  
  try {
    // Strict rate limiting for proxy requests
    const rateLimitResult = applyRateLimit(request, {
      maxRequests: 10,
      windowMs: 60000,
      burst: 2,
    });
    
    const data = await request.json();
    
    // Validate target URL if provided
    if (data.targetUrl) {
      const urlResult = validateURL(data.targetUrl, ['http:', 'https:']);
      if (!urlResult.success) {
        return json({ error: 'Invalid target URL' }, { status: 400 });
      }
    }
    
    // Forward request to Clika backend
    const response = await fetch(`${env.CLIKA_API_URL}/api/proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': env.CLIKA_API_KEY,
        'X-Forwarded-For': request.headers.get('X-Forwarded-For') || '',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      console.error('Clika proxy error:', response.status);
      throw error(502, 'Clika service error');
    }
    
    const result = await response.json();
    
    return json(result, {
      headers: createRateLimitHeaders(rateLimitResult)
    });
    
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      throw err;
    }
    
    console.error('Proxy request error:', err);
    throw error(500, 'Internal server error');
  }
};
