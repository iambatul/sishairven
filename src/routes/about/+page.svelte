<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { generateLocalBusinessSchema } from '$lib/utils/seo';
	
	const schema = generateLocalBusinessSchema();
</script>

<SEO 
	title="About Us"
	description="Meet Elyn Makna and the team at Hairven by Elyn. Premium hair salon in Cortland, NY specializing in French Balayage, cuts, color, and beauty services."
	schema={schema}
/>

<div class="min-h-screen bg-[var(--bg-primary)]">
	<!-- Hero -->
	<section class="relative py-20 bg-gradient-to-b from-pink-bright/10 to-black">
		<div class="max-w-4xl mx-auto px-4 text-center">
			<h1 class="text-5xl md:text-6xl font-handwritten text-pink-bright mb-6">About Hairven by Elyn</h1>
			<p class="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
				Where beauty meets artistry. We've been transforming hair and building confidence in Cortland since 2018.
			</p>
		</div>
	</section>

	<!-- Our Story -->
	<section class="py-16">
		<div class="max-w-4xl mx-auto px-4">
			<div class="grid md:grid-cols-2 gap-12 items-center">
				<div>
					<h2 class="text-3xl font-display text-[var(--text-primary)] mb-6">Our Story</h2>
					<div class="space-y-4 text-[var(--text-secondary)]">
						<p>
							Welcome to <strong class="text-pink-bright">Hairven by Elyn</strong> — where every visit is an experience. 
							Founded by Elina Makna, our salon was built on a simple belief: that everyone deserves to feel 
							beautiful and confident.
						</p>
						<p>
							Born and raised in New York, Elina developed a natural flair for style and design from a young age. 
							Her experiences traveling and exploring different cultures have shaped her vision, giving the salon 
							a modern, eclectic feel that reflects both sophistication and playfulness.
						</p>
						<p>
							This is more than just a salon — it's a celebration of life, beauty, and discovery. Every service 
							is thoughtfully delivered to delight and inspire, ensuring that every visitor leaves feeling seen, 
							valued, and uplifted.
						</p>
					</div>
				</div>
				<div class="bg-[var(--bg-card)] p-8 rounded-lg border border-[var(--border-accent)]">
					<h3 class="text-2xl font-handwritten text-pink-bright mb-4">Why Choose Us?</h3>
					<ul class="space-y-4 text-[var(--text-secondary)]">
						<li class="flex items-start">
							<span class="text-pink-bright mr-3 text-xl">✓</span>
							<div>
								<strong class="text-[var(--text-primary)]">Expert Stylists</strong>
								<p class="text-sm text-[var(--text-muted)] mt-1">Our team is trained in the latest techniques including French Balayage.</p>
							</div>
						</li>
						<li class="flex items-start">
							<span class="text-pink-bright mr-3 text-xl">✓</span>
							<div>
								<strong class="text-[var(--text-primary)]">Premium Products</strong>
								<p class="text-sm text-[var(--text-muted)] mt-1">We use only the highest quality products from Moroccanoil, Kerastase, and more.</p>
							</div>
						</li>
						<li class="flex items-start">
							<span class="text-pink-bright mr-3 text-xl">✓</span>
							<div>
								<strong class="text-[var(--text-primary)]">Personalized Service</strong>
								<p class="text-sm text-[var(--text-muted)] mt-1">Every client receives a customized consultation and treatment plan.</p>
							</div>
						</li>
						<li class="flex items-start">
							<span class="text-pink-bright mr-3 text-xl">✓</span>
							<div>
								<strong class="text-[var(--text-primary)]">Relaxing Atmosphere</strong>
								<p class="text-sm text-[var(--text-muted)] mt-1">Our salon is designed to be your escape from the everyday.</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<!-- Our Specialization -->
	<section class="py-16 bg-[var(--bg-tertiary)]">
		<div class="max-w-4xl mx-auto px-4 text-center">
			<h2 class="text-3xl font-display text-[var(--text-primary)] mb-8">Our Specialization</h2>
			<div class="bg-pink-bright/10 border border-pink-bright/30 rounded-lg p-8">
				<h3 class="text-2xl font-handwritten text-pink-bright mb-4">French Balayage</h3>
				<p class="text-[var(--text-secondary)]">
					We specialize in the French technique of Balayage — a freehand hair coloring technique that creates 
					a natural, sun-kissed look with softer, less noticeable regrowth lines. Our stylists are trained in 
					this art form to give you that perfect, effortless glow.
				</p>
			</div>
		</div>
	</section>

	<!-- Visit Us CTA -->
	<section class="py-16">
		<div class="max-w-4xl mx-auto px-4 text-center">
			<h2 class="text-3xl font-display text-[var(--text-primary)] mb-6">Visit Us Today</h2>
			<p class="text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
				Step inside and discover a space where warmth, style, and joy come together. We can't wait to welcome you!
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/services" class="px-8 py-4 bg-pink-bright text-black font-semibold rounded-lg hover:bg-pink-medium transition-colors">
					View Our Services
				</a>
				<a href="/contact" class="px-8 py-4 border-2 border-pink-bright text-pink-bright font-semibold rounded-lg hover:bg-pink-bright hover:text-black transition-colors">
					Book an Appointment
				</a>
			</div>
		</div>
	</section>
</div>
