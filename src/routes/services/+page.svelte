<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO.svelte';
	
	// Redirect /services to /shop
	onMount(() => {
		goto('/shop', { replaceState: true });
	});
</script>

<SEO title="Shop Products" description="Browse our curated collection of salon-tested hair tools and products." />

<div class="min-h-screen flex items-center justify-center" style="background-color: var(--bg-primary);">
	<div class="text-center px-4">
		<p class="text-sm" style="color: var(--text-muted);">Redirecting to our shop...</p>
		<a href="/shop" class="text-pink-bright hover:underline text-sm mt-2 inline-block">Click here if not redirected</a>
	</div>
</div>
