/**
 * Geo-Localization Types
 * 
 * This module defines TypeScript types for geographic location data,
 * language mappings, and regional configurations.
 * 
 * @module lib/types/geo
 * @author Hairven Dev Team
 * @since 2026-02-10
 */

/**
 * Geographic location data structure
 * Populated from Cloudflare headers or MaxMind GeoIP2
 */
export interface GeoData {
  /** ISO 3166-1 alpha-2 country code (e.g., 'US', 'ES', 'FR') */
  country: string;
  
  /** Full country name (e.g., 'United States', 'Spain') */
  countryName: string;
  
  /** ISO 3166-2 region code (e.g., 'CA' for California) */
  region: string | null;
  
  /** City name (e.g., 'Los Angeles', 'Madrid') */
  city: string | null;
  
  /** IANA timezone identifier (e.g., 'America/Los_Angeles') */
  timezone: string;
  
  /** ISO 4217 currency code (e.g., 'USD', 'EUR') */
  currency: string;
  
  /** BCP 47 language tag (e.g., 'en-US', 'es-ES') */
  language: string;
  
  /** Latitude coordinate */
  lat: number | null;
  
  /** Longitude coordinate */
  lon: number | null;
  
  /** Continent code (e.g., 'NA', 'EU', 'SA') */
  continent: string;
  
  /** Whether this is in the European Union */
  isEU: boolean;
}

/**
 * Regional configuration for a specific country
 * Maps countries to their language, currency, and affiliate tags
 */
export interface RegionalConfig {
  /** Default language code for this region */
  lang: string;
  
  /** ISO 4217 currency code */
  currency: string;
  
  /** Amazon Associates tag for this region */
  amazonTag: string;
  
  /** Amazon domain for this region */
  amazonDomain: string;
  
  /** AdSense ad unit ID for this region */
  adSenseUnit?: string;
  
  /** Whether this region is supported for affiliates */
  affiliateSupported: boolean;
  
  /** Display name for this region */
  displayName: string;
}

/**
 * Language configuration
 */
export interface LanguageConfig {
  /** ISO 639-1 language code */
  code: string;
  
  /** Display name in native language */
  name: string;
  
  /** Display name in English */
  nameEn: string;
  
  /** Flag emoji or icon */
  flag: string;
  
  /** Text direction ('ltr' or 'rtl') */
  dir: 'ltr' | 'rtl';
  
  /** Whether this language is enabled */
  enabled: boolean;
}

/**
 * Supported languages configuration
 */
export const supportedLanguages: LanguageConfig[] = [
  { code: 'en', name: 'English', nameEn: 'English', flag: '🇬🇧', dir: 'ltr', enabled: true },
  { code: 'es', name: 'Español', nameEn: 'Spanish', flag: '🇪🇸', dir: 'ltr', enabled: true },
  { code: 'fr', name: 'Français', nameEn: 'French', flag: '🇫🇷', dir: 'ltr', enabled: true },
  { code: 'de', name: 'Deutsch', nameEn: 'German', flag: '🇩🇪', dir: 'ltr', enabled: true },
  { code: 'pt', name: 'Português', nameEn: 'Portuguese', flag: '🇧🇷', dir: 'ltr', enabled: false },
  { code: 'it', name: 'Italiano', nameEn: 'Italian', flag: '🇮🇹', dir: 'ltr', enabled: false },
];

/**
 * Regional configuration mapping
 * Maps ISO country codes to their regional settings
 */
