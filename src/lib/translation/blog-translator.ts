/**
 * Blog Translation Module
 * 
 * Handles extraction and translation of blog post content.
 * 
 * @module lib/translation/blog-translator
 * @author Hairven Dev Team
 * @since 2026-02-10
 */

import { logTranslationEvent } from './service';

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt';

export interface TranslationResult {
  language: SupportedLanguage;
  content: string;
  success: boolean;
}

export interface BlogPostContent {
  slug: string;
  title: string;
  description: string;
  body: string;
  components: string[];
}

export interface TranslatableSegment {
  id: string;
  type: 'text' | 'html' | 'attribute';
  content: string;
  context?: string;
}

export interface TranslationProgress {
  stage: string;
  progress: number;
  message: string;
}

export interface PostMetadata {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
}

export interface BlogTranslationResult {
  slug: string;
  language: SupportedLanguage;
  title: string;
  description: string;
  content: string;
  success: boolean;
  error?: string;
}

/**
 * Parse a Svelte component to extract translatable content
 */
export function parseSvelteComponent(source: string): BlogPostContent {
  // Extract title from h1 tag
  const titleMatch = source.match(/<h1[^>]*>(.*?)<\/h1>/);
  const title = titleMatch ? stripHtml(titleMatch[1]) : '';
  
  // Extract description from meta or first paragraph
  const descMatch = source.match(/<p[^>]*>(.*?)<\/p>/);
  const description = descMatch ? stripHtml(descMatch[1]).substring(0, 160) : '';
  
  // Extract body content (everything between script tags and in template)
  const body = source;
  
  return {
    slug: '',
    title,
    description,
    body,
    components: [],
  };
}

/**
 * Extract translatable segments from content
 */
export function extractTranslatableSegments(content: string): TranslatableSegment[] {
  const segments: TranslatableSegment[] = [];
  
  // Extract text content from HTML
  const textRegex = />([^<]+)</g;
  let match;
  let id = 0;
  
  while ((match = textRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (text && text.length > 2) {
      segments.push({
        id: `seg_${id++}`,
        type: 'text',
        content: text,
      });
    }
  }
  
  return segments;
}

/**
 * Extract strings from script section
 */
export function extractScriptStrings(source: string): string[] {
  const strings: string[] = [];
  
  // Match quoted strings
  const quoteRegex = /['"`]([^'"`]+)['"]/g;
  let match;
  
  while ((match = quoteRegex.exec(source)) !== null) {
    const str = match[1].trim();
    if (str.length > 3 && !str.includes('{')) {
      strings.push(str);
    }
  }
  
  return strings;
}

/**
 * Translate a single blog post
 */
export async function translateBlogPost(
  slug: string,
  sourceContent: string,
  targetLang: SupportedLanguage,
  onProgress?: (progress: TranslationProgress) => void
): Promise<BlogTranslationResult> {
  try {
    onProgress?.({ stage: 'parsing', progress: 10, message: 'Parsing content...' });
    const parsed = parseSvelteComponent(sourceContent);
    
    onProgress?.({ stage: 'extracting', progress: 30, message: 'Extracting segments...' });
    const segments = extractTranslatableSegments(sourceContent);
    
    onProgress?.({ stage: 'translating', progress: 50, message: `Translating to ${targetLang}...` });
    
    // In a real implementation, this would call DeepL API
    // For now, return placeholder translation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onProgress?.({ stage: 'rebuilding', progress: 80, message: 'Rebuilding content...' });
    
    const translatedContent = sourceContent; // Placeholder
    
    onProgress?.({ stage: 'complete', progress: 100, message: 'Translation complete' });
    
    return {
      slug,
      language: targetLang,
      title: `[${targetLang.toUpperCase()}] ${parsed.title}`,
      description: parsed.description,
      content: translatedContent,
      success: true,
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logTranslationEvent('error', `Translation failed for ${slug}: ${errorMessage}`);
    
    return {
      slug,
      language: targetLang,
      title: '',
      description: '',
      content: '',
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Translate multiple posts in batch
 */
export async function translateMultiplePosts(
  posts: { slug: string; content: string }[],
  targetLang: SupportedLanguage,
  onProgress?: (current: number, total: number, slug: string) => void
): Promise<BlogTranslationResult[]> {
  const results: BlogTranslationResult[] = [];
  
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    onProgress?.(i + 1, posts.length, post.slug);
    
    const result = await translateBlogPost(post.slug, post.content, targetLang);
    results.push(result);
    
    // Add small delay between requests
    if (i < posts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return results;
}

/**
 * Translate post metadata only
 */
export async function translatePostMetadata(
  metadata: PostMetadata,
  targetLang: SupportedLanguage
): Promise<PostMetadata> {
  // In production, translate title, description, tags
  return {
    ...metadata,
    title: `[${targetLang.toUpperCase()}] ${metadata.title}`,
    description: `[${targetLang.toUpperCase()}] ${metadata.description}`,
  };
}

/**
 * Analyze post to determine translation complexity
 */
export function analyzePostForTranslation(content: string): {
  wordCount: number;
  componentCount: number;
  complexity: 'low' | 'medium' | 'high';
  estimatedTimeMinutes: number;
} {
  const text = stripHtml(content);
  const words = text.split(/\s+/).length;
  const components = (content.match(/<[A-Z][a-zA-Z]+/g) || []).length;
  
  let complexity: 'low' | 'medium' | 'high' = 'low';
  if (words > 1000 || components > 10) complexity = 'high';
  else if (words > 500 || components > 5) complexity = 'medium';
  
  return {
    wordCount: words,
    componentCount: components,
    complexity,
    estimatedTimeMinutes: complexity === 'high' ? 10 : complexity === 'medium' ? 5 : 2,
  };
}

/**
 * Translate blog content (simplified wrapper)
 */
export async function translateBlog(
  content: string,
  targetLang: SupportedLanguage,
  options?: {
    onProgress?: (stage: string, progress: number) => void;
  }
): Promise<TranslationResult> {
  const result = await translateBlogPost('anonymous', content, targetLang, (p) => {
    options?.onProgress?.(p.stage, p.progress);
  });
  
  return {
    language: targetLang,
    content: result.content,
    success: result.success,
  };
}

// Helper functions
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
