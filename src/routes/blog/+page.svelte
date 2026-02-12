<script>
	import SEO from '$lib/components/SEO.svelte';
	import { posts, formatDate, getPublishedPosts } from '$lib/content/posts';
	
	const publishedPosts = getPublishedPosts();
	const categories = [...new Set(posts.map(p => p.category))];
</script>

<SEO 
	title="Beauty Blog"
	description="Expert hair care tips, product reviews, and styling advice from the professional stylists at Hairven by Elyn."
/>

<div class="min-h-screen bg-[var(--bg-primary)]">
	<!-- Hero -->
	<section class="relative py-20 bg-gradient-to-b from-pink-bright/10 to-black">
		<div class="max-w-4xl mx-auto px-4 text-center">
			<h1 class="text-5xl md:text-6xl font-handwritten text-pink-bright mb-6">Beauty Blog</h1>
			<p class="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
				Expert advice, product reviews, and styling tips from our professional stylists.
			</p>
		</div>
	</section>

	<!-- Categories -->
	<section class="py-8 border-b border-[var(--border-color)]">
		<div class="max-w-7xl mx-auto px-4">
			<div class="flex flex-wrap gap-3 justify-center">
				<a href="/blog" class="px-4 py-2 bg-pink-bright text-black rounded-full text-sm font-medium">
					All Posts
				</a>
				{#each categories as category}
					<span class="px-4 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-full text-sm">
						{category}
					</span>
				{/each}
			</div>
		</div>
	</section>

	<!-- Blog Posts Grid -->
	<section class="py-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each publishedPosts as post}
					<article class="bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-accent)] hover:border-pink-bright/40 transition-colors">
						<!-- Post Image Placeholder -->
						<div class="aspect-video bg-gradient-to-br from-pink-bright/20 to-pink-dark/20 flex items-center justify-center">
							<span class="text-4xl">✨</span>
						</div>
						
						<div class="p-6">
							<!-- Category & Date -->
							<div class="flex items-center gap-3 mb-3">
								<span class="px-3 py-1 bg-pink-bright/10 text-pink-bright text-xs font-medium rounded-full">
									{post.category}
								</span>
								<span class="text-[var(--text-muted)] text-sm">{formatDate(post.date)}</span>
							</div>
							
							<!-- Title & Excerpt -->
							<h2 class="text-xl font-semibold text-[var(--text-primary)] mb-3 hover:text-pink-bright transition-colors">
								<a href="/blog/{post.slug}">{post.title}</a>
							</h2>
							<p class="text-[var(--text-muted)] text-sm mb-4 line-clamp-3">{post.description}</p>
							
							<!-- Meta -->
							<div class="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
								<span class="text-[var(--text-muted)] text-sm">By {post.author}</span>
								<span class="text-[var(--text-muted)] text-sm">{post.readingTime} min read</span>
							</div>
							
							<!-- Read More -->
							<a 
								href="/blog/{post.slug}"
								class="mt-4 inline-flex items-center text-pink-bright hover:text-pink-medium transition-colors"
							>
								Read Article
								<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
	<section class="py-16 bg-pink-bright/10">
		<div class="max-w-4xl mx-auto px-4 text-center">
			<h2 class="text-3xl font-display text-[var(--text-primary)] mb-4">Get Beauty Tips in Your Inbox</h2>
			<p class="text-[var(--text-secondary)] mb-8">
				Subscribe for weekly styling tips, product recommendations, and exclusive offers.
			</p>
			<form class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" on:submit|preventDefault>
				<input 
					type="email"
					placeholder="Your email address"
					class="flex-1 px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-gray-medium focus:outline-none focus:border-pink-bright"
				/>
				<button 
					type="submit"
					class="px-6 py-3 bg-pink-bright text-black font-semibold rounded-lg hover:bg-pink-medium transition-colors"
				>
					Subscribe
				</button>
			</form>
		</div>
	</section>
</div>
