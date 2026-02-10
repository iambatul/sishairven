<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	
	const services = [
		{
			icon: '✂️',
			title: 'Hair Services',
			description: 'From precision cuts to stunning color, our expert stylists create looks that enhance your natural beauty.',
			items: [
				{ name: 'Haircut', price: '$184' },
				{ name: 'Blow-Dry', price: '$124' },
				{ name: 'Updo', price: '$184' },
				{ name: 'One Process Color', price: '$199' },
				{ name: 'Full Highlights (Balayage/Foils)', price: '$339' },
				{ name: 'Partial Highlights', price: '$279' }
			],
			link: '/#services'
		},
		{
			icon: '💅',
			title: 'Nail Services',
			description: 'Pamper yourself with our range of manicure and pedicure services using premium products.',
			items: [
				{ name: 'Classic Manicure', price: '$55' },
				{ name: 'Classic Pedicure', price: '$110' },
				{ name: 'Shellac Manicure', price: '$70' },
				{ name: 'Shellac Pedicure', price: '$125' },
				{ name: 'Dazzle Dry Manicure', price: '$75' },
				{ name: 'Dazzle Dry Pedicure', price: '$130' }
			],
			link: '/#services'
		},
		{
			icon: '✨',
			title: 'Skincare & Beauty',
			description: 'Complete your look with our beauty services including makeup, lashes, and waxing.',
			items: [
				{ name: 'Full Makeup Application', price: '$175' },
				{ name: 'Brow Shaping', price: '$85' },
				{ name: 'Lash Extensions (Natural Set)', price: '$280' },
				{ name: 'Lash Extensions (Full Set)', price: '$350' },
				{ name: 'Facial', price: '$200' },
				{ name: 'Brazilian Wax', price: '$95' }
			],
			link: '/#services'
		},
		{
			icon: '🌿',
			title: 'Treatments',
			description: 'Restore and rejuvenate your hair with our professional conditioning and smoothing treatments.',
			items: [
				{ name: 'Milbon Headspa', price: '$289' },
				{ name: 'Olaplex Treatment', price: '$79' },
				{ name: 'Fusio-Dose', price: '$94' },
				{ name: 'Lasio Keratin Treatment', price: '$649' },
				{ name: 'Milbon Smooth Treatment', price: '$169' },
				{ name: 'Shu Bar "The Ultimate"', price: '$189' }
			],
			link: '/#services'
		}
	];
</script>

<SEO 
	title="Our Services"
	description="Explore our full range of hair, nail, and beauty services at Hairven by Elyn. French Balayage specialists in Cortland, NY."
/>

<div class="min-h-screen bg-black">
	<!-- Hero -->
	<section class="relative py-20 bg-gradient-to-b from-pink-bright/10 to-black">
		<div class="max-w-4xl mx-auto px-4 text-center">
			<h1 class="text-5xl md:text-6xl font-handwritten text-pink-bright mb-6">Our Services</h1>
			<p class="text-xl text-gray-light max-w-2xl mx-auto">
				From French Balayage to relaxing spa treatments, discover services designed to enhance your natural beauty.
			</p>
		</div>
	</section>

	<!-- Services Grid -->
	<section class="py-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid md:grid-cols-2 gap-8">
				{#each services as service}
					<div class="bg-black-soft/50 rounded-lg p-8 border border-pink-bright/20">
						<div class="text-4xl mb-4">{service.icon}</div>
						<h2 class="text-2xl font-display text-white mb-3">{service.title}</h2>
						<p class="text-gray-medium mb-6">{service.description}</p>
						
						<ul class="space-y-3 mb-6">
							{#each service.items as item}
								<li class="flex justify-between text-gray-light">
									<span>{item.name}</span>
									<span class="text-pink-bright font-medium">{item.price}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Specialization -->
	<section class="py-16 bg-pink-bright/10">
		<div class="max-w-4xl mx-auto px-4 text-center">
			<h2 class="text-3xl font-display text-white mb-6">French Balayage Specialists</h2>
			<p class="text-gray-light mb-8">
				Our signature service. The French technique of Balayage creates a natural, sun-kissed look 
				with softer, less noticeable regrowth lines. Our stylists are trained in this art form 
				to give you that perfect, effortless glow.
			</p>
			<a href="/contact" class="inline-flex items-center px-8 py-4 bg-pink-bright text-black font-semibold rounded-lg hover:bg-pink-medium transition-colors">
				Book a Balayage Consultation
			</a>
		</div>
	</section>

	<!-- CTA -->
	<section class="py-16">
		<div class="max-w-4xl mx-auto px-4 text-center">
			<h2 class="text-3xl font-display text-white mb-6">Ready to Book?</h2>
			<p class="text-gray-light mb-8">
				Contact us to schedule your appointment or consultation.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/contact" class="px-8 py-4 bg-pink-bright text-black font-semibold rounded-lg hover:bg-pink-medium transition-colors">
					Book Online
				</a>
				<a href="tel:6072526610" class="px-8 py-4 border-2 border-pink-bright text-pink-bright font-semibold rounded-lg hover:bg-pink-bright hover:text-black transition-colors">
					Call 607-252-6610
				</a>
			</div>
		</div>
	</section>
</div>
