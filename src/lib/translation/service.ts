/**
 * Translation Service
 * 
 * Core translation logic with DeepL API integration, caching,
 * and quality scoring. Supports Spanish and French translations.
 * 
 * @module lib/translation/service
 * @author Hairven Dev Team
 * @since 2026-02-10
 */

import { browser } from '$app/environment';

// =============================================================================
// TYPES
// =============================================================================

export type SupportedLanguage = 'es' | 'fr';

export interface TranslationOptions {
  sourceLang?: string;
  targetLang: SupportedLanguage;
  preserveFormatting?: boolean;
  context?: string;
}

export interface TranslationResult {
  text: string;
  sourceLang: string;
  targetLang: SupportedLanguage;
  qualityScore: number;
  cached: boolean;
  provider: 'deepl' | 'fallback' | 'cache';
}

export interface TranslationCacheEntry {
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: SupportedLanguage;
  qualityScore: number;
  translatedAt: string;
}

export interface QualityMetrics {
  lengthRatio: number;
  specialCharsPreserved: boolean;
  htmlTagsPreserved: boolean;
  asinsPreserved: boolean;
  confidence: number;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const DEEPL_API_KEY = process.env.DEEPL_API_KEY || '';
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';
const CACHE_KEY_PREFIX = 'hairven_translation_';
const CACHE_DURATION_DAYS = 30;

// Language mapping for DeepL
const DEEPL_LANG_MAP: Record<SupportedLanguage, string> = {
  es: 'ES',
  fr: 'FR'
};

// Fallback translations for common UI elements (used when API fails)
const FALLBACK_DICTIONARY: Record<string, Record<SupportedLanguage, string>> = {
  'Best': { es: 'Mejores', fr: 'Meilleurs' },
  'Hair': { es: 'Cabello', fr: 'Cheveux' },
  'Dryers': { es: 'Secadores', fr: 'Sèche-cheveux' },
  'Products': { es: 'Productos', fr: 'Produits' },
  'Guide': { es: 'Guía', fr: 'Guide' },
  'Tips': { es: 'Consejos', fr: 'Conseils' },
  'Review': { es: 'Reseña', fr: 'Avis' },
  'Treatment': { es: 'Tratamiento', fr: 'Traitement' },
  'Shop': { es: 'Tienda', fr: 'Boutique' },
  'Buy': { es: 'Comprar', fr: 'Acheter' },
  'Price': { es: 'Precio', fr: 'Prix' },
  'Check Price': { es: 'Ver Precio', fr: 'Voir le Prix' },
  'on Amazon': { es: 'en Amazon', fr: 'sur Amazon' },
  'Read More': { es: 'Leer Más', fr: 'Lire Plus' },
  'Learn More': { es: 'Saber Más', fr: 'En Savoir Plus' },
  'Pros': { es: 'Pros', fr: 'Avantages' },
  'Cons': { es: 'Contras', fr: 'Inconvénients' },
  'Verdict': { es: 'Veredicto', fr: 'Verdict' },
  'Best for': { es: 'Mejor para', fr: 'Idéal pour' },
};

// =============================================================================
// CACHE MANAGEMENT
// =============================================================================

/**
 * Generate cache key for translation
 */
function generateCacheKey(text: string, targetLang: SupportedLanguage): string {
  // Simple hash for the text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `${CACHE_KEY_PREFIX}${targetLang}_${Math.abs(hash)}`;
}

/**
 * Get cached translation if available and not expired
 */
function getCachedTranslation(
  text: string, 
  targetLang: SupportedLanguage
): TranslationCacheEntry | null {
  if (!browser) return null;
  
  try {
    const key = generateCacheKey(text, targetLang);
    const cached = localStorage.getItem(key);
    
    if (!cached) return null;
    
    const entry: TranslationCacheEntry = JSON.parse(cached);
    const age = Date.now() - new Date(entry.translatedAt).getTime();
    const maxAge = CACHE_DURATION_DAYS * 24 * 60 * 60 * 1000;
    
    if (age > maxAge) {
      localStorage.removeItem(key);
      return null;
    }
    
    return entry;
  } catch {
    return null;
  }
}

/**
 * Store translation in cache
 */
function cacheTranslation(
  sourceText: string,
  translatedText: string,
  sourceLang: string,
  targetLang: SupportedLanguage,
  qualityScore: number
): void {
  if (!browser) return;
  
  try {
    const key = generateCacheKey(sourceText, targetLang);
    const entry: TranslationCacheEntry = {
      sourceText,
      translatedText,
      sourceLang,
      targetLang,
      qualityScore,
      translatedAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.warn('Failed to cache translation:', error);
  }
}

/**
 * Clear all translation cache
 */
export function clearTranslationCache(): void {
  if (!browser) return;
  
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('Failed to clear translation cache:', error);
  }
}

// =============================================================================
// QUALITY SCORING
// =============================================================================

/**
 * Calculate quality metrics for a translation
 */
export function calculateQualityMetrics(
  sourceText: string,
  translatedText: string
): QualityMetrics {
  // Length ratio (translations should be roughly similar length)
  const lengthRatio = translatedText.length / (sourceText.length || 1);
  const lengthScore = lengthRatio > 0.5 && lengthRatio < 2.0 ? 1 : 0.7;
  
  // Check special characters preservation
  const sourceSpecialChars = (sourceText.match(/[€$£¥%°]/g) || []).length;
  const translatedSpecialChars = (translatedText.match(/[€$£¥%°]/g) || []).length;
  const specialCharsPreserved = sourceSpecialChars === translatedSpecialChars;
  
  // Check HTML tags preservation
  const sourceTags = (sourceText.match(/<[^>]+>/g) || []).length;
  const translatedTags = (translatedText.match(/<[^>]+>/g) || []).length;
  const htmlTagsPreserved = sourceTags === translatedTags;
  
  // Check ASIN preservation (Amazon product IDs)
  const sourceAsins = (sourceText.match(/B[A-Z0-9]{9}/g) || []).length;
  const translatedAsins = (translatedText.match(/B[A-Z0-9]{9}/g) || []).length;
  const asinsPreserved = sourceAsins === translatedAsins;
  
  // Calculate overall confidence
  const confidence = (
    lengthScore * 0.3 +
    (specialCharsPreserved ? 0.2 : 0) +
    (htmlTagsPreserved ? 0.3 : 0) +
    (asinsPreserved ? 0.2 : 0)
  );
  
  return {
    lengthRatio,
    specialCharsPreserved,
    htmlTagsPreserved,
    asinsPreserved,
    confidence
  };
}

/**
 * Calculate overall quality score (0-100)
 */
export function calculateQualityScore(
  sourceText: string,
  translatedText: string
): number {
  const metrics = calculateQualityMetrics(sourceText, translatedText);
  return Math.round(metrics.confidence * 100);
}

// =============================================================================
// TRANSLATION PROVIDERS
// =============================================================================

/**
 * Translate using DeepL API
 */
async function translateWithDeepL(
  text: string,
  targetLang: SupportedLanguage,
  sourceLang?: string
): Promise<{ text: string; detectedSourceLang: string } | null> {
  if (!DEEPL_API_KEY) {
    console.warn('DeepL API key not configured');
    return null;
  }
  
  try {
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: [text],
        target_lang: DEEPL_LANG_MAP[targetLang],
        source_lang: sourceLang?.toUpperCase(),
        preserve_formatting: true,
        tag_handling: 'html'
      })
    });
    
    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.translations && data.translations.length > 0) {
      return {
        text: data.translations[0].text,
        detectedSourceLang: data.translations[0].detected_source_language || sourceLang || 'en'
      };
    }
    
    return null;
  } catch (error) {
    console.error('DeepL translation failed:', error);
    return null;
  }
}

