<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { siteConfig } from '$lib/utils/seo';
	import { amazonConfig } from '$lib/utils/amazon';
</script>

<SEO 
	title="Affiliate Disclosure"
	description="Affiliate Disclosure for Hairven by Elyn. Learn about our affiliate relationships and how we earn commissions from product recommendations."
/>

<div class="min-h-screen bg-black">
	<section class="py-20">
		<div class="max-w-4xl mx-auto px-4">
			<h1 class="text-4xl md:text-5xl font-display text-white mb-8">Affiliate Disclosure</h1>
			<p class="text-gray-medium mb-8">Last updated: February 10, 2026</p>
			
			<div class="prose prose-invert max-w-none">
				<div class="bg-pink-bright/10 border border-pink-bright/30 rounded-lg p-6 mb-8">
					<p class="text-lg text-gray-light m-0">
						<strong class="text-pink-bright">{amazonConfig.disclosure}</strong>
					</p>
				</div>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">What Are Affiliate Links?</h2>
				<p class="text-gray-light">
					Affiliate links are special URLs that track referrals from our website to online retailers like Amazon. 
					When you click on an affiliate link and make a purchase, the retailer pays us a small commission for 
					sending you their way.
				</p>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">Our Affiliate Partners</h2>
				<p class="text-gray-light">We currently participate in the following affiliate programs:</p>
				<ul class="text-gray-light space-y-3 ml-6">
					<li>
						<strong class="text-white">Amazon Associates Program</strong><br>
						We earn commissions from qualifying purchases made through Amazon affiliate links on our website.
					</li>
				</ul>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">Our Commitment to Honesty</h2>
				<p class="text-gray-light">
					At {siteConfig.name}, integrity is at the core of everything we do. Here's our promise to you:
				</p>
				<ul class="text-gray-light space-y-3 ml-6">
					<li>
						<strong class="text-white">We only recommend products we believe in.</strong> Every product featured on our 
						website is something our stylists have used, tested, or researched thoroughly.
					</li>
					<li>
						<strong class="text-white">Our recommendations are never influenced by commissions.</strong> We prioritize 
						your hair health and satisfaction over affiliate earnings.
					</li>
					<li>
						<strong class="text-white">We are transparent about our relationships.</strong> Affiliate links are clearly 
						marked, and we disclose our partnerships openly.
					</li>
					<li>
						<strong class="text-white">There is no additional cost to you.</strong> Product prices are the same whether 
						you use our affiliate link or visit the retailer directly.
					</li>
				</ul>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">How We Select Products</h2>
				<p class="text-gray-light">
					Our product selection process is rigorous:
				</p>
				<ol class="text-gray-light space-y-3 ml-6">
					<li><strong class="text-white">Hands-on Testing:</strong> Our stylists use products in the salon before recommending them.</li>
					<li><strong class="text-white">Client Feedback:</strong> We listen to what our clients love and what works for different hair types.</li>
					<li><strong class="text-white">Research:</strong> We stay current on industry trends and ingredient innovations.</li>
					<li><strong class="text-white">Value Assessment:</strong> We consider price-to-performance ratios to recommend products at various price points.</li>
				</ol>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">Identifying Affiliate Links</h2>
				<p class="text-gray-light">
					Affiliate links on our website are marked with the following attributes for transparency:
				</p>
				<ul class="text-gray-light space-y-2 ml-6">
					<li>Links include <code class="bg-black-soft px-2 py-1 rounded">rel="sponsored"</code> attribute</li>
					<li>Links may include our affiliate tag in the URL</li>
					<li>Buttons may include text like "Check Price on Amazon" or "View on Amazon"</li>
				</ul>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">FTC Compliance</h2>
				<p class="text-gray-light">
					We comply with the Federal Trade Commission (FTC) guidelines regarding endorsements and testimonials. 
					This means:
				</p>
				<ul class="text-gray-light space-y-2 ml-6">
					<li>We clearly disclose affiliate relationships</li>
					<li>We do not make false or misleading claims about products</li>
					<li>We distinguish between sponsored and organic content</li>
				</ul>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">Questions?</h2>
				<p class="text-gray-light">
					If you have any questions about our affiliate relationships or how we earn commissions, please don't hesitate 
					to contact us. We believe in complete transparency with our clients and website visitors.
				</p>

				<div class="mt-8 p-6 bg-black-soft/50 rounded-lg border border-gray-dark">
					<p class="text-gray-light m-0">
						<strong class="text-white">Contact Us:</strong><br>
						{siteConfig.name}<br>
						{siteConfig.address.street}<br>
						{siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}<br>
						Phone: <a href="tel:{siteConfig.phone}" class="text-pink-bright hover:underline">{siteConfig.phone}</a><br>
						Email: <a href="mailto:{siteConfig.email}" class="text-pink-bright hover:underline">{siteConfig.email}</a>
					</p>
				</div>
			</div>
		</div>
	</section>
</div>
