<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { curatedProducts, createAmazonLink, getAllCategories } from '$lib/utils/amazon';
	
	const categories = getAllCategories();
	
	function getCategoryLabel(cat: string) {
		const labels: Record<string, string> = {
			'hair-tools': 'Hair Tools',
			'hair-care': 'Hair Care'
		};
		return labels[cat] || cat;
	}
</script>

<SEO 
	title="Shop Our Favorite Products"
	description="Professional hair tools and products recommended by the stylists at Hairven by Elyn. Shop the best hair dryers, styling tools, and hair care products."
/>

<div class="min-h-screen bg-black">
	<!-- Hero -->
	<section class="relative py-20 bg-gradient-to-b from-pink-bright/10 to-black">
		<div class="max-w-4xl mx-auto px-4 text-center">
			<h1 class="text-5xl md:text-6xl font-handwritten text-pink-bright mb-6">Shop Our Favorites</h1>
			<p class="text-xl text-gray-light max-w-2xl mx-auto">
				Professional-grade tools and products our stylists use and recommend. 
				Every item has been tested in our salon.
			</p>
		</div>
	</section>

	<!-- Affiliate Notice -->
	<section class="py-6 border-b border-gray-dark">
		<div class="max-w-4xl mx-auto px-4">
			<p class="text-sm text-gray-medium text-center">
				As an Amazon Associate, we earn from qualifying purchases. 
				<a href="/affiliate-disclosure" class="text-pink-bright hover:underline">Learn more</a>
			</p>
		</div>
	</section>

	<!-- Products by Category -->
	{#each categories as category}
		{@const categoryProducts = curatedProducts.filter(p => p.category === category)}
		<section class="py-16 {category === 'hair-care' ? 'bg-black-soft/30' : ''}">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 class="text-3xl font-display text-white mb-4">{getCategoryLabel(category)}</h2>
				<p class="text-gray-medium mb-8">
					{category === 'hair-tools' 
						? 'Professional styling tools for salon-quality results at home.' 
						: 'Premium treatments and products to keep your hair healthy and beautiful.'}
				</p>
				
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{#each categoryProducts as product}
						<div class="bg-black-soft/50 rounded-lg overflow-hidden border border-pink-bright/20 hover:border-pink-bright/40 transition-colors">
							<!-- Product Image -->
							<div class="aspect-square bg-white p-4 flex items-center justify-center">
								<img 
									src={product.imageUrl} 
									alt={product.title}
									class="max-h-full max-w-full object-contain"
									loading="lazy"
								/>
							</div>
							
							<!-- Product Info -->
							<div class="p-6">
								<h3 class="text-lg font-semibold text-white mb-2">{product.title}</h3>
								<p class="text-gray-medium text-sm mb-4 line-clamp-2">{product.description}</p>
								
								<!-- Rating -->
								<div class="flex items-center mb-4">
									<div class="flex text-gold">
										{#each Array(5) as _, i}
											<svg class="w-4 h-4 {i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-dark'}" viewBox="0 0 20 20">
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
											</svg>
										{/each}
									</div>
									<span class="text-sm text-gray-medium ml-2">({product.reviewCount.toLocaleString()} reviews)</span>
								</div>
								
								<!-- Price & CTA -->
								<div class="flex items-center justify-between">
									<span class="text-2xl font-bold text-pink-bright">{product.price}</span>
									<a 
										href={createAmazonLink(product.asin)}
										class="px-6 py-2 bg-pink-bright text-black font-semibold rounded-lg hover:bg-pink-medium transition-colors text-sm"
										rel="sponsored noopener noreferrer"
										target="_blank"
									>
										View on Amazon
									</a>
								</div>
								
								<!-- Features -->
								<div class="mt-4 pt-4 border-t border-gray-dark">
									<ul class="text-xs text-gray-medium space-y-1">
										{#each product.features.slice(0, 2) as feature}
											<li>✓ {feature}</li>
										{/each}
									</ul>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/each}

	<!-- Why Buy Through Us -->
	<section class="py-16">
		<div class="max-w-4xl mx-auto px-4 text-center">
			<h2 class="text-3xl font-display text-white mb-8">Why Buy Through Our Links?</h2>
			<div class="grid md:grid-cols-3 gap-8">
				<div class="bg-black-soft/50 p-6 rounded-lg border border-pink-bright/20">
					<div class="text-3xl mb-4">✓</div>
					<h3 class="text-white font-semibold mb-2">Expert Curated</h3>
					<p class="text-gray-medium text-sm">Every product is tested and approved by our professional stylists.</p>
				</div>
				<div class="bg-black-soft/50 p-6 rounded-lg border border-pink-bright/20">
					<div class="text-3xl mb-4">💰</div>
					<h3 class="text-white font-semibold mb-2">Same Price</h3>
					<p class="text-gray-medium text-sm">You pay the same price as going directly to Amazon. No markup.</p>
				</div>
				<div class="bg-black-soft/50 p-6 rounded-lg border border-pink-bright/20">
					<div class="text-3xl mb-4">🤝</div>
					<h3 class="text-white font-semibold mb-2">Support Local</h3>
					<p class="text-gray-medium text-sm">Your purchase helps support our small business at no extra cost.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="py-16 bg-pink-bright/10">
		<div class="max-w-4xl mx-auto px-4 text-center">
			<h2 class="text-3xl font-display text-white mb-4">Need Personalized Recommendations?</h2>
			<p class="text-gray-light mb-8">
				Not sure which product is right for your hair type? Book a consultation with one of our stylists.
			</p>
			<a href="/contact" class="inline-flex items-center px-8 py-4 bg-pink-bright text-black font-semibold rounded-lg hover:bg-pink-medium transition-colors">
				Book a Consultation
			</a>
		</div>
	</section>
</div>