export const regionalConfig: Record<string, RegionalConfig> = {
  // North America
  'US': {
    lang: 'en',
    currency: 'USD',
    amazonTag: 'hairvenusa-20',
    amazonDomain: 'amazon.com',
    affiliateSupported: true,
    displayName: 'United States',
  },
  'CA': {
    lang: 'en',
    currency: 'CAD',
    amazonTag: 'hairvenca-20',
    amazonDomain: 'amazon.ca',
    affiliateSupported: true,
    displayName: 'Canada',
  },
  'MX': {
    lang: 'es',
    currency: 'MXN',
    amazonTag: 'hairvenmx-20',
    amazonDomain: 'amazon.com.mx',
    affiliateSupported: true,
    displayName: 'Mexico',
  },
  
  // Europe
  'GB': {
    lang: 'en',
    currency: 'GBP',
    amazonTag: 'hairvenuk-21',
    amazonDomain: 'amazon.co.uk',
    affiliateSupported: true,
    displayName: 'United Kingdom',
  },
  'DE': {
    lang: 'de',
    currency: 'EUR',
    amazonTag: 'hairvende-21',
    amazonDomain: 'amazon.de',
    affiliateSupported: true,
    displayName: 'Germany',
  },
  'FR': {
    lang: 'fr',
    currency: 'EUR',
    amazonTag: 'hairvenfr-21',
    amazonDomain: 'amazon.fr',
    affiliateSupported: true,
    displayName: 'France',
  },
  'ES': {
    lang: 'es',
    currency: 'EUR',
    amazonTag: 'hairvenes-21',
    amazonDomain: 'amazon.es',
    affiliateSupported: true,
    displayName: 'Spain',
  },
  'IT': {
    lang: 'it',
    currency: 'EUR',
    amazonTag: 'hairvenit-21',
    amazonDomain: 'amazon.it',
    affiliateSupported: true,
    displayName: 'Italy',
  },
  
  // Asia-Pacific
  'AU': {
    lang: 'en',
    currency: 'AUD',
    amazonTag: 'hairvenau-22',
    amazonDomain: 'amazon.com.au',
    affiliateSupported: true,
    displayName: 'Australia',
  },
  'JP': {
    lang: 'ja',
    currency: 'JPY',
    amazonTag: 'hairvenjp-22',
    amazonDomain: 'amazon.co.jp',
    affiliateSupported: true,
    displayName: 'Japan',
  },
  'IN': {
    lang: 'en',
    currency: 'INR',
    amazonTag: 'hairvenin-21',
    amazonDomain: 'amazon.in',
    affiliateSupported: true,
    displayName: 'India',
  },
  
  // South America
  'BR': {
    lang: 'pt',
    currency: 'BRL',
    amazonTag: 'hairvenbr-20',
    amazonDomain: 'amazon.com.br',
    affiliateSupported: true,
    displayName: 'Brazil',
  },
};

/**
 * Get regional configuration for a country
 * Falls back to US configuration if not found
 */
export function getRegionalConfig(countryCode: string): RegionalConfig {
  return regionalConfig[countryCode] || regionalConfig['US'];
}

/**
 * Get language configuration by code
 */
export function getLanguageConfig(langCode: string): LanguageConfig | undefined {
  return supportedLanguages.find(lang => lang.code === langCode);
}

/**
 * Get default language for a country
 */
export function getDefaultLanguage(countryCode: string): string {
  return getRegionalConfig(countryCode).lang;
}

/**
 * Check if a language is enabled
 */
export function isLanguageEnabled(langCode: string): boolean {
  const lang = getLanguageConfig(langCode);
  return lang?.enabled ?? false;
}

/**
 * Get list of enabled languages
 */
export function getEnabledLanguages(): LanguageConfig[] {
  return supportedLanguages.filter(lang => lang.enabled);
}

/**
 * Detect language from Accept-Language header
 * Returns the best matching enabled language
 */
export function detectLanguageFromHeader(acceptLang: string | null): string {
  if (!acceptLang) return 'en';
  
  // Parse Accept-Language header (e.g., "es-ES,es;q=0.9,en;q=0.8")
  const preferences = acceptLang.split(',').map(part => {
    const [lang, q = 'q=1'] = part.split(';');
    return {
      lang: lang.trim().split('-')[0], // Get base language (e.g., 'es' from 'es-ES')
      q: parseFloat(q.replace('q=', '')) || 1,
    };
  }).sort((a, b) => b.q - a.q);
  
  // Find first enabled language match
  for (const pref of preferences) {
    if (isLanguageEnabled(pref.lang)) {
      return pref.lang;
    }
  }
  
  return 'en';
}

/**
 * Get currency symbol for display
 */
export function getCurrencySymbol(currencyCode: string): string {
  const symbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'CAD': 'C$',
    'AUD': 'A$',
    'JPY': '¥',
    'MXN': 'MX$',
    'BRL': 'R$',
    'INR': '₹',
  };
  return symbols[currencyCode] || currencyCode;
}
