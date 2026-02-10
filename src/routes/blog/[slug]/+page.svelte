<script lang="ts">
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import SEO from '$lib/components/SEO.svelte';
  import { locale, _ } from 'svelte-i18n';
  import { getPostBySlug, getPublishedPosts, type BlogPost } from '$lib/content/posts';
  import { generateBreadcrumbSchema } from '$lib/utils/seo';
  
  // Import all blog post content components
  import BestHairDryers from '$lib/content/posts/best-hair-dryers-2025.svelte';
  import KeratinGuide from '$lib/content/posts/keratin-treatment-guide.svelte';
  import DysonVsGhd from '$lib/content/posts/dyson-vs-ghd-vs-revlon.svelte';
  import BalayageVsHighlights from '$lib/content/posts/balayage-vs-highlights.svelte';
  import SummerHairCare from '$lib/content/posts/summer-hair-care-tips.svelte';
  import BestProductsDamagedHair from '$lib/content/posts/best-products-damaged-hair.svelte';
  import HowToMakeBlowoutLast from '$lib/content/posts/how-to-make-blowout-last.svelte';
  import HairDryerComparison from '$lib/content/posts/hair-dryer-comparison.svelte';
  import DefaultPost from '$lib/content/posts/default.svelte';
  
  const slug = $page.params.slug ?? '';
  const post = getPostBySlug(slug);
  
  // Current language from i18n store
  $: currentLang = ($locale || 'en').split('-')[0] as 'en' | 'es' | 'fr';
  
  // Get related posts (same category or shared tags, excluding current)
  $: relatedPosts = post 
    ? getPublishedPosts()
      .filter(p => {
        if (p.slug === slug) return false;
        if (p.category === post.category) return true;
        if (p.tags.some(tag => post.tags.includes(tag))) return true;
        return false;
      })
      .slice(0, 3)
    : [];
  
  // Dynamic component loading based on slug
  const postComponents: Record<string, typeof DefaultPost> = {
    'best-hair-dryers-2025': BestHairDryers,
    'keratin-treatment-guide': KeratinGuide,
    'dyson-vs-ghd-vs-revlon': DysonVsGhd,
    'balayage-vs-highlights': BalayageVsHighlights,
    'summer-hair-care-tips': SummerHairCare,
    'best-products-damaged-hair': BestProductsDamagedHair,
    'how-to-make-blowout-last': HowToMakeBlowoutLast,
    'hair-dryer-comparison': HairDryerComparison,
  };
  
  $: PostContent = postComponents[slug] || DefaultPost;
  
  // Language switcher state
  $: languageUrls = [
    { code: 'en', name: 'English', url: `/blog/${slug}`, active: currentLang === 'en' },
    { code: 'es', name: 'Español', url: `/es/blog/${slug}`, active: currentLang === 'es' },
    { code: 'fr', name: 'Français', url: `/fr/blog/${slug}`, active: currentLang === 'fr' },
  ];
  
  $: breadcrumbSchema = post ? generateBreadcrumbSchema([
    { name: $_('nav.home'), path: '/' },
    { name: $_('nav.blog'), path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` }
  ]) : null;
  
  // Format date based on locale
  function formatLocalizedDate(dateString: string, lang: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Get reading time text
  $: readingTimeText = post 
    ? $_('blog.read_time', { values: { minutes: post.readingTime } })
    : '';
</script>

{#if post}
  <SEO 
    title={post.title}
    description={post.description}
    type="article"
    published={post.date}
    modified={post.modified}
    author={post.author}
    schema={breadcrumbSchema}
  />

  <article class="min-h-screen bg-black">
    <!-- Hero -->
    <header class="relative py-20 bg-gradient-to-b from-pink-bright/10 to-black">
      <div class="max-w-4xl mx-auto px-4">
        <!-- Language Switcher -->
        <div class="mb-6 flex items-center gap-2 flex-wrap">
          <span class="text-sm text-gray-400">{$_('language.select')}:</span>
          <div class="flex gap-2">
            {#each languageUrls as lang}
              {#if lang.active}
                <span class="px-3 py-1 bg-pink-bright text-black text-sm font-medium rounded-full">
                  {lang.name}
                </span>
              {:else}
                <a 
                  href={lang.url}
                  class="px-3 py-1 bg-black-soft text-gray-300 text-sm rounded-full hover:bg-gray-dark hover:text-white transition-colors"
                >
                  {lang.name}
                </a>
              {/if}
            {/each}
          </div>
        </div>
        
        <!-- Breadcrumbs -->
        <nav class="mb-6" aria-label="Breadcrumb">
          <ol class="flex items-center text-sm text-gray-medium">
            <li><a href="/" class="hover:text-pink-bright transition-colors">{$_('nav.home')}</a></li>
            <li class="mx-2">/</li>
            <li><a href="/blog" class="hover:text-pink-bright transition-colors">{$_('nav.blog')}</a></li>
            <li class="mx-2">/</li>
            <li class="text-gray-light truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>
        
        <!-- Category -->
        <a 
          href="/blog?category={post.category.toLowerCase()}" 
          class="inline-block px-4 py-1 bg-pink-bright/10 text-pink-bright text-sm font-medium rounded-full mb-4 hover:bg-pink-bright/20 transition-colors"
        >
          {post.category}
        </a>
        
        <h1 class="text-3xl md:text-5xl font-display text-white mb-6 leading-tight">{post.title}</h1>
        
        <!-- Meta -->
        <div class="flex flex-wrap items-center gap-6 text-gray-medium">
          <div class="flex items-center">
            <span class="w-10 h-10 bg-pink-bright/20 rounded-full flex items-center justify-center text-pink-bright font-bold mr-3">
              {post.author.charAt(0)}
            </span>
            <div>
              <p class="text-white font-medium">{post.author}</p>
              <p class="text-sm">{$_('blog.by_author', { values: { author: post.author } })}</p>
            </div>
          </div>
          <div class="flex items-center gap-4 text-sm">
            <span>📅 {formatLocalizedDate(post.date, currentLang)}</span>
            <span>⏱️ {readingTimeText}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <section class="py-12">
      <div class="max-w-4xl mx-auto px-4">
        <div class="bg-black-soft/30 rounded-lg p-6 md:p-12 border border-gray-dark">
          <PostContent />
        </div>
      </div>
    </section>

    <!-- Tags -->
    <section class="py-8 border-t border-gray-dark">
      <div class="max-w-4xl mx-auto px-4">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-gray-medium">{$_('blog.tags')}:</span>
          {#each post.tags as tag}
            <a 
              href="/blog?tag={tag}" 
              class="px-3 py-1 bg-black-soft text-gray-light rounded-full text-sm hover:bg-pink-bright/20 hover:text-pink-bright transition-colors"
            >
              {tag}
            </a>
          {/each}
        </div>
      </div>
    </section>

    <!-- Related Posts -->
    {#if relatedPosts.length > 0}
      <section class="py-16 bg-black-soft/30">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="text-2xl font-display text-white mb-8">{$_('blog.related_articles')}</h2>
          <div class="grid md:grid-cols-3 gap-6">
            {#each relatedPosts as related}
              <a href="/blog/{related.slug}" class="group">
                <article class="bg-black-soft/50 rounded-lg overflow-hidden border border-gray-dark group-hover:border-pink-bright/40 transition-all duration-300 h-full">
                  <div class="aspect-video bg-gradient-to-br from-pink-bright/20 to-pink-dark/20 flex items-center justify-center">
                    <span class="text-4xl">
                      {#if related.category === 'Reviews'}
                        ⭐
                      {:else if related.category === 'Guides'}
                        📚
                      {:else}
                        💡
                      {/if}
                    </span>
                  </div>
                  <div class="p-5">
                    <span class="text-xs text-pink-bright font-medium">{related.category}</span>
                    <h3 class="text-white font-medium mt-2 group-hover:text-pink-bright transition-colors line-clamp-2">{related.title}</h3>
                    <p class="text-gray-medium text-sm mt-2 line-clamp-2">{related.description}</p>
                    <div class="flex items-center gap-3 mt-4 text-xs text-gray-medium">
                      <span>{$_('blog.read_time', { values: { minutes: related.readingTime } })}</span>
                    </div>
                  </div>
                </article>
              </a>
            {/each}
          </div>
        </div>
      </section>
    {/if}

    <!-- Newsletter -->
    <section class="py-16">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <h2 class="text-2xl font-display text-white mb-4">{$_('blog.newsletter_cta')}</h2>
        <p class="text-gray-light mb-8">
          {$_('blog.subscribe_prompt')}
        </p>
        <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder={$_('forms.email')}
            class="flex-1 px-4 py-3 bg-black-soft border border-gray-dark rounded-lg text-white placeholder-gray-medium focus:border-pink-bright focus:outline-none"
          />
          <button 
            type="submit"
            class="px-6 py-3 bg-pink-bright text-black font-semibold rounded-lg hover:bg-pink-medium transition-colors"
          >
            {$_('actions.subscribe')}
          </button>
        </form>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 bg-gradient-to-r from-pink-bright/10 via-black to-pink-bright/10">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-display text-white mb-4">Ready to Transform Your Hair?</h2>
        <p class="text-gray-light mb-8 max-w-2xl mx-auto">
          Visit Hairven by Elyn for professional services, or shop our curated selection of salon-quality products.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/shop" class="px-8 py-4 border-2 border-pink-bright text-pink-bright font-semibold rounded-lg hover:bg-pink-bright hover:text-black transition-colors">
            {$_('nav.shop')}
          </a>
          <a href="/contact" class="px-8 py-4 bg-pink-bright text-black font-semibold rounded-lg hover:bg-pink-medium transition-colors">
            {$_('nav.book')}
          </a>
        </div>
      </div>
    </section>
  </article>
{:else}
  <!-- 404 State -->
  <div class="min-h-screen bg-black flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <div class="text-6xl mb-4">📖</div>
      <h1 class="text-4xl font-display text-white mb-4">{$_('errors.404_title')}</h1>
      <p class="text-gray-medium mb-8">
        {$_('errors.404_message')}
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/blog" class="px-8 py-4 bg-pink-bright text-black font-semibold rounded-lg hover:bg-pink-medium transition-colors">
          {$_('nav.blog')}
        </a>
        <a href="/" class="px-8 py-4 border-2 border-pink-bright text-pink-bright font-semibold rounded-lg hover:bg-pink-bright hover:text-black transition-colors">
          {$_('errors.go_home')}
        </a>
      </div>
    </div>
  </div>
{/if}
