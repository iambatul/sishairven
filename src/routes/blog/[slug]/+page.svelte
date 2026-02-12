<script lang="ts">
  import { page } from '$app/stores';
  import SEO from '$lib/components/SEO.svelte';
  import { getPostBySlug, getPublishedPosts, formatDate, type BlogPost } from '$lib/content/posts';
  import { createAmazonLink } from '$lib/utils/amazon';
  
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
  
  // Get related posts
  $: relatedPosts = post 
    ? getPublishedPosts()
        .filter(p => p.slug !== slug && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
        .slice(0, 3)
    : [];
  
  // Dynamic component loading
  const postComponents: Record<string, any> = {
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
  
  $: readingTimeText = post ? `${post.readingTime} min read` : '';
</script>

{#if post}
  <SEO 
    title={post.title}
    description={post.description}
    path="/blog/{post.slug}"
    type="article"
    published={post.date}
    author={post.author}
  />

  <article style="background-color: var(--bg-primary);">
    <!-- Header -->
    <header class="py-10 sm:py-16 border-b" style="border-color: var(--border-color);">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <!-- Breadcrumbs -->
        <nav class="mb-6" aria-label="Breadcrumb">
          <ol class="flex items-center text-sm" style="color: var(--text-muted);">
            <li><a href="/" class="hover:text-pink-bright transition-colors">Home</a></li>
            <li class="mx-2">/</li>
            <li><a href="/blog" class="hover:text-pink-bright transition-colors">Blog</a></li>
            <li class="mx-2">/</li>
            <li class="truncate max-w-[200px]" style="color: var(--text-secondary);">{post.title}</li>
          </ol>
        </nav>
        
        <!-- Category -->
        <a 
          href="/blog" 
          class="inline-block px-3 sm:px-4 py-1 bg-pink-bright/10 text-pink-bright text-xs sm:text-sm font-medium rounded-full mb-4 hover:bg-pink-bright/20 transition-colors"
        >
          {post.category}
        </a>
        
        <h1 class="text-2xl sm:text-3xl md:text-5xl font-display mb-4 sm:mb-6 leading-tight" style="color: var(--text-primary);">{post.title}</h1>
        
        <!-- Meta -->
        <div class="flex flex-wrap items-center gap-4 sm:gap-6" style="color: var(--text-muted);">
          <div class="flex items-center">
            <span class="w-8 h-8 sm:w-10 sm:h-10 bg-pink-bright/20 rounded-full flex items-center justify-center text-pink-bright font-bold mr-2 sm:mr-3 text-sm sm:text-base">
              {post.author.charAt(0)}
            </span>
            <div>
              <p class="font-medium text-sm sm:text-base" style="color: var(--text-primary);">{post.author}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <span>{formatDate(post.date)}</span>
            <span>{readingTimeText}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <section class="py-8 sm:py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <div class="rounded-lg p-4 sm:p-6 md:p-12 border" style="background-color: var(--bg-tertiary); border-color: var(--border-color);">
          <svelte:component this={PostContent} />
        </div>
      </div>
    </section>

    <!-- Tags -->
    <section class="py-6 sm:py-8 border-t" style="border-color: var(--border-color);">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <span class="text-sm" style="color: var(--text-muted);">Tags:</span>
          {#each post.tags as tag}
            <span class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm" style="background-color: var(--bg-secondary); color: var(--text-secondary);">
              {tag}
            </span>
          {/each}
        </div>
      </div>
    </section>

    <!-- Related Posts -->
    {#if relatedPosts.length > 0}
      <section class="py-10 sm:py-16" style="background-color: var(--bg-tertiary);">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 class="text-xl sm:text-2xl font-display mb-6 sm:mb-8" style="color: var(--text-primary);">You Might Also Like</h2>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {#each relatedPosts as related}
              <a href="/blog/{related.slug}" class="theme-card group block">
                <div class="aspect-video flex items-center justify-center" style="background: linear-gradient(135deg, rgba(255,20,147,0.15), rgba(199,21,133,0.15));">
                  <span class="text-3xl sm:text-4xl">
                    {related.category === 'Reviews' ? '⭐' : related.category === 'Guides' ? '📚' : '💡'}
                  </span>
                </div>
                <div class="p-4 sm:p-5">
                  <span class="text-xs text-pink-bright font-medium">{related.category}</span>
                  <h3 class="font-medium mt-1.5 group-hover:text-pink-bright transition-colors text-sm sm:text-base line-clamp-2" style="color: var(--text-primary);">{related.title}</h3>
                  <p class="text-xs sm:text-sm mt-2 line-clamp-2" style="color: var(--text-muted);">{related.description}</p>
                  <span class="text-xs mt-3 inline-block" style="color: var(--text-muted);">{related.readingTime} min read</span>
                </div>
              </a>
            {/each}
          </div>
        </div>
      </section>
    {/if}

    <!-- CTA -->
    <section class="py-10 sm:py-16 bg-pink-bright/10">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-xl sm:text-2xl font-display mb-3" style="color: var(--text-primary);">Find the Right Products</h2>
        <p class="mb-6 text-sm sm:text-base" style="color: var(--text-muted);">
          Browse our salon-tested picks or read more reviews from our team.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/shop" class="px-6 sm:px-8 py-3 bg-pink-bright font-semibold rounded-lg hover:bg-pink-medium transition-colors text-sm" style="color: var(--text-inverse);">
            Shop Products
          </a>
          <a href="/blog" class="px-6 sm:px-8 py-3 border-2 border-pink-bright text-pink-bright font-semibold rounded-lg hover:bg-pink-bright hover:text-black transition-colors text-sm">
            More Reviews
          </a>
        </div>
      </div>
    </section>
  </article>

{:else}
  <!-- 404 State -->
  <SEO title="Post Not Found" description="The blog post you're looking for doesn't exist." />
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: var(--bg-primary);">
    <div class="text-center max-w-md">
      <div class="text-5xl sm:text-6xl mb-4">📖</div>
      <h1 class="text-3xl sm:text-4xl font-display mb-4" style="color: var(--text-primary);">Post Not Found</h1>
      <p class="mb-8 text-sm sm:text-base" style="color: var(--text-muted);">
        Sorry, we couldn't find that article. It may have been moved or removed.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <a href="/blog" class="px-8 py-3 bg-pink-bright font-semibold rounded-lg hover:bg-pink-medium transition-colors text-sm" style="color: var(--text-inverse);">
          All Articles
        </a>
        <a href="/" class="px-8 py-3 border-2 border-pink-bright text-pink-bright font-semibold rounded-lg hover:bg-pink-bright hover:text-black transition-colors text-sm">
          Go Home
        </a>
      </div>
    </div>
  </div>
{/if}
