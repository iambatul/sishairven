/**
 * i18n Initialization Module
 * 
 * Sets up svelte-i18n with lazy-loaded translations,
 * language detection, and formatting utilities.
 * 
 * @module lib/i18n
 * @author Hairven Dev Team
 * @since 2026-02-10
 */

import { browser } from '$app/environment';
import { init, register, locale, waitLocale, getLocaleFromNavigator, _ } from 'svelte-i18n';
import { get, derived, writable } from 'svelte/store';
import { supportedLanguages, isLanguageEnabled, getLanguageConfig } from '$lib/types/geo';
import { siteConfig } from '$lib/utils/seo';

// =============================================================================
// TRANSLATION REGISTRATION
// =============================================================================

/**
 * Register translation loaders for all supported languages
 * Uses dynamic imports for lazy loading
 */
function registerTranslations() {
  // English (base language)
  register('en', () => import('./locales/en/common.json'));
  register('en', () => import('./locales/en/blog.json'));
  register('en', () => import('./locales/en/shop.json'));
  
  // Spanish
  register('es', () => import('./locales/es/common.json'));
  register('es', () => import('./locales/es/blog.json'));
  register('es', () => import('./locales/es/shop.json'));
  
  // French
  register('fr', () => import('./locales/fr/common.json'));
  register('fr', () => import('./locales/fr/blog.json'));
  register('fr', () => import('./locales/fr/shop.json'));
  
  // German
  register('de', () => import('./locales/de/common.json'));
  register('de', () => import('./locales/de/blog.json'));
  register('de', () => import('./locales/de/shop.json'));
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize i18n with default settings
 * Called in the app layout on startup
 */
export async function initializeI18n(initialLocale?: string) {
  registerTranslations();
  
  const defaultLocale = 'en';
  
  // Detect initial locale
  let detectedLocale = initialLocale;
  
  if (!detectedLocale && browser) {
    // Try to get from URL
    const pathLang = window.location.pathname.split('/')[1];
    if (isLanguageEnabled(pathLang)) {
      detectedLocale = pathLang;
    } else {
      // Try browser language
      const navLang = getLocaleFromNavigator()?.split('-')[0];
      if (navLang && isLanguageEnabled(navLang)) {
        detectedLocale = navLang;
      }
    }
  }
  
  // Fall back to default
  if (!detectedLocale || !isLanguageEnabled(detectedLocale)) {
    detectedLocale = defaultLocale;
  }
  
  // Initialize svelte-i18n
  init({
    fallbackLocale: defaultLocale,
    initialLocale: detectedLocale,
  });
  
  // Wait for locale to load
  await waitLocale();
  
  return detectedLocale;
}

// =============================================================================
// STORES
// =============================================================================

/**
 * Current locale store with additional metadata
 */
export const currentLocale = derived(
  locale,
  $locale => {
    const langCode = $locale?.split('-')[0] || 'en';
    return {
      code: langCode,
      config: getLanguageConfig(langCode),
    };
  }
);

/**
 * RTL (right-to-left) detection store
 */
export const isRTL = derived(
  currentLocale,
  $locale => $locale.config?.dir === 'rtl'
);

/**
 * Loading state for translations
 */
export const isLoadingTranslations = writable(false);

// =============================================================================
// LANGUAGE SWITCHING
// =============================================================================

/**
 * Switch to a new language
 * Updates the locale and stores preference
 */
export async function switchLanguage(langCode: string): Promise<boolean> {
  if (!isLanguageEnabled(langCode)) {
    console.warn(`Language ${langCode} is not enabled`);
    return false;
  }
  
  isLoadingTranslations.set(true);
  
  try {
    // Set the new locale
    locale.set(langCode);
    
    // Wait for translations to load
    await waitLocale();
    
    // Store preference in localStorage (client-side only)
    if (browser) {
      localStorage.setItem('preferredLanguage', langCode);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to switch language:', error);
    return false;
  } finally {
    isLoadingTranslations.set(false);
  }
}

/**
 * Get stored language preference
 */
export function getStoredLanguage(): string | null {
  if (!browser) return null;
  return localStorage.getItem('preferredLanguage');
}

// =============================================================================
// FORMATTING HELPERS
// =============================================================================

/**
 * Format date using current locale
 */
export function formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const lang = get(locale)?.split('-')[0] || 'en';
  
  return d.toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  const lang = get(locale)?.split('-')[0] || 'en';
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
  
  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
  if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  if (diffInSeconds < 31536000) return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  
  return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
}

/**
 * Format number using current locale
 */
export function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
  const lang = get(locale)?.split('-')[0] || 'en';
  return new Intl.NumberFormat(lang, options).format(num);
}

/**
 * Format currency using current locale
 */
export function formatCurrency(amount: number, currency: string): string {
  const lang = get(locale)?.split('-')[0] || 'en';
  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency,
  }).format(amount);
}

// =============================================================================
// SEO HELPERS
// =============================================================================

/**
 * Generate hreflang links for SEO
 */
export function generateHreflangLinks(path: string): Array<{ lang: string; url: string }> {
  const enabledLangs = supportedLanguages.filter(l => l.enabled);
  
  return enabledLangs.map(lang => ({
    lang: lang.code,
    url: lang.code === 'en' 
      ? `${siteConfig.url}${path}`
      : `${siteConfig.url}/${lang.code}${path}`,
  }));
}

/**
 * Get alternate language URLs for a page
 */
export function getAlternateLanguages(currentPath: string): Array<{ code: string; name: string; url: string }> {
  const enabledLangs = supportedLanguages.filter(l => l.enabled);
  
  return enabledLangs.map(lang => {
    // Remove current language prefix if present
    const cleanPath = currentPath.replace(/^\/(es|fr|de)/, '');
    
    return {
      code: lang.code,
      name: lang.name,
      url: lang.code === 'en' ? cleanPath : `/${lang.code}${cleanPath}`,
    };
  });
}

// =============================================================================
// TRANSLATION KEYS
// =============================================================================

/**
 * Common translation keys used throughout the app
 * These should match keys in the locale JSON files
 */
export const translationKeys = {
  // Navigation
  nav: {
    home: 'nav.home',
    services: 'nav.services',
    shop: 'nav.shop',
    blog: 'nav.blog',
    about: 'nav.about',
    contact: 'nav.contact',
  },
  
  // Common actions
  actions: {
    book: 'actions.book',
    buy: 'actions.buy',
    readMore: 'actions.read_more',
    learnMore: 'actions.learn_more',
    subscribe: 'actions.subscribe',
    share: 'actions.share',
  },
  
  // SEO
  seo: {
    defaultTitle: 'seo.default_title',
    defaultDescription: 'seo.default_description',
  },
  
  // Footer
  footer: {
    copyright: 'footer.copyright',
    rights: 'footer.rights',
  },
} as const;



// Re-export for convenience
export { locale, _ };