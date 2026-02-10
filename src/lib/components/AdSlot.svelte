<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	
	export let position: 'header' | 'sidebar' | 'in-content' = 'sidebar';
	export let size: 'banner' | 'square' | 'large' = 'square';
	
	let adContainer: HTMLElement;
	let adLoaded = false;
	let impressionReported = false;
	let observer: IntersectionObserver;
	
	onMount(() => {
		// Register with Phoenix ad system if available
		if (typeof window !== 'undefined' && window.__PHOENIX_ADS__) {
			window.__PHOENIX_ADS__.registerSlot({
				position,
				size,
				container: adContainer,
				onLoad: () => {
					adLoaded = true;
					setupViewabilityTracking();
				}
			});
		} else {
			// Fallback: Load standard ad or show placeholder
			loadFallbackAd();
		}
	});
	
	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});
	
	function setupViewabilityTracking() {
		// Use Intersection Observer to track when ad is 50%+ visible
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !impressionReported) {
						reportImpression();
					}
				});
			},
			{ threshold: 0.5 }
		);
		
		if (adContainer) {
			observer.observe(adContainer);
		}
	}
	
	async function reportImpression() {
		impressionReported = true;
		
		try {
			await fetch('/api/clika/track-impression', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					position,
					viewability: 0.5,
					timestamp: Date.now()
				})
			});
		} catch (e) {
			// Silent fail - don't break user experience
			console.debug('Ad impression tracking failed:', e);
		}
	}
	
	function loadFallbackAd() {
		// For now, just mark as loaded (no actual ad)
		// In production, this would load AdSense or Ezoic
		adLoaded = true;
	}
	
	// Size configurations
	const sizeClasses = {
		banner: 'w-full max-w-[728px] h-[90px]',
		square: 'w-[300px] h-[250px]',
		large: 'w-full max-w-[336px] h-[280px]'
	};
	
	const positionClasses = {
		header: 'mx-auto my-4',
		sidebar: 'my-4',
		'in-content': 'my-8 mx-auto'
	};
</script>

<div 
	bind:this={adContainer}
	class="ad-slot {sizeClasses[size]} {positionClasses[position]}"
	data-ad-position={position}
	data-ad-size={size}
>
	{#if !adLoaded}
		<div class="ad-placeholder bg-gray-800/50 rounded-lg animate-pulse flex items-center justify-center {sizeClasses[size]}">
			<span class="text-gray-500 text-sm">Advertisement</span>
		</div>
	{:else}
		<div class="ad-content bg-gray-900/30 rounded-lg border border-gray-700/50 flex items-center justify-center {sizeClasses[size]}">
			<span class="text-gray-400 text-sm">Ad Placeholder</span>
		</div>
	{/if}
</div>

<style>
	.ad-slot {
		position: relative;
	}
	
	.ad-placeholder {
		transition: opacity 0.3s ease;
	}
	
	.ad-content {
		transition: all 0.3s ease;
	}
</style>
