<script lang="ts">
	import { siteConfig } from '$lib/utils/seo';
	import { amazonConfig } from '$lib/utils/amazon';
	import { onMount } from 'svelte';
	
	let email = '';
	let subscribeStatus: 'idle' | 'submitting' | 'success' | 'error' = 'idle';
	let subscribeMessage = '';
	
	async function handleSubscribe(e: Event) {
		e.preventDefault();
		if (!email || !email.includes('@')) return;
		
		subscribeStatus = 'submitting';
		
		try {
			const response = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});
			
			if (response.ok) {
				subscribeStatus = 'success';
				subscribeMessage = 'Thanks for subscribing! Check your inbox soon.';
				email = '';
			} else {
				throw new Error('Subscription failed');
			}
		} catch (err) {
			subscribeStatus = 'error';
			subscribeMessage = 'Something went wrong. Please try again.';
		}
	}
</script>

<footer style="background-color: var(--bg-secondary); border-color: var(--border-accent);" class="border-t">
	<!-- Main Footer -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="grid md:grid-cols-4 gap-8">
			<!-- Brand -->
			<div class="md:col-span-1">
				<h3 class="text-2xl font-handwritten text-pink-bright mb-4">Hairven by Elyn</h3>
				<p class="text-sm mb-4" style="color: var(--text-muted);">
					Premium hair salon and beauty services in Cortland, NY. Expert styling, coloring, and skincare.
				</p>
				<div class="space-y-2 text-sm" style="color: var(--text-muted);">
					<p>{siteConfig.address.street}</p>
					<p>{siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}</p>
					<p>
						<a href="tel:{siteConfig.phone}" class="text-pink-bright hover:underline">{siteConfig.phone}</a>
					</p>
				</div>
			</div>
			
			<!-- Quick Links -->
			<div>
				<h4 class="font-semibold mb-4" style="color: var(--text-primary);">Quick Links</h4>
				<ul class="space-y-2 text-sm">
					<li><a href="/about" class="hover:text-pink-bright transition-colors" style="color: var(--text-muted);">About Us</a></li>
					<li><a href="/services" class="hover:text-pink-bright transition-colors" style="color: var(--text-muted);">Services</a></li>
					<li><a href="/shop" class="hover:text-pink-bright transition-colors" style="color: var(--text-muted);">Shop Products</a></li>
					<li><a href="/blog" class="hover:text-pink-bright transition-colors" style="color: var(--text-muted);">Beauty Blog</a></li>
					<li><a href="/contact" class="hover:text-pink-bright transition-colors" style="color: var(--text-muted);">Contact</a></li>
				</ul>
			</div>
			
			<!-- Legal -->
			<div>
				<h4 class="font-semibold mb-4" style="color: var(--text-primary);">Legal</h4>
				<ul class="space-y-2 text-sm">
					<li><a href="/privacy" class="hover:text-pink-bright transition-colors" style="color: var(--text-muted);">Privacy Policy</a></li>
					<li><a href="/terms" class="hover:text-pink-bright transition-colors" style="color: var(--text-muted);">Terms of Service</a></li>
					<li><a href="/affiliate-disclosure" class="hover:text-pink-bright transition-colors" style="color: var(--text-muted);">Affiliate Disclosure</a></li>
				</ul>
			</div>
			
			<!-- Newsletter -->
			<div>
				<h4 class="font-semibold mb-4" style="color: var(--text-primary);">Stay Updated</h4>
				<p class="text-sm mb-4" style="color: var(--text-muted);">Get beauty tips and exclusive offers.</p>
				<form on:submit={handleSubscribe} class="space-y-2">
					<input 
						type="email"
						bind:value={email}
						placeholder="Your email address"
						required
						class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-bright text-sm transition-colors"
						style="background-color: var(--bg-input); border-color: var(--border-color); color: var(--text-primary);"
					/>
					<button 
						type="submit"
						disabled={subscribeStatus === 'submitting'}
						class="w-full px-4 py-2 bg-pink-bright font-medium rounded-lg hover:bg-pink-medium transition-colors text-sm disabled:opacity-50"
						style="color: var(--text-inverse);"
					>
						{subscribeStatus === 'submitting' ? 'Subscribing...' : 'Subscribe'}
					</button>
				</form>
				{#if subscribeStatus === 'success' || subscribeStatus === 'error'}
					<p class="text-xs mt-2 {subscribeStatus === 'success' ? 'text-green-500' : 'text-red-500'}">
						{subscribeMessage}
					</p>
				{/if}
			</div>
		</div>
	</div>
	
	<!-- Affiliate Disclosure Bar -->
	<div class="border-t" style="border-color: var(--border-color);">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<p class="text-xs text-center" style="color: var(--text-muted);">
				{amazonConfig.disclosure} 
				<a href="/affiliate-disclosure" class="text-pink-bright hover:underline">Learn more</a>
			</p>
		</div>
	</div>
	
	<!-- Copyright -->
	<div class="border-t" style="border-color: var(--border-color);">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<p class="text-sm text-center" style="color: var(--text-muted);">
				© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
			</p>
		</div>
	</div>
</footer>