/**
 * Translate using fallback dictionary for simple terms
 */
function translateWithFallback(
  text: string,
  targetLang: SupportedLanguage
): string | null {
  // Check for exact matches in dictionary
  if (FALLBACK_DICTIONARY[text]?.[targetLang]) {
    return FALLBACK_DICTIONARY[text][targetLang];
  }
  
  // Try partial matches for compound terms
  let result = text;
  let hasMatch = false;
  
  for (const [english, translations] of Object.entries(FALLBACK_DICTIONARY)) {
    if (text.includes(english)) {
      result = result.replace(new RegExp(english, 'g'), translations[targetLang]);
      hasMatch = true;
    }
  }
  
  return hasMatch ? result : null;
}

// =============================================================================
// MAIN TRANSLATION SERVICE
// =============================================================================

/**
 * Translate text to target language
 * Uses cache -> DeepL API -> fallback in that order
 */
export async function translate(
  text: string,
  options: TranslationOptions
): Promise<TranslationResult> {
  const { targetLang, sourceLang = 'en', context } = options;
  
  // Don't translate empty strings
  if (!text || !text.trim()) {
    return {
      text,
      sourceLang,
      targetLang,
      qualityScore: 100,
      cached: false,
      provider: 'cache'
    };
  }
  
  // Check cache first
  const cached = getCachedTranslation(text, targetLang);
  if (cached) {
    return {
      text: cached.translatedText,
      sourceLang: cached.sourceLang,
      targetLang: cached.targetLang,
      qualityScore: cached.qualityScore,
      cached: true,
      provider: 'cache'
    };
  }
  
  // Try DeepL API
  const deeplResult = await translateWithDeepL(text, targetLang, sourceLang);
  
  if (deeplResult) {
    const qualityScore = calculateQualityScore(text, deeplResult.text);
    
    // Cache the result
    cacheTranslation(
      text,
      deeplResult.text,
      deeplResult.detectedSourceLang,
      targetLang,
      qualityScore
    );
    
    return {
      text: deeplResult.text,
      sourceLang: deeplResult.detectedSourceLang,
      targetLang,
      qualityScore,
      cached: false,
      provider: 'deepl'
    };
  }
  
  // Fall back to dictionary
  const fallbackResult = translateWithFallback(text, targetLang);
  
  if (fallbackResult) {
    const qualityScore = calculateQualityScore(text, fallbackResult);
    
    return {
      text: fallbackResult,
      sourceLang,
      targetLang,
      qualityScore,
      cached: false,
      provider: 'fallback'
    };
  }
  
  // Return original text if all methods fail
  return {
    text,
    sourceLang,
    targetLang,
    qualityScore: 0,
    cached: false,
    provider: 'fallback'
  };
}

