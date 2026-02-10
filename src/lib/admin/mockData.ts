/**
 * Admin Dashboard Mock Data
 * 
 * Generates realistic mock data for the admin dashboard.
 * In production, this would be replaced with real database queries.
 * 
 * @module lib/admin/mockData
 * @author Hairven Dev Team
 * @since 2026-02-10
 */

import type { 
  GeoAnalytics, 
  RevenueAnalytics, 
  ClikaAnalytics,
  TranslationStatus,
  TranslationJob,
  DashboardStats,
  TimeRange,
  StoredClick,
  StoredVisitor
} from './types';

// =============================================================================
// MOCK DATA GENERATORS
// =============================================================================

const countries = [
  { code: 'US', name: 'United States', weight: 0.35 },
  { code: 'GB', name: 'United Kingdom', weight: 0.15 },
  { code: 'CA', name: 'Canada', weight: 0.10 },
  { code: 'AU', name: 'Australia', weight: 0.08 },
  { code: 'DE', name: 'Germany', weight: 0.08 },
  { code: 'FR', name: 'France', weight: 0.06 },
  { code: 'ES', name: 'Spain', weight: 0.05 },
  { code: 'IT', name: 'Italy', weight: 0.04 },
  { code: 'NL', name: 'Netherlands', weight: 0.03 },
  { code: 'JP', name: 'Japan', weight: 0.02 },
  { code: 'BR', name: 'Brazil', weight: 0.02 },
  { code: 'IN', name: 'India', weight: 0.02 },
];

const languages = [
  { code: 'en', name: 'English', weight: 0.55 },
  { code: 'es', name: 'Spanish', weight: 0.20 },
  { code: 'fr', name: 'French', weight: 0.15 },
  { code: 'de', name: 'German', weight: 0.06 },
  { code: 'pt', name: 'Portuguese', weight: 0.02 },
  { code: 'it', name: 'Italian', weight: 0.02 },
];

const products = [
  { asin: 'B01FIG3JA4', name: 'Dyson Supersonic Hair Dryer', category: 'Hair Dryers' },
  { asin: 'B07C8F12Z9', name: 'ghd Platinum+ Styler', category: 'Styling Tools' },
  { asin: 'B07FX47NSL', name: 'Revlon One-Step Volumizer', category: 'Hot Air Brushes' },
  { asin: 'B00BEUWX9Y', name: 'Moroccanoil Treatment', category: 'Hair Treatments' },
  { asin: 'B00SNM5SJO', name: 'Olaplex No. 3', category: 'Bond Repair' },
  { asin: 'B07ZJV6S7G', name: 'Kérastase Elixir Ultime', category: 'Hair Oils' },
  { asin: 'B08P4GRYY8', name: 'Briogeo Don\'t Despair Repair', category: 'Hair Masks' },
  { asin: 'B003V265U8', name: 'L\'ange Le Volume', category: 'Hot Air Brushes' },
];

const isps = [
  'Comcast', 'Verizon', 'AT&T', 'Spectrum', 'Cox', 
  'BT', 'Sky', 'Virgin Media', 'Vodafone',
  'Deutsche Telekom', 'Orange', 'Telefónica'
];

// =============================================================================
// GENERATE GEO ANALYTICS
// =============================================================================

