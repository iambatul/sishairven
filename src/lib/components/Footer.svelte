<script lang="ts">
	import { siteConfig } from '$lib/utils/seo';
	import { amazonConfig } from '$lib/utils/amazon';
	
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
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
			<!-- Brand -->
			<div class="col-span-2 md:col-span-1">
				<h3 class="text-xl sm:text-2xl font-handwritten text-pink-bright mb-3">Hairven by Elyn</h3>
				<p class="text-sm mb-3" style="color: var(--text-muted);">
					Curated hair tools, treatments, and styling products — tested and approved by professional stylists.
				</p>
				<div class="flex gap-3 mt-3">
					<a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" class="text-pink-bright hover:text-pink-medium transition-colors" aria-label="Instagram">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
					</a>
					<a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" class="text-pink-bright hover:text-pink-medium transition-colors" aria-label="Facebook">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
					</a>
				</div>
			</div>
			
			<!-- Explore -->
			<div>
				<h4 class="font-semibold mb-3 text-sm" style="color: var(--text-primary);">Explore</h4>
				<ul class="space-y-2 text-sm">
					<li><a href="/shop" class="hover:text-pink-bright transition-colors" style="color: var(--text-muted);">Shop Products</a></li>
					<li><a href="/blog" class="hover:text-pink-bright transition-colors" style="color: var(--text-muted);">Beauty Blog</a></li>
					<li><a href="/about" class="hover:text-pink-bright transition-colors" style="color: var(--text-muted);">About Us</a></li>
					<li><a href="/contact" class="hover:text-pink-bright transition-colors" style="color: var(--text-muted);">Contact</a></li>
				</ul>
			</div>
			
			<!-- Legal -->
			<div>
				<h4 class="font-semibold mb-3 text-sm" style="color: var(--text-primary);">Legal</h4>
				<ul class="space-y-2 text-sm">
					<li><a href="/privacy" class="hover:text-pink-bright transition-colors" style="color: var(--text-muted);">Privacy Policy</a></li>
					<li><a href="/terms" class="hover:text-pink-bright transition-colors" style="color: var(--text-muted);">Terms of Service</a></li>
					<li><a href="/affiliate-disclosure" class="hover:text-pink-bright transition-colors" style="color: var(--text-muted);">Affiliate Disclosure</a></li>
				</ul>
			</div>
			
			<!-- Newsletter -->
			<div class="col-span-2 md:col-span-1">
				<h4 class="font-semibold mb-3 text-sm" style="color: var(--text-primary);">Get Deals & Tips</h4>
				<p class="text-sm mb-3" style="color: var(--text-muted);">Exclusive product picks and beauty tips straight to your inbox.</p>
				<form on:submit={handleSubscribe} class="flex gap-2 sm:flex-col sm:gap-2">
					<input 
						type="email"
						bind:value={email}
						placeholder="you@email.com"
						required
						class="flex-1 sm:w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-bright text-sm transition-colors"
						style="background-color: var(--bg-input); border-color: var(--border-color); color: var(--text-primary);"
					/>
					<button 
						type="submit"
						disabled={subscribeStatus === 'submitting'}
						class="px-4 py-2 bg-pink-bright font-medium rounded-lg hover:bg-pink-medium transition-colors text-sm disabled:opacity-50 whitespace-nowrap"
						style="color: var(--text-inverse);"
					>
						{subscribeStatus === 'submitting' ? '...' : 'Subscribe'}
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
	
	<!-- Affiliate Disclosure + Copyright -->
	<div class="border-t" style="border-color: var(--border-color);">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
			<p class="text-xs text-center sm:text-left" style="color: var(--text-muted);">
				© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
			</p>
			<p class="text-xs text-center sm:text-right" style="color: var(--text-muted);">
				{amazonConfig.disclosure}
				<a href="/affiliate-disclosure" class="text-pink-bright hover:underline ml-1">Learn more</a>
			</p>
		</div>
	</div>
</footer>
