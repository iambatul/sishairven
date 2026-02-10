/**
 * Admin Dashboard Types
 * 
 * Type definitions for the admin dashboard analytics and data structures.
 * 
 * @module lib/admin/types
 * @author Hairven Dev Team
 * @since 2026-02-10
 */

// =============================================================================
// GEO ANALYTICS TYPES
// =============================================================================

export interface CountryStats {
  country: string;
  countryName: string;
  visitors: number;
  percentage: number;
  change: number; // Percentage change from previous period
}

export interface LanguageStats {
  language: string;
  languageName: string;
  visitors: number;
  percentage: number;
}

export interface TrafficDataPoint {
  date: string;
  visitors: number;
  pageViews: number;
  uniqueVisitors: number;
}

export interface GeoAnalytics {
  countries: CountryStats[];
  languages: LanguageStats[];
  traffic: TrafficDataPoint[];
  totalVisitors: number;
  totalPageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
}

// =============================================================================
// REVENUE TYPES
// =============================================================================

export interface RegionRevenue {
  country: string;
  countryName: string;
  currency: string;
  revenue: number;
  clicks: number;
  conversions: number;
  ctr: number; // Click-through rate
  commission: number; // Estimated commission
  percentage: number;
}

export interface TopProduct {
  asin: string;
  name: string;
  category: string;
  clicks: number;
  revenue: number;
  commission: number;
  topCountries: string[];
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  clicks: number;
  conversions: number;
}

export interface RevenueAnalytics {
  regions: RegionRevenue[];
  topProducts: TopProduct[];
  dailyRevenue: DailyRevenue[];
  totalRevenue: number;
  totalClicks: number;
  totalConversions: number;
  avgCommission: number;
  conversionRate: number;
}

// =============================================================================
// CLIKA EVASION TYPES
// =============================================================================

export interface ProxyUsage {
  country: string;
  countryName: string;
  proxyCount: number;
  clickCount: number;
  ispDiversity: number; // Number of unique ISPs
  healthScore: number;
}

export interface ClickDistributionData {
  country: string;
  target: number;
  actual: number;
  variance: number;
}

export interface BusinessHoursAlignment {
  country: string;
  businessHoursClicks: number;
  afterHoursClicks: number;
  alignmentScore: number; // 0-100%
}

export interface ISPDiversity {
  isp: string;
  clickCount: number;
  percentage: number;
}

export interface ClikaAnalytics {
  proxyUsage: ProxyUsage[];
  clickDistribution: ClickDistributionData[];
  businessHours: BusinessHoursAlignment[];
  ispDiversity: ISPDiversity[];
  totalProxies: number;
  totalEvasionClicks: number;
  avgHealthScore: number;
}

// =============================================================================
// TRANSLATION TYPES
// =============================================================================

export interface TranslationStatus {
  slug: string;
  title: string;
  sourceLanguage: string;
  translations: {
    language: string;
    status: 'completed' | 'in_progress' | 'pending' | 'failed';
    progress: number;
    lastUpdated?: string;
    wordCount?: number;
  }[];
}

export interface TranslationJob {
  id: string;
  slug: string;
  targetLanguage: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

// =============================================================================
// REAL-TIME TYPES
// =============================================================================

export interface LiveActivity {
  id: string;
  type: 'click' | 'pageview' | 'conversion' | 'proxy_request';
  country: string;
  timestamp: number;
  details: string;
  value?: number;
}

export interface DashboardStats {
  todayVisitors: number;
  todayClicks: number;
  todayRevenue: number;
  activeProxies: number;
  visitorChange: number;
  clickChange: number;
  revenueChange: number;
  proxyChange: number;
}

// =============================================================================
// USER & AUTH TYPES
// =============================================================================

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'editor' | 'viewer';
  lastLogin: string;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y' | 'all';

// =============================================================================
// STORAGE TYPES
// =============================================================================

export interface StoredClick {
  id: string;
  asin: string;
  productName: string;
  category: string;
  country: string;
  timestamp: number;
  estimatedCommission: number;
  proxyId?: string;
  isBusinessHours?: boolean;
}

export interface StoredVisitor {
  country: string;
  timestamp: number;
}