export function generateGeoAnalytics(range: TimeRange): GeoAnalytics {
  const days = range === '24h' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
  const baseVisitors = range === '24h' ? 500 : range === '7d' ? 3500 : range === '30d' ? 15000 : range === '90d' ? 45000 : 200000;
  
  // Generate country stats
  const countryStats = countries.map(c => {
    const visitors = Math.floor(baseVisitors * c.weight * (0.8 + Math.random() * 0.4));
    return {
      country: c.code,
      countryName: c.name,
      visitors,
      percentage: 0,
      change: Math.floor(Math.random() * 40) - 15
    };
  }).sort((a, b) => b.visitors - a.visitors);
  
  // Calculate percentages
  const totalVisitors = countryStats.reduce((sum, c) => sum + c.visitors, 0);
  countryStats.forEach(c => c.percentage = Math.round((c.visitors / totalVisitors) * 100));
  
  // Generate language stats
  const languageStats = languages.map(l => {
    const visitors = Math.floor(baseVisitors * l.weight * (0.9 + Math.random() * 0.2));
    return {
      language: l.code,
      languageName: l.name,
      visitors,
      percentage: Math.round((visitors / totalVisitors) * 100)
    };
  }).sort((a, b) => b.visitors - a.visitors);
  
  // Generate traffic data
  const traffic = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayVisitors = Math.floor(baseVisitors / days * (0.7 + Math.random() * 0.6));
    traffic.push({
      date: date.toISOString().split('T')[0],
      visitors: dayVisitors,
      pageViews: Math.floor(dayVisitors * (1.5 + Math.random() * 1.5)),
      uniqueVisitors: Math.floor(dayVisitors * (0.7 + Math.random() * 0.2))
    });
  }
  
  return {
    countries: countryStats,
    languages: languageStats,
    traffic,
    totalVisitors,
    totalPageViews: Math.floor(totalVisitors * 2.3),
    avgSessionDuration: 180 + Math.floor(Math.random() * 120),
    bounceRate: 35 + Math.floor(Math.random() * 20)
  };
}

// =============================================================================
// GENERATE REVENUE DATA
// =============================================================================

export function generateRevenueData(range: TimeRange): RevenueAnalytics {
  const days = range === '24h' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
  const baseRevenue = range === '24h' ? 150 : range === '7d' ? 1000 : range === '30d' ? 4500 : range === '90d' ? 15000 : 75000;
  
  const currencies: Record<string, string> = {
    'US': 'USD', 'CA': 'CAD', 'GB': 'GBP', 'DE': 'EUR', 'FR': 'EUR',
    'ES': 'EUR', 'IT': 'EUR', 'AU': 'AUD', 'JP': 'JPY', 'BR': 'BRL', 'IN': 'INR'
  };
  
  // Generate region revenue
  const regionRevenue = countries.slice(0, 10).map(c => {
    const revenue = baseRevenue * c.weight * (0.7 + Math.random() * 0.6);
    const clicks = Math.floor(revenue * 10 / 6); // ~6% commission, ~$10 avg order
    const conversions = Math.floor(clicks * 0.08);
    
    return {
      country: c.code,
      countryName: c.name,
      currency: currencies[c.code] || 'USD',
      revenue: Math.round(revenue * 100) / 100,
      clicks,
      conversions,
      ctr: Math.round((Math.random() * 3 + 1) * 100) / 100,
      commission: Math.round(revenue * 0.06 * 100) / 100,
      percentage: 0
    };
  }).sort((a, b) => b.revenue - a.revenue);
  
  // Calculate percentages
  const totalRevenue = regionRevenue.reduce((sum, r) => sum + r.revenue, 0);
  regionRevenue.forEach(r => r.percentage = Math.round((r.revenue / totalRevenue) * 100));
  
  // Generate top products
  const topProducts = products.map(p => {
    const clicks = Math.floor(50 + Math.random() * 200);
    const revenue = clicks * (15 + Math.random() * 50);
    return {
      asin: p.asin,
      name: p.name,
      category: p.category,
      clicks,
      revenue: Math.round(revenue * 100) / 100,
      commission: Math.round(revenue * 0.06 * 100) / 100,
      topCountries: countries.slice(0, 3).map(c => c.code)
    };
  }).sort((a, b) => b.revenue - a.revenue);
  
  // Generate daily revenue
  const dailyRevenue = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayRevenue = baseRevenue / days * (0.6 + Math.random() * 0.8);
    const dayClicks = Math.floor(dayRevenue * 10 / 6);
    dailyRevenue.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(dayRevenue * 100) / 100,
      clicks: dayClicks,
      conversions: Math.floor(dayClicks * 0.08)
    });
  }
  
  const totalClicks = regionRevenue.reduce((sum, r) => sum + r.clicks, 0);
  const totalConversions = regionRevenue.reduce((sum, r) => sum + r.conversions, 0);
  
  return {
    regions: regionRevenue,
    topProducts,
    dailyRevenue,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalClicks,
    totalConversions,
    avgCommission: Math.round(totalRevenue * 0.06 * 100) / 100,
    conversionRate: Math.round((totalConversions / totalClicks) * 1000) / 10
  };
}

