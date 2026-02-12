<script lang="ts">
  import type { AmazonProduct } from '$lib/utils/amazon-products';
  import { createAmazonLink } from '$lib/utils/amazon';

  export let product: AmazonProduct;
  export let featured: boolean = false;
  export let showDescription: boolean = true;
  export let compact: boolean = false;

  $: amazonUrl = createAmazonLink(product.asin);
  $: stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
</script>

{#if compact}
  <!-- Compact Version -->
  <a 
    href={amazonUrl}
    target="_blank"
    rel="noopener noreferrer sponsored"
    class="flex items-center gap-4 bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border-color)] hover:border-pink-bright/50 transition-all group"
  >
    <img 
      src={product.imageUrl} 
      alt={product.title}
      class="w-16 h-16 object-contain rounded bg-white/5"
      loading="lazy"
    />
    <div class="flex-1 min-w-0">
      <h4 class="text-[var(--text-primary)] font-medium text-sm truncate group-hover:text-pink-bright transition-colors">
        {product.title}
      </h4>
      <div class="flex items-center gap-2 mt-1">
        <span class="text-yellow-400 text-xs">{stars}</span>
        <span class="text-[var(--text-muted)] text-xs">({product.reviewCount.toLocaleString()})</span>
      </div>
      <p class="text-pink-bright font-semibold text-sm mt-1">{product.price}</p>
    </div>
  </a>
{:else}
  <!-- Full Version -->
  <div class="bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-color)] hover:border-pink-bright/50 transition-all duration-300 {featured ? 'ring-2 ring-pink-bright/30' : ''}">
    <!-- Image -->
    <a 
      href={amazonUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      class="block aspect-square bg-white/5 p-4 relative group"
    >
      <img 
        src={product.imageUrl} 
        alt={product.title}
        class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      {#if product.bestseller}
        <span class="absolute top-2 left-2 bg-pink-bright text-black text-xs font-bold px-2 py-1 rounded">
          BESTSELLER
        </span>
      {/if}
      {#if product.prime}
        <span class="absolute top-2 right-2 bg-blue-500 text-[var(--text-primary)] text-xs font-bold px-2 py-1 rounded">
          prime
        </span>
      {/if}
    </a>

    <!-- Content -->
    <div class="p-5">
      <!-- Category -->
      <span class="text-xs text-[var(--text-muted)] uppercase tracking-wide">
        {product.category.replace('-', ' ')}
      </span>

      <!-- Title -->
      <a 
        href={amazonUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        class="block mt-1"
      >
        <h3 class="text-[var(--text-primary)] font-semibold leading-tight hover:text-pink-bright transition-colors line-clamp-2">
          {product.title}
        </h3>
      </a>

      <!-- Rating -->
      <div class="flex items-center gap-2 mt-2">
        <span class="text-yellow-400 text-sm">{stars}</span>
        <span class="text-[var(--text-muted)] text-sm">{product.rating}</span>
        <span class="text-gray-dark">•</span>
        <span class="text-[var(--text-muted)] text-sm">{product.reviewCount.toLocaleString()} reviews</span>
      </div>

      <!-- Description -->
      {#if showDescription}
        <p class="text-[var(--text-secondary)] text-sm mt-3 line-clamp-2">
          {product.description}
        </p>
      {/if}

      <!-- Features -->
      {#if product.features && product.features.length > 0 && !compact}
        <ul class="mt-3 space-y-1">
          {#each product.features.slice(0, 3) as feature}
            <li class="text-[var(--text-secondary)] text-xs flex items-start">
              <span class="text-pink-bright mr-2">✓</span>
              {feature}
            </li>
          {/each}
        </ul>
      {/if}

      <!-- Price & CTA -->
      <div class="mt-4 flex items-center justify-between">
        <span class="text-xl font-bold text-[var(--text-primary)]">{product.price}</span>
        <a 
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          class="px-4 py-2 bg-pink-bright text-black text-sm font-semibold rounded hover:bg-pink-medium transition-colors"
        >
          View on Amazon
        </a>
      </div>

      <!-- Affiliate Disclosure -->
      <p class="text-[var(--text-muted)] text-xs mt-3 italic">
        As an Amazon Associate, we earn from qualifying purchases.
      </p>
    </div>
  </div>
{/if}
