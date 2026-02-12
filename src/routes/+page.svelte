<script lang="ts">
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { curatedProducts, createAmazonLink } from '$lib/utils/amazon';
	import { posts } from '$lib/content/posts';

	// Background images for hero
	const bgImages = ['/bg/bg1.webp', '/bg/bg2.webp', '/bg/bg3.webp', '/bg/bg4.webp', '/bg/bg5.webp'];
	let currentBgIndex = 0;

	// Featured products (top 3)
	$: featuredProducts = curatedProducts.slice(0, 3);

	// Latest blog posts (top 3)
	$: latestPosts = posts.filter(p => p.published).slice(0, 3);

	onMount(() => {
		const interval = setInterval(() => {
			currentBgIndex = (currentBgIndex + 1) % bgImages.length;
		}, 6000);
		return () => clearInterval(interval);
	});
</script>

<SEO 
	title="Expert-Picked Hair Tools & Products"
	description="Hairven by Elyn — salon-approved hair tools, treatments, and styling products. Curated picks from professional stylists. Shop the best hair dryers, flat irons, and treatments."
/>

<!-- ═══════════════════════════════════════════════════════
     HERO — Full-bleed background with rotating images
     ═══════════════════════════════════════════════════════ -->
<section class="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
	<!-- Background Carousel -->
	{#each bgImages as bg, index}
		<div 
			class="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out {index === currentBgIndex ? 'opacity-100' : 'opacity-0'}"
			style="background-image: url('{bg}');"
		></div>
	{/each}
	<div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80"></div>

	<!-- Hero Content -->
	<div class="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
		<p class="text-sm sm:text-base tracking-widest uppercase text-pink-light mb-4 drop-shadow">Salon-Approved Picks</p>
		<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-handwritten font-bold text-white mb-6 drop-shadow-2xl leading-tight">
			Your Hair Deserves<br class="hidden sm:block" /> the Best
		</h1>
		<p class="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 drop-shadow-lg leading-relaxed">
			Professional-grade tools and treatments, hand-picked by our stylists. 
			Every product tested in our salon before we recommend it to you.
		</p>
		<div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
			<a href="/shop" class="px-8 py-3.5 bg-pink-bright text-black font-semibold rounded-full hover:bg-pink-medium transition-all shadow-lg hover:shadow-pink-bright/40 text-base">
				Shop Our Picks
			</a>
			<a href="/blog" class="px-8 py-3.5 border-2 border-white/60 text-white font-semibold rounded-full hover:bg-white/10 transition-all text-base">
				Read Reviews
			</a>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════
     TRUST BAR
     ═══════════════════════════════════════════════════════ -->
<section class="py-6 sm:py-8 border-b" style="background-color: var(--bg-secondary); border-color: var(--border-color);">
	<div class="max-w-5xl mx-auto px-4 sm:px-6">
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
			<div>
				<p class="text-2xl sm:text-3xl font-bold text-pink-bright">42+</p>
				<p class="text-xs sm:text-sm mt-1" style="color: var(--text-muted);">Products Tested</p>
			</div>
			<div>
				<p class="text-2xl sm:text-3xl font-bold text-pink-bright">4.6+</p>
				<p class="text-xs sm:text-sm mt-1" style="color: var(--text-muted);">Avg. Rating</p>
			</div>
			<div>
				<p class="text-2xl sm:text-3xl font-bold text-pink-bright">100%</p>
				<p class="text-xs sm:text-sm mt-1" style="color: var(--text-muted);">Salon Tested</p>
			</div>
			<div>
				<p class="text-2xl sm:text-3xl font-bold text-pink-bright">0%</p>
				<p class="text-xs sm:text-sm mt-1" style="color: var(--text-muted);">Markup</p>
			</div>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════
     FEATURED PRODUCTS
     ═══════════════════════════════════════════════════════ -->
<section class="py-14 sm:py-20" style="background-color: var(--bg-primary);">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-10 sm:mb-14">
			<h2 class="text-3xl sm:text-4xl font-display mb-3" style="color: var(--text-primary);">Staff Favorites</h2>
			<p class="max-w-xl mx-auto text-sm sm:text-base" style="color: var(--text-muted);">
				The tools and treatments our stylists reach for every single day.
			</p>
		</div>

		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
			{#each featuredProducts as product}
				<div class="theme-card group">
					<div class="aspect-square p-6 flex items-center justify-center overflow-hidden" style="background-color: var(--product-img-bg);">
						<img 
							src={product.imageUrl} 
							alt={product.title}
							class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
							loading="lazy"
						/>
					</div>
					<div class="p-5 sm:p-6">
						<h3 class="text-base sm:text-lg font-semibold mb-1.5" style="color: var(--text-primary);">{product.title}</h3>
						<p class="text-sm mb-3 line-clamp-2" style="color: var(--text-muted);">{product.description}</p>
						
						<div class="flex items-center mb-3">
							<div class="flex text-gold-bright">
								{#each Array(5) as _, i}
									<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 {i < Math.floor(product.rating) ? 'fill-current' : ''}" style={i >= Math.floor(product.rating) ? 'color: var(--border-color);' : ''} viewBox="0 0 20 20">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
									</svg>
								{/each}
							</div>
							<span class="text-xs sm:text-sm ml-1.5" style="color: var(--text-muted);">({product.reviewCount.toLocaleString()})</span>
						</div>
						
						<div class="flex items-center justify-between">
							<span class="text-xl sm:text-2xl font-bold text-pink-bright">{product.price}</span>
							<a 
								href={createAmazonLink(product.asin)}
								class="px-4 sm:px-5 py-2 bg-pink-bright font-semibold rounded-lg hover:bg-pink-medium transition-colors text-sm"
								style="color: var(--text-inverse);"
								rel="sponsored noopener noreferrer"
								target="_blank"
							>
								View on Amazon
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="text-center mt-10 sm:mt-12">
			<a href="/shop" class="inline-flex items-center gap-2 px-8 py-3 border-2 border-pink-bright text-pink-bright font-semibold rounded-full hover:bg-pink-bright hover:text-black transition-all text-sm sm:text-base">
				View All Products
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
				</svg>
			</a>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════
     WHY TRUST US
     ═══════════════════════════════════════════════════════ -->
<section class="py-14 sm:py-20" style="background-color: var(--bg-tertiary);">
	<div class="max-w-5xl mx-auto px-4 sm:px-6">
		<div class="text-center mb-10 sm:mb-14">
			<h2 class="text-3xl sm:text-4xl font-display mb-3" style="color: var(--text-primary);">Why Trust Our Picks?</h2>
			<p class="max-w-xl mx-auto text-sm sm:text-base" style="color: var(--text-muted);">
				We don't just review products online — we use them on real clients, every day.
			</p>
		</div>
		<div class="grid sm:grid-cols-3 gap-6 sm:gap-8">
			<div class="theme-card p-6 text-center">
				<div class="w-12 h-12 rounded-full bg-pink-bright/10 flex items-center justify-center mx-auto mb-4">
					<svg class="w-6 h-6 text-pink-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
					</svg>
				</div>
				<h3 class="font-semibold mb-2 text-sm sm:text-base" style="color: var(--text-primary);">Salon Tested</h3>
				<p class="text-sm" style="color: var(--text-muted);">Every tool and product has been tested on real clients in our Cortland, NY salon.</p>
			</div>
			<div class="theme-card p-6 text-center">
				<div class="w-12 h-12 rounded-full bg-pink-bright/10 flex items-center justify-center mx-auto mb-4">
					<svg class="w-6 h-6 text-pink-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				</div>
				<h3 class="font-semibold mb-2 text-sm sm:text-base" style="color: var(--text-primary);">Same Amazon Price</h3>
				<p class="text-sm" style="color: var(--text-muted);">You pay the exact same price. We earn a small commission at zero extra cost to you.</p>
			</div>
			<div class="theme-card p-6 text-center">
				<div class="w-12 h-12 rounded-full bg-pink-bright/10 flex items-center justify-center mx-auto mb-4">
					<svg class="w-6 h-6 text-pink-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
					</svg>
				</div>
				<h3 class="font-semibold mb-2 text-sm sm:text-base" style="color: var(--text-primary);">Honest Reviews</h3>
				<p class="text-sm" style="color: var(--text-muted);">We share what actually works — including the products we've tried and wouldn't recommend.</p>
			</div>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════════
     LATEST FROM THE BLOG
     ═══════════════════════════════════════════════════════ -->
{#if latestPosts.length > 0}
<section class="py-14 sm:py-20" style="background-color: var(--bg-primary);">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-10 sm:mb-14">
			<h2 class="text-3xl sm:text-4xl font-display mb-3" style="color: var(--text-primary);">Latest Reviews & Guides</h2>
			<p class="max-w-xl mx-auto text-sm sm:text-base" style="color: var(--text-muted);">
				In-depth reviews, comparisons, and styling tips from our team.
			</p>
		</div>

		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
			{#each latestPosts as post}
				<a href="/blog/{post.slug}" class="theme-card group block">
					{#if post.image}
						<div class="aspect-video overflow-hidden" style="background-color: var(--bg-tertiary);">
							<img 
								src={post.image} 
								alt={post.title}
								class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
								loading="lazy"
							/>
						</div>
					{/if}
					<div class="p-5 sm:p-6">
						<div class="flex items-center gap-2 mb-2">
							<span class="text-xs px-2 py-0.5 rounded-full bg-pink-bright/10 text-pink-bright font-medium">{post.category}</span>
							<span class="text-xs" style="color: var(--text-muted);">{post.readingTime} min read</span>
						</div>
						<h3 class="font-semibold mb-2 group-hover:text-pink-bright transition-colors text-sm sm:text-base" style="color: var(--text-primary);">{post.title}</h3>
						<p class="text-sm line-clamp-2" style="color: var(--text-muted);">{post.description}</p>
					</div>
				</a>
			{/each}
		</div>

		<div class="text-center mt-10 sm:mt-12">
			<a href="/blog" class="inline-flex items-center gap-2 text-pink-bright hover:text-pink-medium font-semibold transition-colors text-sm sm:text-base">
				View All Posts
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
				</svg>
			</a>
		</div>
	</div>
</section>
{/if}

<!-- ═══════════════════════════════════════════════════════
     NEWSLETTER CTA
     ═══════════════════════════════════════════════════════ -->
<section class="py-14 sm:py-20 bg-gradient-to-r from-pink-bright/10 to-pink-dark/10">
	<div class="max-w-2xl mx-auto px-4 sm:px-6 text-center">
		<h2 class="text-2xl sm:text-3xl font-display mb-3" style="color: var(--text-primary);">Get Exclusive Deals</h2>
		<p class="mb-6 text-sm sm:text-base" style="color: var(--text-muted);">
			Be the first to know about product drops, sale alerts, and stylist tips. No spam — just the good stuff.
		</p>
		<form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
			<input 
				type="email"
				placeholder="you@email.com"
				class="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:border-pink-bright text-sm"
				style="background-color: var(--bg-input); border-color: var(--border-color); color: var(--text-primary);"
			/>
			<button 
				type="submit"
				class="px-6 py-3 bg-pink-bright font-semibold rounded-lg hover:bg-pink-medium transition-colors text-sm whitespace-nowrap"
				style="color: var(--text-inverse);"
			>
				Subscribe
			</button>
		</form>
	</div>
</section>