// =============================================================================
// GENERATE CLIKA ANALYTICS
// =============================================================================

export function generateClikaAnalytics(range: TimeRange): ClikaAnalytics {
  const baseClicks = range === '24h' ? 50 : range === '7d' ? 350 : range === '30d' ? 1500 : 5000;
  
  // Generate proxy usage
  const proxyUsage = countries.slice(0, 8).map(c => {
    const proxyCount = Math.floor(3 + Math.random() * 8);
    const clickCount = Math.floor(baseClicks * c.weight * (0.8 + Math.random() * 0.4));
    return {
      country: c.code,
      countryName: c.name,
      proxyCount,
      clickCount,
      ispDiversity: Math.floor(2 + Math.random() * 4),
      healthScore: Math.round((0.75 + Math.random() * 0.2) * 100) / 100
    };
  }).sort((a, b) => b.clickCount - a.clickCount);
  
  // Generate click distribution
  const clickDistribution = countries.slice(0, 6).map(c => {
    const target = Math.floor(baseClicks * c.weight);
    const actual = Math.floor(target * (0.85 + Math.random() * 0.3));
    return {
      country: c.code,
      target,
      actual,
      variance: Math.round(((actual - target) / target) * 100)
    };
  });
  
  // Generate business hours alignment
  const businessHours = countries.slice(0, 6).map(c => {
    const businessHoursClicks = Math.floor(baseClicks * c.weight * 0.7);
    const afterHoursClicks = Math.floor(baseClicks * c.weight * 0.3);
    const alignmentScore = Math.round((businessHoursClicks / (businessHoursClicks + afterHoursClicks)) * 100);
    return {
      country: c.code,
      businessHoursClicks,
      afterHoursClicks,
      alignmentScore
    };
  });
  
  // Generate ISP diversity
  const ispDiversity = isps.slice(0, 6).map(isp => {
    const clickCount = Math.floor(baseClicks / isps.length * (0.7 + Math.random() * 0.6));
    return {
      isp,
      clickCount,
      percentage: 0
    };
  });
  const totalIspClicks = ispDiversity.reduce((sum, i) => sum + i.clickCount, 0);
  ispDiversity.forEach(i => i.percentage = Math.round((i.clickCount / totalIspClicks) * 100));
  
  const totalProxies = proxyUsage.reduce((sum, p) => sum + p.proxyCount, 0);
  const totalEvasionClicks = proxyUsage.reduce((sum, p) => sum + p.clickCount, 0);
  const avgHealthScore = Math.round((proxyUsage.reduce((sum, p) => sum + p.healthScore, 0) / proxyUsage.length) * 100) / 100;
  
  return {
    proxyUsage,
    clickDistribution,
    businessHours,
    ispDiversity,
    totalProxies,
    totalEvasionClicks,
    avgHealthScore
  };
}

// =============================================================================
// GENERATE TRANSLATION DATA
// =============================================================================

