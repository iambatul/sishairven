<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { siteConfig } from '$lib/utils/seo';
	
	let formData = {
		name: '',
		email: '',
		phone: '',
		subject: '',
		message: ''
	};
	
	let submitting = false;
	let submitStatus: 'idle' | 'success' | 'error' = 'idle';
	let submitMessage = '';
	
	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;
		submitStatus = 'idle';
		
		try {
			// In production, this would send to a backend service
			// For now, we'll simulate success
			await new Promise(resolve => setTimeout(resolve, 1000));
			submitStatus = 'success';
			submitMessage = 'Thank you for your message! We\'ll get back to you within 24 hours.';
			formData = { name: '', email: '', phone: '', subject: '', message: '' };
		} catch (err) {
			submitStatus = 'error';
			submitMessage = 'Something went wrong. Please try again or call us directly.';
		} finally {
			submitting = false;
		}
	}
</script>

<SEO 
	title="Contact Us"
	description="Get in touch with Hairven by Elyn. Book an appointment, ask questions, or visit our salon at 64 Owego St, Cortland, NY. Call 607-252-6610."
/>

<div class="min-h-screen bg-[var(--bg-primary)]">
	<!-- Hero -->
	<section class="relative py-20 bg-gradient-to-b from-pink-bright/10 to-black">
		<div class="max-w-4xl mx-auto px-4 text-center">
			<h1 class="text-5xl md:text-6xl font-handwritten text-pink-bright mb-6">Contact Us</h1>
			<p class="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
				Have questions or ready to book? We'd love to hear from you.
			</p>
		</div>
	</section>

	<!-- Contact Info & Form -->
	<section class="py-16">
		<div class="max-w-6xl mx-auto px-4">
			<div class="grid md:grid-cols-2 gap-12">
				<!-- Contact Info -->
				<div>
					<h2 class="text-2xl font-display text-[var(--text-primary)] mb-8">Get in Touch</h2>
					
					<div class="space-y-6">
						<div class="flex items-start">
							<div class="w-12 h-12 bg-pink-bright/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<svg class="w-6 h-6 text-pink-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
								</svg>
							</div>
							<div class="ml-4">
								<h3 class="text-[var(--text-primary)] font-semibold">Phone</h3>
								<p class="text-[var(--text-secondary)]">
									<a href="tel:{siteConfig.phone}" class="text-pink-bright hover:underline">{siteConfig.phone}</a>
								</p>
								<p class="text-sm text-[var(--text-muted)] mt-1">Mon-Sat during business hours</p>
							</div>
						</div>
						
						<div class="flex items-start">
							<div class="w-12 h-12 bg-pink-bright/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<svg class="w-6 h-6 text-pink-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
								</svg>
							</div>
							<div class="ml-4">
								<h3 class="text-[var(--text-primary)] font-semibold">Location</h3>
								<p class="text-[var(--text-secondary)]">{siteConfig.address.street}</p>
								<p class="text-[var(--text-secondary)]">{siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}</p>
							</div>
						</div>
						
						<div class="flex items-start">
							<div class="w-12 h-12 bg-pink-bright/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<svg class="w-6 h-6 text-pink-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
								</svg>
							</div>
							<div class="ml-4">
								<h3 class="text-[var(--text-primary)] font-semibold">Hours</h3>
								<div class="text-[var(--text-secondary)] text-sm space-y-1 mt-1">
									<div class="flex justify-between"><span>Mon:</span> <span>9am - 6pm</span></div>
									<div class="flex justify-between"><span>Tue-Wed:</span> <span>8:30am - 7pm</span></div>
									<div class="flex justify-between"><span>Thu:</span> <span>8:30am - 8pm</span></div>
									<div class="flex justify-between"><span>Fri:</span> <span>8:30am - 7pm</span></div>
									<div class="flex justify-between"><span>Sat:</span> <span>8:30am - 6pm</span></div>
									<div class="flex justify-between"><span>Sun:</span> <span class="text-[var(--text-muted)]">Closed</span></div>
								</div>
							</div>
						</div>
					</div>
					
					<div class="mt-8 pt-8 border-t border-[var(--border-color)]">
						<h3 class="text-[var(--text-primary)] font-semibold mb-4">Follow Us</h3>
						<div class="flex space-x-4">
							<a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" class="text-[var(--text-secondary)] hover:text-pink-bright transition-colors">
								<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
							</a>
							<a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" class="text-[var(--text-secondary)] hover:text-pink-bright transition-colors">
								<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
							</a>
						</div>
					</div>
				</div>
				
				<!-- Contact Form -->
				<div class="bg-[var(--bg-card)] p-8 rounded-lg border border-[var(--border-accent)]">
					<h2 class="text-2xl font-display text-[var(--text-primary)] mb-6">Send Us a Message</h2>
					
					<form on:submit={handleSubmit} class="space-y-6">
						<div>
							<label for="name" class="block text-pink-bright font-medium mb-2">Name *</label>
							<input
								type="text"
								id="name"
								bind:value={formData.name}
								required
								class="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-pink-bright transition-colors"
							/>
						</div>
						
						<div class="grid md:grid-cols-2 gap-4">
							<div>
								<label for="email" class="block text-pink-bright font-medium mb-2">Email *</label>
								<input
									type="email"
									id="email"
									bind:value={formData.email}
									required
									class="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-pink-bright transition-colors"
								/>
							</div>
							<div>
								<label for="phone" class="block text-pink-bright font-medium mb-2">Phone</label>
								<input
									type="tel"
									id="phone"
									bind:value={formData.phone}
									class="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-pink-bright transition-colors"
								/>
							</div>
						</div>
						
						<div>
							<label for="subject" class="block text-pink-bright font-medium mb-2">Subject *</label>
							<select
								id="subject"
								bind:value={formData.subject}
								required
								class="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-pink-bright transition-colors"
							>
								<option value="">Select a subject</option>
								<option value="booking">Book an Appointment</option>
								<option value="question">General Question</option>
								<option value="feedback">Feedback</option>
								<option value="partnership">Partnership Inquiry</option>
								<option value="other">Other</option>
							</select>
						</div>
						
						<div>
							<label for="message" class="block text-pink-bright font-medium mb-2">Message *</label>
							<textarea
								id="message"
								bind:value={formData.message}
								required
								rows="5"
								class="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-pink-bright transition-colors resize-none"
							></textarea>
						</div>
						
						{#if submitStatus !== 'idle'}
							<div class="p-4 rounded-lg {submitStatus === 'success' ? 'bg-green-900/30 border border-green-500 text-green-300' : 'bg-red-900/30 border border-red-500 text-red-300'}">
								{submitMessage}
							</div>
						{/if}
						
						<button
							type="submit"
							disabled={submitting}
							class="w-full py-4 bg-pink-bright text-black font-semibold rounded-lg hover:bg-pink-medium transition-colors disabled:opacity-50"
						>
							{submitting ? 'Sending...' : 'Send Message'}
						</button>
					</form>
				</div>
			</div>
		</div>
	</section>
</div>
