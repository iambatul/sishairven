<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO 
	title="About Us"
	description="Meet the team behind Hairven by Elyn. Professional stylists who test every product before recommending it to you. Honest reviews, real expertise."
/>

<div class="min-h-screen" style="background-color: var(--bg-primary);">
	<!-- Hero -->
	<section class="relative py-14 sm:py-20 bg-gradient-to-b from-pink-bright/10">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
			<h1 class="text-4xl sm:text-5xl md:text-6xl font-handwritten text-pink-bright mb-4 sm:mb-6">About Hairven by Elyn</h1>
			<p class="text-base sm:text-xl max-w-2xl mx-auto" style="color: var(--text-secondary);">
				Real stylists. Real testing. Honest picks.
			</p>
		</div>
	</section>

	<!-- Our Story -->
	<section class="py-12 sm:py-16">
		<div class="max-w-4xl mx-auto px-4 sm:px-6">
			<div class="grid md:grid-cols-2 gap-8 sm:gap-12 items-start">
				<div>
					<h2 class="text-2xl sm:text-3xl font-display mb-4 sm:mb-6" style="color: var(--text-primary);">Our Story</h2>
					<div class="space-y-4 text-sm sm:text-base" style="color: var(--text-secondary);">
						<p>
							<strong class="text-pink-bright">Hairven by Elyn</strong> started as a salon in Cortland, NY — and the products we use on our clients every day became the foundation of this site.
						</p>
						<p>
							After years of clients asking "What shampoo do you use?" and "Which hair dryer should I buy?", we decided to build something useful: a curated collection of the exact tools and treatments we trust in the chair.
						</p>
						<p>
							Every product on this site has been used on real clients, in a real salon, by working stylists. If it doesn't hold up under professional use, it doesn't make the cut.
						</p>
					</div>
				</div>
				<div class="theme-card p-6 sm:p-8">
					<h3 class="text-xl sm:text-2xl font-handwritten text-pink-bright mb-4">How We Pick Products</h3>
					<ul class="space-y-4" style="color: var(--text-secondary);">
						<li class="flex items-start gap-3">
							<span class="text-pink-bright text-lg mt-0.5">01</span>
							<div>
								<strong class="text-sm sm:text-base" style="color: var(--text-primary);">We Test In-Salon</strong>
								<p class="text-sm mt-1" style="color: var(--text-muted);">Every product gets weeks of real-world use before we review it.</p>
							</div>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-pink-bright text-lg mt-0.5">02</span>
							<div>
								<strong class="text-sm sm:text-base" style="color: var(--text-primary);">We Compare Honestly</strong>
								<p class="text-sm mt-1" style="color: var(--text-muted);">We'll tell you when a $40 tool outperforms a $400 one.</p>
							</div>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-pink-bright text-lg mt-0.5">03</span>
							<div>
								<strong class="text-sm sm:text-base" style="color: var(--text-primary);">We Update Regularly</strong>
								<p class="text-sm mt-1" style="color: var(--text-muted);">Reviews are refreshed as we discover better options.</p>
							</div>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-pink-bright text-lg mt-0.5">04</span>
							<div>
								<strong class="text-sm sm:text-base" style="color: var(--text-primary);">We Disclose Everything</strong>
								<p class="text-sm mt-1" style="color: var(--text-muted);">We earn from Amazon links — you pay zero extra. Full transparency.</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<!-- Meet Elyn -->
	<section class="py-12 sm:py-16" style="background-color: var(--bg-tertiary);">
		<div class="max-w-3xl mx-auto px-4 sm:px-6 text-center">
			<h2 class="text-2xl sm:text-3xl font-display mb-4 sm:mb-6" style="color: var(--text-primary);">Meet Elyn</h2>
			<div class="theme-card p-6 sm:p-8 text-left">
				<p class="text-sm sm:text-base mb-4" style="color: var(--text-secondary);">
					Elina "Elyn" Makna has been a licensed stylist for over 8 years, specializing in French Balayage, color correction, and transformative cuts. Born and raised in New York, she developed a passion for beauty that blends global influences with classic technique.
				</p>
				<p class="text-sm sm:text-base" style="color: var(--text-secondary);">
					When she's not behind the chair, she's testing the latest tools, writing reviews, and helping people find the right products for their hair type — without the inflated marketing speak.
				</p>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="py-12 sm:py-16">
		<div class="max-w-3xl mx-auto px-4 sm:px-6 text-center">
			<h2 class="text-2xl sm:text-3xl font-display mb-3" style="color: var(--text-primary);">Ready to Find Your Products?</h2>
			<p class="mb-6 text-sm sm:text-base" style="color: var(--text-muted);">
				Browse our curated picks or dive into our latest reviews.
			</p>
			<div class="flex flex-col sm:flex-row gap-3 justify-center">
				<a href="/shop" class="px-8 py-3 bg-pink-bright font-semibold rounded-lg hover:bg-pink-medium transition-colors text-sm sm:text-base" style="color: var(--text-inverse);">
					Shop Products
				</a>
				<a href="/blog" class="px-8 py-3 border-2 border-pink-bright text-pink-bright font-semibold rounded-lg hover:bg-pink-bright hover:text-black transition-colors text-sm sm:text-base">
					Read Reviews
				</a>
			</div>
		</div>
	</section>
</div>