export function generateTranslationData(): { posts: TranslationStatus[], jobs: TranslationJob[] } {
  const blogPosts = [
    { slug: 'best-hair-dryers-2025', title: 'Best Hair Dryers 2025' },
    { slug: 'dyson-vs-ghd-vs-revlon', title: 'Dyson vs ghd vs Revlon' },
    { slug: 'keratin-treatment-guide', title: 'Keratin Treatment Guide' },
    { slug: 'balayage-vs-highlights', title: 'Balayage vs Highlights' },
    { slug: 'summer-hair-care-tips', title: 'Summer Hair Care Tips' },
    { slug: 'best-products-damaged-hair', title: 'Best Products for Damaged Hair' },
    { slug: 'how-to-make-blowout-last', title: 'How to Make Your Blowout Last' },
    { slug: 'curly-hair-routine', title: 'Complete Curly Hair Routine' },
  ];
  
  const targetLangs = ['es', 'fr', 'de', 'pt', 'it'];
  
  const posts: TranslationStatus[] = blogPosts.map(post => ({
    slug: post.slug,
    title: post.title,
    sourceLanguage: 'en',
    translations: targetLangs.map(lang => {
      const rand = Math.random();
      let status: 'completed' | 'in_progress' | 'pending' | 'failed' = 'pending';
      if (rand > 0.8) status = 'completed';
      else if (rand > 0.6) status = 'in_progress';
      else if (rand > 0.95) status = 'failed';
      
      return {
        language: lang,
        status,
        progress: status === 'completed' ? 100 : status === 'in_progress' ? Math.floor(Math.random() * 80) : 0,
        lastUpdated: status !== 'pending' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        wordCount: Math.floor(800 + Math.random() * 1500)
      };
    })
  }));
  
  const jobs: TranslationJob[] = [
    {
      id: 'job_001',
      slug: 'best-hair-dryers-2025',
      targetLanguage: 'es',
      status: 'processing',
      progress: 65,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      startedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'job_002',
      slug: 'keratin-treatment-guide',
      targetLanguage: 'fr',
      status: 'queued',
      progress: 0,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'job_003',
      slug: 'balayage-vs-highlights',
      targetLanguage: 'de',
      status: 'completed',
      progress: 100,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      startedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  return { posts, jobs };
}

// =============================================================================
// GENERATE DASHBOARD STATS
// =============================================================================

export function generateDashboardStats(): DashboardStats {
  return {
    todayVisitors: Math.floor(400 + Math.random() * 300),
    todayClicks: Math.floor(30 + Math.random() * 40),
    todayRevenue: Math.round((120 + Math.random() * 80) * 100) / 100,
    activeProxies: Math.floor(15 + Math.random() * 10),
    visitorChange: Math.floor(Math.random() * 30) - 10,
    clickChange: Math.floor(Math.random() * 40) - 15,
    revenueChange: Math.floor(Math.random() * 35) - 10,
    proxyChange: Math.floor(Math.random() * 20) - 5
  };
}

// =============================================================================
// IN-MEMORY STORAGE
// =============================================================================

class AdminDataStore {
  private clicks: StoredClick[] = [];
  private visitors: StoredVisitor[] = [];
  
  addClick(click: StoredClick): void {
    this.clicks.push(click);
    // Keep only last 30 days
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    this.clicks = this.clicks.filter(c => c.timestamp > cutoff);
  }
  
  addVisitor(country: string): void {
    this.visitors.push({ country, timestamp: Date.now() });
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    this.visitors = this.visitors.filter(v => v.timestamp > cutoff);
  }
  
  getClicks(timeRange: TimeRange): StoredClick[] {
    const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : timeRange === '30d' ? 720 : 8760;
    const cutoff = Date.now() - hours * 60 * 60 * 1000;
    return this.clicks.filter(c => c.timestamp > cutoff);
  }
  
  getVisitors(timeRange: TimeRange): StoredVisitor[] {
    const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : timeRange === '30d' ? 720 : 8760;
    const cutoff = Date.now() - hours * 60 * 60 * 1000;
    return this.visitors.filter(v => v.timestamp > cutoff);
  }
  
  getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayClicks = this.clicks.filter(c => c.timestamp > today.getTime()).length;
    const todayVisitors = this.visitors.filter(v => v.timestamp > today.getTime()).length;
    const todayRevenue = this.clicks
      .filter(c => c.timestamp > today.getTime())
      .reduce((sum, c) => sum + (c.estimatedCommission || 0), 0);
    
    return {
      todayClicks,
      todayVisitors,
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      totalClicks: this.clicks.length,
      totalVisitors: this.visitors.length
    };
  }
}

export const adminDataStore = new AdminDataStore();