/**
 * Translate multiple texts in batch
 */
export async function translateBatch(
  texts: string[],
  options: TranslationOptions
): Promise<TranslationResult[]> {
  return Promise.all(texts.map(text => translate(text, options)));
}

/**
 * Translate with context awareness for better quality
 */
export async function translateWithContext(
  text: string,
  context: string,
  targetLang: SupportedLanguage
): Promise<TranslationResult> {
  // Add context hint to improve translation quality
  const contextualizedText = `[Context: ${context}] ${text}`;
  return translate(contextualizedText, { targetLang, context });
}

// =============================================================================
// SERVER-SIDE TRANSLATION (for API routes)
// =============================================================================

/**
 * Server-side translation using DeepL API
 * Used in API routes for batch processing
 */
export async function translateServerSide(
  text: string,
  targetLang: SupportedLanguage
): Promise<TranslationResult> {
  const apiKey = process.env.DEEPL_API_KEY;
  
  if (!apiKey) {
    throw new Error('DeepL API key not configured');
  }
  
  try {
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: [text],
        target_lang: DEEPL_LANG_MAP[targetLang],
        preserve_formatting: true,
        tag_handling: 'html'
      })
    });
    
    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.translations && data.translations.length > 0) {
      const translatedText = data.translations[0].text;
      const qualityScore = calculateQualityScore(text, translatedText);
      
      return {
        text: translatedText,
        sourceLang: data.translations[0].detected_source_language || 'en',
        targetLang,
        qualityScore,
        cached: false,
        provider: 'deepl'
      };
    }
    
    throw new Error('No translation returned from DeepL');
  } catch (error) {
    console.error('Server-side translation failed:', error);
    throw error;
  }
}

/**
 * Batch translate on server side with rate limiting
 */
export async function translateBatchServerSide(
  texts: Array<{ id: string; text: string }>,
  targetLang: SupportedLanguage,
  onProgress?: (completed: number, total: number) => void
): Promise<Map<string, TranslationResult>> {
  const results = new Map<string, TranslationResult>();
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  // DeepL free tier: ~30 requests per minute
  const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests
  
  for (let i = 0; i < texts.length; i++) {
    const { id, text } = texts[i];
    
    try {
      const result = await translateServerSide(text, targetLang);
      results.set(id, result);
    } catch (error) {
      console.error(`Failed to translate text ${id}:`, error);
      results.set(id, {
        text,
        sourceLang: 'en',
        targetLang,
        qualityScore: 0,
        cached: false,
        provider: 'fallback'
      });
    }
    
    if (onProgress) {
      onProgress(i + 1, texts.length);
    }
    
    // Rate limiting
    if (i < texts.length - 1) {
      await delay(RATE_LIMIT_DELAY);
    }
  }
  
  return results;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if DeepL API is configured and available
 */
export function isTranslationAvailable(): boolean {
  return !!DEEPL_API_KEY;
}

/**
 * Get translation statistics from cache
 */
export function getTranslationStats(): { 
  cachedEntries: number; 
  cacheSizeBytes: number;
} {
  if (!browser) {
    return { cachedEntries: 0, cacheSizeBytes: 0 };
  }
  
  let count = 0;
  let size = 0;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_KEY_PREFIX)) {
      count++;
      size += localStorage.getItem(key)?.length || 0;
    }
  }
  
  return {
    cachedEntries: count,
    cacheSizeBytes: size * 2 // Approximate bytes (UTF-16)
  };
}

/**
 * Estimate translation cost (DeepL pricing)
 */
export function estimateTranslationCost(charCount: number): number {
  // DeepL Free: 500,000 characters/month
  // DeepL Pro: $6.99/month + $0.00002 per character
  const DEEPL_PRO_RATE = 0.00002;
  return charCount * DEEPL_PRO_RATE;
}

// =============================================================================
// LOGGING
// =============================================================================

/**
 * Log translation events for debugging and monitoring
 */
export function logTranslationEvent(level: 'info' | 'warn' | 'error', message: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, level, message, data };
  
  if (level === 'error') {
    console.error(`[Translation] ${message}`, data || '');
  } else if (level === 'warn') {
    console.warn(`[Translation] ${message}`, data || '');
  } else {
    console.log(`[Translation] ${message}`, data || '');
  }
  
  // In production, send to logging service
  if (typeof window !== 'undefined' && level === 'error') {
    // Could send to error tracking service
  }
}
