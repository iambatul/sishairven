<script>
	import SEO from '$lib/components/SEO.svelte';
	import { posts, formatDate, getPublishedPosts } from '$lib/content/posts';
	
	const publishedPosts = getPublishedPosts();
	const categories = [...new Set(posts.map(p => p.category))];
</script>

<SEO 
	title="Reviews & Guides"
	description="In-depth product reviews, comparisons, and styling guides from the professional stylists at Hairven by Elyn."
/>

<div class="min-h-screen" style="background-color: var(--bg-primary);">
	<!-- Hero -->
	<section class="relative py-14 sm:py-20 bg-gradient-to-b from-pink-bright/10">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
			<h1 class="text-4xl sm:text-5xl md:text-6xl font-handwritten text-pink-bright mb-4 sm:mb-6">Reviews & Guides</h1>
			<p class="text-base sm:text-xl max-w-2xl mx-auto" style="color: var(--text-secondary);">
				Honest product reviews, head-to-head comparisons, and styling tips — tested in our salon.
			</p>
		</div>
	</section>

	<!-- Categories -->
	<section class="py-5 sm:py-6 border-b" style="border-color: var(--border-color);">
		<div class="max-w-7xl mx-auto px-4 sm:px-6">
			<div class="flex flex-wrap gap-2 sm:gap-3 justify-center">
				<a href="/blog" class="px-3 sm:px-4 py-1.5 sm:py-2 bg-pink-bright rounded-full text-xs sm:text-sm font-medium" style="color: var(--text-inverse);">
					All Posts
				</a>
				{#each categories as category}
					<span class="px-3 sm:px-4 py-1.5 sm:py-2 border rounded-full text-xs sm:text-sm" style="border-color: var(--border-color); color: var(--text-secondary);">
						{category}
					</span>
				{/each}
			</div>
		</div>
	</section>

	<!-- Blog Posts Grid -->
	<section class="py-10 sm:py-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
				{#each publishedPosts as post}
					<article class="theme-card group">
						<!-- Post Image -->
						<div class="aspect-video overflow-hidden" style="background: linear-gradient(135deg, rgba(255,20,147,0.15), rgba(199,21,133,0.15));">
							{#if post.image}
								<img src={post.image} alt={post.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
							{:else}
								<div class="w-full h-full flex items-center justify-center">
									<span class="text-3xl sm:text-4xl">✨</span>
								</div>
							{/if}
						</div>
						
						<div class="p-4 sm:p-6">
							<!-- Category & Date -->
							<div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
								<span class="px-2 sm:px-3 py-0.5 sm:py-1 bg-pink-bright/10 text-pink-bright text-xs font-medium rounded-full">
									{post.category}
								</span>
								<span class="text-xs sm:text-sm" style="color: var(--text-muted);">{formatDate(post.date)}</span>
							</div>
							
							<!-- Title & Excerpt -->
							<h2 class="text-base sm:text-lg font-semibold mb-2 group-hover:text-pink-bright transition-colors" style="color: var(--text-primary);">
								<a href="/blog/{post.slug}">{post.title}</a>
							</h2>
							<p class="text-sm mb-3 sm:mb-4 line-clamp-2" style="color: var(--text-muted);">{post.description}</p>
							
							<!-- Meta -->
							<div class="flex items-center justify-between pt-3 sm:pt-4 border-t" style="border-color: var(--border-color);">
								<span class="text-xs sm:text-sm" style="color: var(--text-muted);">By {post.author}</span>
								<span class="text-xs sm:text-sm" style="color: var(--text-muted);">{post.readingTime} min</span>
							</div>
							
							<a href="/blog/{post.slug}" class="mt-3 sm:mt-4 inline-flex items-center text-pink-bright hover:text-pink-medium transition-colors text-sm">
								Read Article
								<svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
								</svg>
							</a>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- Newsletter CTA -->
	<section class="py-12 sm:py-16 bg-pink-bright/10">
		<div class="max-w-2xl mx-auto px-4 sm:px-6 text-center">
			<h2 class="text-2xl sm:text-3xl font-display mb-3" style="color: var(--text-primary);">Get Deals & Tips in Your Inbox</h2>
			<p class="mb-6 text-sm sm:text-base" style="color: var(--text-muted);">
				Weekly product picks, sale alerts, and styling tips. No spam.
			</p>
			<form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" on:submit|preventDefault>
				<input 
					type="email"
					placeholder="you@email.com"
					class="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:border-pink-bright text-sm"
					style="background-color: var(--bg-input); border-color: var(--border-color); color: var(--text-primary);"
				/>
				<button type="submit" class="px-6 py-3 bg-pink-bright font-semibold rounded-lg hover:bg-pink-medium transition-colors text-sm whitespace-nowrap" style="color: var(--text-inverse);">
					Subscribe
				</button>
			</form>
		</div>
	</section>
</div>
