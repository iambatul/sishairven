<script>
	import { createAmazonLink } from '$lib/utils/amazon';
	
	const products = [
		{
			name: 'Dyson Supersonic',
			asin: 'B01FIG3JA4',
			price: '$429',
			bestFor: 'All hair types',
			pros: ['Fastest drying', 'Heat protection', 'Magnetic attachments'],
			cons: ['Premium price'],
			rating: 4.7
		},
		{
			name: 'ghd Helios',
			asin: 'B07W7RSG9L',
			price: '$279',
			bestFor: 'Fine to medium hair',
			pros: ['Lightweight', 'Aerodynamic', 'Ionic technology'],
			cons: ['Fewer attachments'],
			rating: 4.6
		},
		{
			name: 'Revlon One-Step',
			asin: 'B08PZVDB4J',
			price: '$40',
			bestFor: 'Quick styling',
			pros: ['Budget-friendly', 'Dries + styles', 'User-friendly'],
			cons: ['Not for short hair', 'Gets hot'],
			rating: 4.5
		}
	];
	
	const features = [
		{ name: 'Wattage', dyson: '1600W', ghd: '1875W', revlon: '1100W' },
		{ name: 'Weight', dyson: '1.8 lbs', ghd: '1.5 lbs', revlon: '1.6 lbs' },
		{ name: 'Heat Settings', dyson: '4', ghd: '3', revlon: '3' },
		{ name: 'Cool Shot', dyson: 'Yes', ghd: 'Yes', revlon: 'Yes' },
		{ name: 'Ionic Technology', dyson: 'Yes', ghd: 'Yes', revlon: 'Yes' },
		{ name: 'Warranty', dyson: '2 years', ghd: '2 years', revlon: '1 year' }
	];
</script>

<div class="prose prose-invert max-w-none">
	<p class="lead text-xl text-gray-300 mb-8">
		We tested the three most popular hair dryers side-by-side in our salon. Here is the breakdown 
		of which one is worth your money based on your hair type and styling needs.
	</p>

	<h2 class="text-2xl font-bold text-pink-bright mt-8 mb-4">Quick Comparison</h2>
	
	<div class="overflow-x-auto mb-8">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="border-b border-pink-bright/30">
					<th class="pb-4 text-gray-medium font-medium">Feature</th>
					<th class="pb-4 text-pink-bright font-semibold">Dyson Supersonic</th>
					<th class="pb-4 text-pink-bright font-semibold">ghd Helios</th>
					<th class="pb-4 text-pink-bright font-semibold">Revlon One-Step</th>
				</tr>
			</thead>
			<tbody class="text-gray-light">
				{#each features as feature}
					<tr class="border-b border-gray-dark">
						<td class="py-3 font-medium text-white">{feature.name}</td>
						<td class="py-3">{feature.dyson}</td>
						<td class="py-3">{feature.ghd}</td>
						<td class="py-3">{feature.revlon}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 class="text-2xl font-bold text-pink-bright mt-8 mb-4">Our Verdict</h2>
	
	<div class="grid md:grid-cols-3 gap-6 mb-8">
		{#each products as product}
			<div class="bg-black-soft/50 rounded-lg p-6 border border-pink-bright/20">
				<h3 class="text-xl font-semibold text-white mb-2">{product.name}</h3>
				<p class="text-pink-bright text-2xl font-bold mb-4">{product.price}</p>
				
				<div class="mb-4">
					<span class="text-sm text-gray-medium">Best for:</span>
					<p class="text-gold-light">{product.bestFor}</p>
				</div>
				
				<div class="mb-4">
					<div class="flex text-gold mb-1">
						{#each Array(5) as _, i}
							<svg class="w-4 h-4 {i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-dark'}" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
							</svg>
						{/each}
					</div>
					<span class="text-sm text-gray-medium">{product.rating}/5</span>
				</div>
				
				<div class="space-y-2 mb-4">
					{#each product.pros as pro}
						<p class="text-sm text-green-400">{pro}</p>
					{/each}
				</div>
				
				<a 
					href={createAmazonLink(product.asin)}
					class="inline-flex items-center justify-center w-full px-4 py-2 bg-pink-bright text-black font-medium rounded-lg hover:bg-pink-medium transition-colors"
					rel="sponsored noopener noreferrer"
					target="_blank"
				>
					Check Price
				</a>
			</div>
		{/each}
	</div>

	<h2 class="text-2xl font-bold text-pink-bright mt-8 mb-4">Who Should Buy What</h2>
	
	<div class="space-y-6">
		<div class="bg-black-soft/30 p-6 rounded-lg border-l-4 border-pink-bright">
			<h3 class="text-xl font-semibold text-white mb-2">Choose Dyson Supersonic if:</h3>
			<ul class="text-gray-light space-y-2">
				<li>- You use a hair dryer daily</li>
				<li>- Heat damage is a major concern</li>
				<li>- You want the fastest drying time</li>
				<li>- You have thick or coarse hair</li>
				<li>- Money is not a concern</li>
			</ul>
		</div>
		
		<div class="bg-black-soft/30 p-6 rounded-lg border-l-4 border-pink-bright">
			<h3 class="text-xl font-semibold text-white mb-2">Choose ghd Helios if:</h3>
			<ul class="text-gray-light space-y-2">
				<li>- You want professional results without the Dyson price</li>
				<li>- You have fine to medium hair</li>
				<li>- Lightweight tools are a priority</li>
				<li>- You travel frequently</li>
			</ul>
		</div>
		
		<div class="bg-black-soft/30 p-6 rounded-lg border-l-4 border-pink-bright">
			<h3 class="text-xl font-semibold text-white mb-2">Choose Revlon One-Step if:</h3>
			<ul class="text-gray-light space-y-2">
				<li>- You are on a budget</li>
				<li>- You want the blowout look easily</li>
				<li>- You have medium to long hair</li>
				<li>- You do not need precision styling</li>
			</ul>
		</div>
	</div>

	<h2 class="text-2xl font-bold text-pink-bright mt-8 mb-4">Our Salon Pick</h2>
	<p class="text-gray-light mb-6">
		After daily use on hundreds of clients, our stylists reach for the <strong class="text-white">ghd Helios</strong> 
		most often. It delivers 90% of the Dyson performance at 60% of the price. However, if you have 
		very thick hair or use a dryer daily, the Dyson investment pays off in time saved and hair health.
	</p>

	<div class="bg-pink-bright/10 border border-pink-bright/30 rounded-lg p-6 mt-8">
		<p class="text-gray-light m-0">
			<strong class="text-pink-bright">Pro Tip:</strong> Whichever you choose, always use a heat protectant 
			and keep the nozzle 6 inches from your hair to minimize damage.
		</p>
	</div>
</div>
