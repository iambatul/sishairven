<script lang="ts">
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { generateLocalBusinessSchema } from '$lib/utils/seo';
	
	let formData = {
		name: '',
		phone: '',
		email: '',
		service: '',
		date: '',
		message: ''
	};
	
	let submitting = false;
	let submitMessage = '';
	let submitError = '';
	
	// Background images
	const bgImages = [
		'/bg/bg1.webp',
		'/bg/bg2.webp',
		'/bg/bg3.webp',
		'/bg/bg4.webp',
		'/bg/bg5.webp'
	];
	
	let currentBgIndex = 0;
	
	// Collapsible sections state
	let expandedSections = {
		hair: false,
		nails: false,
		skincare: false,
		events: false
	};
	
	function toggleSection(section: 'hair' | 'nails' | 'skincare' | 'events') {
		expandedSections[section] = !expandedSections[section];
	}
	
	onMount(() => {
		if (typeof window !== 'undefined') {
		}
		
		// Cycle through background images
		if (typeof window !== 'undefined') {
			const interval = setInterval(() => {
				currentBgIndex = (currentBgIndex + 1) % bgImages.length;
			}, 5000); // Change every 5 seconds
			
			// Smooth scroll for anchor links
			const links = document.querySelectorAll('a[href^="#"]');
			const clickHandlers: Array<(e: Event) => void> = [];
			
			links.forEach(link => {
				const handler = (e: Event) => {
					e.preventDefault();
					const href = link.getAttribute('href');
					if (href) {
						scrollToSection(href.substring(1));
					}
				};
				clickHandlers.push(handler);
				link.addEventListener('click', handler);
			});
			
			// Cleanup on unmount
			return () => {
				clearInterval(interval);
				links.forEach((link, i) => {
					link.removeEventListener('click', clickHandlers[i]);
				});
			};
		}
	});
	
	async function handleSubmit(e: Event) {
		e.preventDefault();
		submitting = true;
		submitMessage = '';
		submitError = '';
		
		try {
			const response = await fetch('/api/book', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});
			
			const data = await response.json();
			
			if (response.ok) {
				submitMessage = data.message || 'Appointment request submitted successfully!';
				formData = {
					name: '',
					phone: '',
					email: '',
					service: '',
					date: '',
					message: ''
				};
			} else {
				submitError = data.error || 'Failed to submit appointment request';
			}
		} catch (error) {
			submitError = 'An error occurred. Please try again.';
			console.error(error);
		} finally {
			submitting = false;
		}
	}
	
	function scrollToSection(id: string) {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
</script>

<SEO 
	title="Premium Hair Salon & Beauty Services"
	description="Hairven by Elyn - Premier hair salon in Cortland, NY. Expert styling, French Balayage, coloring, nails, and skincare. Book your appointment today."
	schema={generateLocalBusinessSchema()}
/>

<!-- Call Button (Top Right) - Desktop Only -->
<div class="hidden md:block fixed top-4 right-4 z-50">
	<a
		href="tel:6072526610"
		class="btn-call"
	>
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
		</svg>
		<span class="hidden sm:inline">607.252.6610</span>
	</a>
</div>

<!-- Immersive Background -->
<div class="fixed inset-0 z-0 overflow-hidden">
	{#each bgImages as bg, index}
		<div 
			class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-2000 ease-in-out {index === currentBgIndex ? 'opacity-100' : 'opacity-0'}"
			style="background-image: url('{bg}');"
		></div>
	{/each}
	<div class="absolute inset-0 bg-black/70"></div>
</div>

<!-- Navigation -->
<nav class="fixed top-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-pink-bright/30">
	<div class="container-custom">
		<div class="flex items-center justify-between h-20 pr-4 md:pr-32">
			<div class="text-3xl sm:text-4xl md:text-6xl font-handwritten font-bold text-pink-bright drop-shadow-lg">
				Hairven by Elyn
			</div>
			<div class="hidden md:flex items-center space-x-8">
				<button on:click={() => scrollToSection('home')} class="text-[var(--text-secondary)] hover:text-pink-bright transition-colors">Home</button>
				<button on:click={() => scrollToSection('about')} class="text-[var(--text-secondary)] hover:text-pink-bright transition-colors">About</button>
				<button on:click={() => scrollToSection('services')} class="text-[var(--text-secondary)] hover:text-pink-bright transition-colors">Services</button>
				<button on:click={() => scrollToSection('book')} class="btn-primary">Book Online</button>
			</div>
			<div class="md:hidden">
				<button on:click={() => scrollToSection('book')} class="btn-primary text-sm px-4 py-2">Book</button>
			</div>
		</div>
	</div>
</nav>

<!-- Hero Section -->
<section id="home" class="relative pt-20 min-h-screen flex items-center z-10">
	<div class="container-custom relative z-10">
		<div class="text-center">
			<h1 class="heading-primary mb-6 drop-shadow-2xl text-pink-bright">Hairven by Elyn</h1>
			<p class="text-xl md:text-2xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto drop-shadow-lg">
				Where beauty meets artistry. Experience premium hair and beauty services in the heart of Cortland, NY.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<button on:click={() => scrollToSection('services')} class="btn-primary">View Services</button>
				<button on:click={() => scrollToSection('book')} class="btn-secondary">Book Appointment</button>
			</div>
		</div>
	</div>
</section>

<!-- About Section -->
<section id="about" class="relative section-padding z-10">
	<div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
	<div class="container-custom relative z-10">
		<h2 class="heading-secondary text-center mb-12 text-pink-bright drop-shadow-lg">About Us</h2>
		<div class="max-w-4xl mx-auto">
			<div class="prose prose-invert max-w-none">
				<p class="text-lg text-[var(--text-secondary)] leading-relaxed mb-6 drop-shadow">
					Welcome to <span class="text-pink-bright font-semibold">Hairven by Elyn</span>
				</p>
				<p class="text-[var(--text-secondary)] leading-relaxed mb-6 drop-shadow">
					At Hairven by Elyn, every corner radiates warmth, light, and carefully curated treasures. Known for her eye for detail and passion for creating joy through everyday beauty, Elina Makna has built a space that feels vibrant, welcoming, and full of life. "I wanted to create a store where every visit is an experience—whether you're exploring unique gifts, home essentials, or simply stopping by for a moment of inspiration," she says.
				</p>
				<p class="text-[var(--text-secondary)] leading-relaxed mb-6 drop-shadow">
					Born and raised in New York, Elina developed a natural flair for style and design from a young age. Her experiences traveling and exploring different cultures have shaped her vision, giving the store a modern, eclectic feel that reflects both sophistication and playfulness.
				</p>
				<p class="text-[var(--text-secondary)] leading-relaxed mb-6 drop-shadow">
					This is more than just a shop—it's a celebration of life, beauty, and discovery. Every product is thoughtfully chosen to delight and inspire, ensuring that every visitor leaves feeling seen, valued, and uplifted.
				</p>
				<p class="text-pink-medium text-lg font-semibold mt-8 drop-shadow">
					Step inside and discover a space where warmth, style, and joy come together.
				</p>
				<p class="text-pink-bright text-right mt-4 font-handwritten text-xl drop-shadow-lg">
					— Elina Makna, Owner & Chief Stylist
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Services Section -->
<section id="services" class="relative section-padding z-10">
	<div class="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>
	<div class="container-custom relative z-10">
		<h2 class="heading-secondary text-center mb-16 text-pink-bright drop-shadow-lg">Our Services</h2>
		
		<!-- Hair Services -->
		<div class="mb-16">
			<div class="service-image-container mb-8">
				<div class="flex items-center justify-center gap-3 mb-4">
					<span class="text-3xl">✂️</span>
					<h3 class="heading-secondary">Hair Services</h3>
				</div>
				<button
					on:click={() => toggleSection('hair')}
					class="w-full cursor-pointer hover:opacity-90 transition-opacity relative group"
					aria-label="Toggle Hair Services pricing"
				>
					<img src="/hair.WEBP" alt="Hair Services" class="w-full rounded-lg shadow-xl" />
					<div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 rounded-lg transition-colors flex items-center justify-center">
						<svg class="w-12 h-12 text-[var(--text-primary)] transform transition-transform {expandedSections.hair ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</button>
			</div>
			
			{#if expandedSections.hair}
			<div class="price-table-container animate-slideDown">
			<!-- Cut & Style -->
			<div class="mb-12">
				<h4 class="text-2xl font-semibold text-pink-bright mb-6 text-center">Cut & Style</h4>
				<div class="grid gap-4">
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Haircut</span>
							<span class="text-pink-bright font-bold text-lg">$184</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Blow-Dry</span>
							<span class="text-pink-bright font-bold text-lg">$124</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Updo</span>
							<span class="text-pink-bright font-bold text-lg">$184</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Extensions, Hair Pieces, Wig Cuts & Styling</span>
							<span class="text-pink-bright font-bold text-lg">By consultation</span>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Conditioning Treatments -->
			<div class="mb-12 price-table-container">
				<h4 class="text-2xl font-semibold text-pink-bright mb-6 text-center">Conditioning Treatments</h4>
				<div class="grid gap-4">
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Milbon Headspa</span>
							<span class="text-pink-bright font-bold text-lg">$289</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Milbon Smooth / Anti-Frizz</span>
							<span class="text-pink-bright font-bold text-lg">$169</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Milbon Repair</span>
							<span class="text-pink-bright font-bold text-lg">$189</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Various Milbon & Kerastase Professional Treatments</span>
							<span class="text-pink-bright font-bold text-lg">$209</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Shu Bar "The Ultimate"</span>
							<span class="text-pink-bright font-bold text-lg">$189</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Fusio-Dose</span>
							<span class="text-pink-bright font-bold text-lg">$94</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Olaplex</span>
							<span class="text-pink-bright font-bold text-lg">$79</span>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Color -->
			<div class="mb-12 price-table-container">
				<h4 class="text-2xl font-semibold text-pink-bright mb-6 text-center">Color</h4>
				<div class="grid gap-4">
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">One Process</span>
							<span class="text-pink-bright font-bold text-lg">$199</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">One Process with Partial Highlights</span>
							<span class="text-pink-bright font-bold text-lg">$252</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Partial Highlights</span>
							<span class="text-pink-bright font-bold text-lg">$279</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Full Highlights (Balayage/Foils)</span>
							<span class="text-pink-bright font-bold text-lg">$339</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Gloss</span>
							<span class="text-pink-bright font-bold text-lg">$109</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Two Process / Color Correction</span>
							<span class="text-pink-bright font-bold text-lg">By consultation</span>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Straightening Treatments -->
			<div class="mb-12 price-table-container">
				<h4 class="text-2xl font-semibold text-pink-bright mb-6 text-center">Straightening Treatments</h4>
				<div class="grid gap-4">
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Lasio Keratin / Magic Sleek</span>
							<span class="text-pink-bright font-bold text-lg">$649</span>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Elyn's Braids & Ponytails -->
			<div class="mb-12 price-table-container">
				<h4 class="text-2xl font-semibold text-pink-bright mb-6 text-center">Elyn's Braids & Ponytails</h4>
				<div class="grid gap-4">
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Dry Braiding/Ponytail</span>
							<span class="text-pink-bright font-bold text-lg">$74</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Wash, Blow-Dry & Braiding/Ponytail</span>
							<span class="text-pink-bright font-bold text-lg">$194</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Extension Ponytail</span>
							<span class="text-pink-bright font-bold text-lg">$111</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Custom Braiding/Ponytail</span>
							<span class="text-pink-bright font-bold text-lg">By consultation</span>
						</div>
					</div>
				</div>
			</div>
			</div>
			{/if}
		</div>
		
		<!-- Nail Services -->
		<div class="mb-16">
			<div class="service-image-container mb-8">
				<div class="flex items-center justify-center gap-3 mb-4">
					<span class="text-3xl">💅</span>
					<h3 class="heading-secondary">Nail Services</h3>
				</div>
				<button
					on:click={() => toggleSection('nails')}
					class="w-full cursor-pointer hover:opacity-90 transition-opacity relative group"
					aria-label="Toggle Nail Services pricing"
				>
					<img src="/nails.WEBP" alt="Nail Services" class="w-full rounded-lg shadow-xl" />
					<div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 rounded-lg transition-colors flex items-center justify-center">
						<svg class="w-12 h-12 text-[var(--text-primary)] transform transition-transform {expandedSections.nails ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</button>
			</div>
			{#if expandedSections.nails}
			<div class="price-table-container animate-slideDown">
				<div class="grid gap-4">
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Classic Manicure / Pedicure</span>
							<span class="text-pink-bright font-bold text-lg">$55 / $110</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Glue Manicure</span>
							<span class="text-pink-bright font-bold text-lg">$65</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Polish Change (Hands / Feet)</span>
							<span class="text-pink-bright font-bold text-lg">$35 / $50</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Shellac Manicure / Pedicure</span>
							<span class="text-pink-bright font-bold text-lg">$70 / $125</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Dazzle Dry Manicure / Pedicure</span>
							<span class="text-pink-bright font-bold text-lg">$75 / $130</span>
						</div>
					</div>
				</div>
			</div>
			{/if}
		</div>
		
		<!-- Skincare & Beauty -->
		<div class="mb-16">
			<div class="service-image-container mb-8">
				<div class="flex items-center justify-center gap-3 mb-4">
					<span class="text-3xl">✨</span>
					<h3 class="heading-secondary">Skincare & Beauty</h3>
				</div>
				<button
					on:click={() => toggleSection('skincare')}
					class="w-full cursor-pointer hover:opacity-90 transition-opacity relative group"
					aria-label="Toggle Skincare & Beauty pricing"
				>
					<img src="/skincare.WEBP" alt="Skincare & Beauty" class="w-full rounded-lg shadow-xl" />
					<div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 rounded-lg transition-colors flex items-center justify-center">
						<svg class="w-12 h-12 text-[var(--text-primary)] transform transition-transform {expandedSections.skincare ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</button>
			</div>
			
			{#if expandedSections.skincare}
			<div class="price-table-container animate-slideDown">
			<!-- Makeup -->
			<div class="mb-12">
				<h4 class="text-2xl font-semibold text-pink-bright mb-6 text-center">Makeup</h4>
				<div class="grid gap-4">
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Full Makeup Application</span>
							<span class="text-pink-bright font-bold text-lg">$175</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Fast Face Makeup Application</span>
							<span class="text-pink-bright font-bold text-lg">$105</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Makeup Lesson</span>
							<span class="text-pink-bright font-bold text-lg">$250/HR</span>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Brows & Lashes -->
			<div class="mb-12 price-table-container">
				<h4 class="text-2xl font-semibold text-pink-bright mb-6 text-center">Brows & Lashes</h4>
				<div class="grid gap-4">
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Brow Shaping (Tweezing or Waxing)</span>
							<span class="text-pink-bright font-bold text-lg">$85</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">False Eye Lashes</span>
							<span class="text-pink-bright font-bold text-lg">$85</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Chin / Lip / Nose & Ear Wax</span>
							<span class="text-pink-bright font-bold text-lg">$40</span>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Facials -->
			<div class="mb-12 price-table-container">
				<h4 class="text-2xl font-semibold text-pink-bright mb-6 text-center">Facials</h4>
				<div class="grid gap-4">
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Facials</span>
							<span class="text-pink-bright font-bold text-lg">$200</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Microcurrent / Galvanic/Bio Stim Add-On</span>
							<span class="text-pink-bright font-bold text-lg">$75</span>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Lash Extensions -->
			<div class="mb-12 price-table-container">
				<h4 class="text-2xl font-semibold text-pink-bright mb-6 text-center">Lash Extensions</h4>
				<div class="grid gap-4">
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Natural Set</span>
							<span class="text-pink-bright font-bold text-lg">$280</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Full Lash Set</span>
							<span class="text-pink-bright font-bold text-lg">$350</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Volume Set</span>
							<span class="text-pink-bright font-bold text-lg">$400</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Xtreme Volume Set</span>
							<span class="text-pink-bright font-bold text-lg">$450</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Refills (60min / 75min / 90min)</span>
							<span class="text-pink-bright font-bold text-lg">$160 / $180 / $200</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Removal</span>
							<span class="text-pink-bright font-bold text-lg">$75</span>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Body Waxing -->
			<div class="mb-12 price-table-container">
				<h4 class="text-2xl font-semibold text-pink-bright mb-6 text-center">Body Waxing</h4>
				<div class="grid gap-4">
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Brazilian</span>
							<span class="text-pink-bright font-bold text-lg">$95</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Bikini</span>
							<span class="text-pink-bright font-bold text-lg">$65</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Under Arms</span>
							<span class="text-pink-bright font-bold text-lg">$40</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Full Arms</span>
							<span class="text-pink-bright font-bold text-lg">$85</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">½ Leg / Full Leg</span>
							<span class="text-pink-bright font-bold text-lg">$75 / $105</span>
						</div>
					</div>
					<div class="price-card">
						<div class="flex justify-between items-center">
							<span class="text-gray-700 dark:text-[var(--text-secondary)]">Stomach</span>
							<span class="text-pink-bright font-bold text-lg">$50</span>
						</div>
					</div>
				</div>
			</div>
			</div>
			{/if}
		</div>
		
		<!-- Events and Special Services -->
		<div class="mb-16">
			<div class="service-image-container mb-8">
				<div class="flex items-center justify-center gap-3 mb-4">
					<span class="text-3xl">🎉</span>
					<h3 class="heading-secondary">Events and Special Services</h3>
				</div>
				<button
					on:click={() => toggleSection('events')}
					class="w-full cursor-pointer hover:opacity-90 transition-opacity relative group"
					aria-label="Toggle Events and Special Services pricing"
				>
					<img src="/events.WEBP" alt="Events" class="w-full rounded-lg shadow-xl" />
					<div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 rounded-lg transition-colors flex items-center justify-center">
						<svg class="w-12 h-12 text-[var(--text-primary)] transform transition-transform {expandedSections.events ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</button>
			</div>
			{#if expandedSections.events}
			<div class="price-table-container animate-slideDown">
				<div class="price-card text-center">
					<p class="text-lg text-gray-700 dark:text-[var(--text-secondary)] mb-4">
						<strong class="text-pink-bright">Weddings, Special Events, Group Events, Barrett's Braids</strong>
					</p>
					<p class="text-gray-700 dark:text-[var(--text-secondary)] mb-4">
						Contact to customize: <a href="tel:6072526610" class="text-pink-bright hover:text-pink-dark transition-colors font-semibold">607.252.6610</a>
					</p>
					<p class="text-[var(--text-muted)] dark:text-[var(--text-muted)] italic">(Pricing by consultation)</p>
				</div>
			</div>
			{/if}
		</div>
		
		<!-- Additional Information -->
		<div class="price-table-container">
			<div class="price-card">
				<h4 class="text-2xl font-semibold text-pink-bright mb-6">Additional Information</h4>
				<ul class="space-y-4 text-gray-700 dark:text-[var(--text-secondary)]">
					<li>
						<strong class="text-pink-bright">Specialization:</strong> The salon specializes in the French technique of <strong class="text-pink-medium">Balayage</strong>
					</li>
					<li>
						<strong class="text-pink-bright">Product Lines:</strong> Offers <strong class="text-pink-medium">Surratt Beauty</strong> and <strong class="text-pink-medium">111 Skin</strong> products for makeup and skincare services
					</li>
					<li>
						<strong class="text-pink-bright">Pricing Note:</strong> Prices are subject to change. Contact the salon directly at <a href="tel:6072526610" class="text-pink-bright hover:text-pink-dark transition-colors">607.252.6610</a> for current pricing and appointments
					</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- Hours & Location -->
<section id="hours" class="relative section-padding z-10">
	<div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
	<div class="container-custom relative z-10">
		<h2 class="heading-secondary text-center mb-12 text-pink-bright drop-shadow-lg">Hours & Location</h2>
		<div class="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
			<div>
				<h3 class="text-2xl font-semibold text-pink-bright mb-6 drop-shadow">Business Hours</h3>
				<div class="space-y-3 text-[var(--text-secondary)]">
					<div class="flex justify-between">
						<span>MONDAY</span>
						<span class="text-pink-bright font-semibold">9:00AM TO 6:00PM</span>
					</div>
					<div class="flex justify-between">
						<span>TUESDAY</span>
						<span class="text-pink-bright font-semibold">8:30AM TO 7:00PM</span>
					</div>
					<div class="flex justify-between">
						<span>WEDNESDAY</span>
						<span class="text-pink-bright font-semibold">8:30AM TO 7:00PM</span>
					</div>
					<div class="flex justify-between">
						<span>THURSDAY</span>
						<span class="text-pink-bright font-semibold">8:30AM TO 8:00PM</span>
					</div>
					<div class="flex justify-between">
						<span>FRIDAY</span>
						<span class="text-pink-bright font-semibold">8:30AM TO 7:00PM</span>
					</div>
					<div class="flex justify-between">
						<span>SATURDAY</span>
						<span class="text-pink-bright font-semibold">8:30AM TO 6:00PM</span>
					</div>
					<div class="flex justify-between">
						<span>SUNDAY</span>
						<span class="text-pink-medium">CLOSED</span>
					</div>
				</div>
			</div>
			<div>
				<h3 class="text-2xl font-semibold text-pink-bright mb-6 drop-shadow">Location</h3>
				<p class="text-lg text-[var(--text-secondary)] mb-4 drop-shadow">
					64 OWEGO ST<br />
					CORTLAND NY 13045
				</p>
				<p class="text-[var(--text-secondary)] mb-4 drop-shadow">
					Phone: <a href="tel:6072526610" class="text-pink-bright hover:text-pink-dark transition-colors font-semibold">607.252.6610</a>
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Book Online Section -->
<section id="book" class="relative section-padding z-10">
	<div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
	<div class="container-custom relative z-10">
		<h2 class="heading-secondary text-center mb-12 text-pink-bright drop-shadow-lg">Book Your Appointment</h2>
		<div class="max-w-2xl mx-auto">
			<form on:submit={handleSubmit} class="price-card space-y-6">
				<div>
					<label for="name" class="block text-pink-bright font-semibold mb-2">Name *</label>
					<input
						type="text"
						id="name"
						bind:value={formData.name}
						required
						class="w-full px-4 py-3 bg-black-light border-2 border-pink-bright/30 rounded-lg text-[var(--text-secondary)] focus:outline-none focus:border-pink-bright transition-colors"
					/>
				</div>
				
				<div>
					<label for="phone" class="block text-pink-bright font-semibold mb-2">Phone *</label>
					<input
						type="tel"
						id="phone"
						bind:value={formData.phone}
						required
						class="w-full px-4 py-3 bg-black-light border-2 border-pink-bright/30 rounded-lg text-[var(--text-secondary)] focus:outline-none focus:border-pink-bright transition-colors"
					/>
				</div>
				
				<div>
					<label for="email" class="block text-pink-bright font-semibold mb-2">Email *</label>
					<input
						type="email"
						id="email"
						bind:value={formData.email}
						required
						class="w-full px-4 py-3 bg-black-light border-2 border-pink-bright/30 rounded-lg text-[var(--text-secondary)] focus:outline-none focus:border-pink-bright transition-colors"
					/>
				</div>
				
				<div>
					<label for="service" class="block text-pink-bright font-semibold mb-2">Service *</label>
					<select
						id="service"
						bind:value={formData.service}
						required
						class="w-full px-4 py-3 bg-black-light border-2 border-pink-bright/30 rounded-lg text-[var(--text-secondary)] focus:outline-none focus:border-pink-bright transition-colors"
					>
						<option value="">Select a service</option>
						<optgroup label="Hair Services">
							<option value="Haircut">Haircut</option>
							<option value="Blow-Dry">Blow-Dry</option>
							<option value="Updo">Updo</option>
							<option value="One Process">One Process</option>
							<option value="Full Highlights">Full Highlights (Balayage/Foils)</option>
							<option value="Partial Highlights">Partial Highlights</option>
							<option value="Milbon Headspa">Milbon Headspa</option>
							<option value="Braiding/Ponytail">Braiding/Ponytail</option>
						</optgroup>
						<optgroup label="Nail Services">
							<option value="Classic Manicure">Classic Manicure</option>
							<option value="Classic Pedicure">Classic Pedicure</option>
							<option value="Shellac Manicure">Shellac Manicure</option>
						</optgroup>
						<optgroup label="Beauty Services">
							<option value="Full Makeup">Full Makeup Application</option>
							<option value="Brow Shaping">Brow Shaping</option>
							<option value="Lash Extensions">Lash Extensions</option>
							<option value="Facial">Facial</option>
						</optgroup>
						<option value="Other">Other / Consultation</option>
					</select>
				</div>
				
					<div>
						<label for="date" class="block text-pink-bright font-semibold mb-2">Preferred Date *</label>
						<input
							type="date"
							id="date"
							bind:value={formData.date}
							min={new Date().toISOString().split('T')[0]}
							max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
							required
							class="w-full px-4 py-3 bg-black-light border-2 border-pink-bright/30 rounded-lg text-[var(--text-secondary)] focus:outline-none focus:border-pink-bright transition-colors"
						/>
						<p class="text-xs text-[var(--text-muted)] mt-1">Appointments can be booked up to 3 months in advance</p>
					</div>
				
				<div>
					<label for="message" class="block text-pink-bright font-semibold mb-2">Message</label>
					<textarea
						id="message"
						bind:value={formData.message}
						rows="4"
						class="w-full px-4 py-3 bg-black-light border-2 border-pink-bright/30 rounded-lg text-[var(--text-secondary)] focus:outline-none focus:border-pink-bright transition-colors resize-none"
					></textarea>
				</div>
				
				{#if submitMessage}
					<div class="bg-green-900/30 border-2 border-green-500 rounded-lg p-4 text-green-300">
						{submitMessage}
					</div>
				{/if}
				
				{#if submitError}
					<div class="bg-red-900/30 border-2 border-red-500 rounded-lg p-4 text-red-300">
						{submitError}
					</div>
				{/if}
				
				<button
					type="submit"
					disabled={submitting}
					class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{submitting ? 'Submitting...' : 'Submit Appointment Request'}
				</button>
			</form>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="relative border-t border-pink-bright/30 py-8 z-10">
	<div class="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
	<div class="container-custom relative z-10">
		<div class="text-center text-[var(--text-secondary)]">
			<p class="text-2xl font-handwritten text-pink-bright mb-2 drop-shadow-lg">Hairven by Elyn</p>
			<p class="mb-2 drop-shadow">64 OWEGO ST, CORTLAND NY 13045</p>
			<p class="mb-4">
				<a href="tel:6072526610" class="text-pink-bright hover:text-pink-dark transition-colors font-semibold drop-shadow">607.252.6610</a>
			</p>
			<p class="text-sm text-[var(--text-muted)] drop-shadow">© {new Date().getFullYear()} Hairven by Elyn. All rights reserved.</p>
		</div>
	</div>
</footer>
