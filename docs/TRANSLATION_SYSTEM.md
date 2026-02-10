# Translation System Documentation

Complete guide for the Hairven salon website content translation pipeline.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [API Routes](#api-routes)
- [Admin UI](#admin-ui)
- [Batch Translation Script](#batch-translation-script)
- [Quality Assurance](#quality-assurance)
- [Troubleshooting](#troubleshooting)

## Overview

The translation system provides automated translation of blog post content from English to Spanish and French using the DeepL API. It preserves HTML structure, component imports, affiliate links (ASINs), and generates quality scores for each translation.

### Features

- **DeepL API Integration**: High-quality neural machine translation
- **Automatic Caching**: Prevents re-translation of identical content
- **Quality Scoring**: Evaluates translation completeness
- **ASIN Protection**: Preserves Amazon product IDs
- **Batch Processing**: Translate multiple posts at once
- **Admin Dashboard**: Web UI for managing translations
- **Progress Tracking**: Real-time status updates

## Architecture

```
src/lib/translation/
├── service.ts           # Core translation logic & DeepL integration
├── blog-translator.ts   # Blog post content extraction & translation
└── index.ts             # Module exports

src/lib/db/
└── translations.ts      # Translation status database

src/routes/api/admin/
├── translate/
│   └── +server.ts       # Translation API endpoint
└── translation-status/
    └── +server.ts       # Status API endpoint

src/routes/admin/
└── translations/
    ├── +page.svelte     # Admin dashboard UI
    └── +page.ts         # Page loader

scripts/
└── translate-posts.ts   # CLI batch translation script
```

## Configuration

### Environment Variables

Create or update your `.env` file:

```bash
# DeepL API Configuration
DEEPL_API_KEY=your_deepl_api_key_here

# Admin API Key for authentication
ADMIN_API_KEY=your_secure_admin_key_here

# Translation Database Path (optional)
TRANSLATIONS_DB_PATH=/data/translations.json
```

### Getting a DeepL API Key

1. Sign up at [DeepL Pro](https://www.deepl.com/pro)
2. Navigate to **API Keys** in your account settings
3. Copy your authentication key
4. Set it as `DEEPL_API_KEY` in your environment

**Note**: The free tier includes 500,000 characters per month.

## API Routes

### POST /api/admin/translate

Trigger translation for one or more posts.

**Authentication**: Bearer token required

#### Single Post Translation

```bash
curl -X POST http://localhost:5173/api/admin/translate \
  -H "Authorization: Bearer your_admin_key" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "best-hair-dryers-2025",
    "languages": ["es", "fr"]
  }'
```

#### Batch Translation

```bash
curl -X POST http://localhost:5173/api/admin/translate \
  -H "Authorization: Bearer your_admin_key" \
  -H "Content-Type: application/json" \
  -d '{
    "batch": true,
    "languages": ["es", "fr"]
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "Translated 2/2 language variants",
  "results": [
    {
      "slug": "best-hair-dryers-2025",
      "language": "es",
      "success": true,
      "qualityScore": 95,
      "outputPath": "src/lib/content/posts/best-hair-dryers-2025.es.svelte"
    }
  ],
  "batchJobId": "job_123"
}
```

### GET /api/admin/translation-status

Get translation status for all posts or a specific post.

```bash
# Get all posts status
curl http://localhost:5173/api/admin/translation-status \
  -H "Authorization: Bearer your_admin_key"

# Get specific post status
curl "http://localhost:5173/api/admin/translation-status?slug=best-hair-dryers-2025" \
  -H "Authorization: Bearer your_admin_key"

# Get batch job progress
curl "http://localhost:5173/api/admin/translation-status?batchJobId=job_123" \
  -H "Authorization: Bearer your_admin_key"
```

**Response**:
```json
{
  "stats": {
    "totalPosts": 30,
    "translatedPosts": 45,
    "pendingTranslations": 5,
    "failedTranslations": 0,
    "averageQualityScore": 92,
    "completionPercentage": 90
  },
  "posts": [
    {
      "slug": "best-hair-dryers-2025",
      "title": "Best Hair Dryers 2025",
      "category": "Reviews",
      "es": {
        "status": "completed",
        "qualityScore": 95,
        "translatedAt": "2026-02-10T18:00:00Z"
      },
      "fr": {
        "status": "completed",
        "qualityScore": 94,
        "translatedAt": "2026-02-10T18:05:00Z"
      },
      "isComplete": true,
      "needsUpdate": false
    }
  ],
  "activeBatchJob": null
}
```

## Admin UI

Access the translation management dashboard at `/admin/translations`.

### Features

- **Overview Stats**: See completion percentage, translated count, and average quality
- **Post Table**: View all posts with translation status per language
- **Batch Actions**: Translate all posts or filtered subsets
- **Progress Tracking**: Real-time updates during batch translation
- **Quality Indicators**: Color-coded quality scores for each translation
- **Search & Filter**: Find posts by title, slug, or status

### Status Icons

| Icon | Status | Description |
|------|--------|-------------|
| ✓ | Completed | Translation finished successfully |
| ⟳ | In Progress | Translation currently running |
| ○ | Pending | Awaiting translation |
| ✗ | Failed | Translation encountered an error |
| ! | Outdated | Source content changed since translation |
| - | Not Started | No translation record exists |

## Batch Translation Script

Use the CLI script for automated batch translation:

### Usage

```bash
# Translate all posts to both languages
npx tsx scripts/translate-posts.ts

# Translate to specific language only
npx tsx scripts/translate-posts.ts --languages=es

# Translate specific posts only
npx tsx scripts/translate-posts.ts --slugs=best-hair-dryers-2025,keratin-treatment-guide

# Combine options
npx tsx scripts/translate-posts.ts --languages=es --slugs=post1,post2
```

### Requirements

- Node.js 18+
- `DEEPL_API_KEY` environment variable set
- TypeScript execution environment (`tsx`)

### Output

The script generates `{slug}.{lang}.svelte` files alongside the original English versions:

```
src/lib/content/posts/
├── best-hair-dryers-2025.svelte      # Original (English)
├── best-hair-dryers-2025.es.svelte   # Spanish translation
├── best-hair-dryers-2025.fr.svelte   # French translation
└── ...
```

## Quality Assurance

### Quality Scoring

Translations are scored based on:

1. **Segment Completion** (40%): Percentage of segments successfully translated
2. **ASIN Preservation** (30%): Amazon product IDs kept intact
3. **HTML Tag Balance** (20%): Opening/closing tags match
4. **Length Ratio** (10%): Translated length is reasonable vs. original

### Quality Levels

| Score | Level | Action |
|-------|-------|--------|
| 90-100 | Excellent | Ready for publication |
| 70-89 | Good | Minor review recommended |
| 50-69 | Fair | Review required |
| 0-49 | Poor | Re-translation needed |

### Manual Review Checklist

Before publishing translated content:

- [ ] Product names preserved correctly
- [ ] ASINs are intact in all ProductCard components
- [ ] Affiliate links work correctly
- [ ] HTML structure preserved (no broken tags)
- [ ] Salon name "Hairven by Elyn" consistent
- [ ] Currency symbols appropriate for locale
- [ ] No mixed languages in a single post
- [ ] Call-to-action buttons make sense

## Troubleshooting

### DeepL API Errors

**Error**: `401 Unauthorized`
- Check your `DEEPL_API_KEY` is set correctly
- Verify the API key hasn't expired

**Error**: `429 Too Many Requests`
- DeepL free tier has rate limits
- The system includes automatic delays between requests
- Consider upgrading to DeepL Pro for higher limits

**Error**: `456 Quota Exceeded`
- You've reached the 500,000 character monthly limit
- Wait for the next billing period or upgrade to Pro

### Translation Quality Issues

**ASINs getting translated**
- This shouldn't happen with the protection system
- If it occurs, the post has unusual formatting
- Manually correct and report the issue

**HTML tags broken**
- Check for malformed HTML in the source
- DeepL sometimes struggles with complex nesting
- Fix source HTML and re-translate

**Product names changed**
- Brand names may be translated incorrectly
- These require manual review and correction

### Admin UI Issues

**"Authentication Required" keeps appearing**
- Check your `ADMIN_API_KEY` is set
- Verify you're using the correct key in the UI
- Clear browser localStorage and try again

**Progress stuck at 0%**
- Batch job may have failed silently
- Check server logs for errors
- Refresh the page to see current status

### Database Issues

**Translation status not persisting**
- Check `TRANSLATIONS_DB_PATH` is writable
- Ensure the directory exists
- Verify disk space is available

**Old jobs cluttering the database**
- Run cleanup: `cleanupOldBatchJobs(30)`
- Or manually delete `/data/translations.json`

## Best Practices

1. **Always review before publishing**: Automated translation is a starting point
2. **Test affiliate links**: Ensure ASINs work in translated posts
3. **Keep source files clean**: Well-formatted HTML translates better
4. **Translate in batches**: Avoid hitting rate limits
5. **Monitor quality scores**: Address low scores promptly
6. **Update translations**: Mark as outdated when source changes
7. **Backup translations**: Export database before major changes

## Integration with SvelteKit i18n

The translation system works alongside the existing svelte-i18n setup:

```typescript
// src/lib/i18n/index.ts
// Existing UI translations remain in locales/{en,es,fr}/

// Blog post content uses translated .svelte files
// Routes can detect language and load appropriate component
```

### Adding Language Switcher to Blog Posts

```svelte
<!-- In your blog post page -->
<script>
  import { page } from '$app/stores';
  
  // Detect current language from URL or user preference
  $: currentLang = $page.params.lang || 'en';
  
  // Dynamic import based on language
  async function loadPostComponent(slug: string, lang: string) {
    if (lang === 'en') {
      return import(`$lib/content/posts/${slug}.svelte`);
    }
    try {
      return import(`$lib/content/posts/${slug}.${lang}.svelte`);
    } catch {
      // Fallback to English
      return import(`$lib/content/posts/${slug}.svelte`);
    }
  }
</script>
```

## Support

For issues or questions:
1. Check this documentation
2. Review server logs
3. Verify environment configuration
4. Test with a single post before batch operations
