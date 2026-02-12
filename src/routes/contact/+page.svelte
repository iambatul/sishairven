<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { siteConfig } from '$lib/utils/seo';
	
	let formData = { name: '', email: '', subject: '', message: '' };
	let submitting = false;
	let submitStatus: 'idle' | 'success' | 'error' = 'idle';
</script>

<SEO 
	title="Contact Us"
	description="Get in touch with the Hairven by Elyn team. Questions about products, review requests, or partnership inquiries."
/>

<div class="min-h-screen" style="background-color: var(--bg-primary);">
	<!-- Hero -->
	<section class="relative py-14 sm:py-20 bg-gradient-to-b from-pink-bright/10">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
			<h1 class="text-4xl sm:text-5xl md:text-6xl font-handwritten text-pink-bright mb-4 sm:mb-6">Get in Touch</h1>
			<p class="text-base sm:text-xl max-w-2xl mx-auto" style="color: var(--text-secondary);">
				Have a question about a product? Want us to review something? We'd love to hear from you.
			</p>
		</div>
	</section>

	<section class="py-12 sm:py-16">
		<div class="max-w-5xl mx-auto px-4 sm:px-6">
			<div class="grid md:grid-cols-5 gap-8 sm:gap-12">
				<!-- Contact Info -->
				<div class="md:col-span-2 space-y-6">
					<div>
						<h3 class="font-semibold mb-2 text-sm sm:text-base" style="color: var(--text-primary);">Email Us</h3>
						<a href="mailto:{siteConfig.email}" class="text-pink-bright hover:underline text-sm sm:text-base">{siteConfig.email}</a>
					</div>
					<div>
						<h3 class="font-semibold mb-2 text-sm sm:text-base" style="color: var(--text-primary);">Follow Us</h3>
						<div class="flex gap-3">
							<a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" class="text-pink-bright hover:text-pink-medium transition-colors text-sm">Instagram</a>
							<span style="color: var(--text-muted);">·</span>
							<a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" class="text-pink-bright hover:text-pink-medium transition-colors text-sm">Facebook</a>
						</div>
					</div>
					<div>
						<h3 class="font-semibold mb-2 text-sm sm:text-base" style="color: var(--text-primary);">For Brands & PR</h3>
						<p class="text-sm" style="color: var(--text-muted);">Interested in having your product reviewed? Send us a message with details and we'll get back to you within 48 hours.</p>
					</div>
					<div>
						<h3 class="font-semibold mb-2 text-sm sm:text-base" style="color: var(--text-primary);">Response Time</h3>
						<p class="text-sm" style="color: var(--text-muted);">We typically respond within 1–2 business days.</p>
					</div>
				</div>

				<!-- Contact Form -->
				<div class="md:col-span-3">
					<form class="theme-card p-5 sm:p-8 space-y-5">
						<div class="grid sm:grid-cols-2 gap-4">
							<div>
								<label for="name" class="block text-sm font-medium mb-1.5" style="color: var(--text-primary);">Name</label>
								<input id="name" type="text" bind:value={formData.name} required
									class="w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:border-pink-bright text-sm transition-colors"
									style="background-color: var(--bg-input); border-color: var(--border-color); color: var(--text-primary);"
								/>
							</div>
							<div>
								<label for="email" class="block text-sm font-medium mb-1.5" style="color: var(--text-primary);">Email</label>
								<input id="email" type="email" bind:value={formData.email} required
									class="w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:border-pink-bright text-sm transition-colors"
									style="background-color: var(--bg-input); border-color: var(--border-color); color: var(--text-primary);"
								/>
							</div>
						</div>
						<div>
							<label for="subject" class="block text-sm font-medium mb-1.5" style="color: var(--text-primary);">Subject</label>
							<select id="subject" bind:value={formData.subject} required
								class="w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:border-pink-bright text-sm transition-colors"
								style="background-color: var(--bg-input); border-color: var(--border-color); color: var(--text-primary);">
								<option value="">Select a topic</option>
								<option value="product-question">Product Question</option>
								<option value="review-request">Review Request</option>
								<option value="partnership">Brand / PR Partnership</option>
								<option value="feedback">Feedback</option>
								<option value="other">Other</option>
							</select>
						</div>
						<div>
							<label for="message" class="block text-sm font-medium mb-1.5" style="color: var(--text-primary);">Message</label>
							<textarea id="message" bind:value={formData.message} rows="5" required
								class="w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:border-pink-bright text-sm transition-colors resize-none"
								style="background-color: var(--bg-input); border-color: var(--border-color); color: var(--text-primary);"></textarea>
						</div>
						{#if submitStatus === 'success'}
							<p class="text-sm text-green-500">Message sent! We'll get back to you soon.</p>
						{:else if submitStatus === 'error'}
							<p class="text-sm text-red-500">Something went wrong. Please email us directly.</p>
						{/if}
						<button type="submit" disabled={submitting}
							class="w-full sm:w-auto px-8 py-3 bg-pink-bright font-semibold rounded-lg hover:bg-pink-medium transition-colors text-sm disabled:opacity-50"
							style="color: var(--text-inverse);">
							{submitting ? 'Sending...' : 'Send Message'}
						</button>
					</form>
				</div>
			</div>
		</div>
	</section>
</div>
