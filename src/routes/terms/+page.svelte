<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { siteConfig } from '$lib/utils/seo';
</script>

<SEO 
	title="Terms of Service"
	description="Terms of Service for Hairven by Elyn. Please read these terms carefully before using our website or services."
/>

<div class="min-h-screen bg-[var(--bg-primary)]">
	<section class="py-20">
		<div class="max-w-4xl mx-auto px-4">
			<h1 class="text-4xl md:text-5xl font-display text-[var(--text-primary)] mb-8">Terms of Service</h1>
			<p class="text-[var(--text-muted)] mb-8">Last updated: February 10, 2026</p>
			
			<div class="prose prose-invert max-w-none">
				<p class="lead text-xl text-[var(--text-secondary)]">
					Welcome to {siteConfig.name}. By accessing our website or using our services, you agree to these Terms of Service.
				</p>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">1. Acceptance of Terms</h2>
				<p class="text-[var(--text-secondary)]">
					By accessing this website, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
					If you do not agree with any of these terms, you are prohibited from using or accessing this site.
				</p>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">2. Use of Services</h2>
				<p class="text-[var(--text-secondary)]">Our services are available for individuals 18 years of age or older. By booking an appointment or using our services, you represent that you meet this requirement.</p>
				<p class="text-[var(--text-secondary)] mt-4">You agree to:</p>
				<ul class="text-[var(--text-secondary)] space-y-2 ml-6">
					<li>Provide accurate and complete information when booking appointments</li>
					<li>Arrive on time for scheduled appointments</li>
					<li>Provide 24-hour notice for cancellations or rescheduling</li>
					<li>Pay for services rendered according to our pricing</li>
				</ul>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">3. Cancellation Policy</h2>
				<p class="text-[var(--text-secondary)]">
					We understand that plans change. We request at least 24 hours' notice for cancellations or rescheduling. 
					Late cancellations or no-shows may be subject to a cancellation fee.
				</p>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">4. Service Satisfaction</h2>
				<p class="text-[var(--text-secondary)]">
					Your satisfaction is our priority. If you're not completely happy with your service, please contact us within 7 days. 
					We will work with you to make it right, which may include a complimentary adjustment at our discretion.
				</p>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">5. Intellectual Property</h2>
				<p class="text-[var(--text-secondary)]">
					All content on this website, including text, images, logos, and styling, is the property of {siteConfig.name} 
					and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, 
					or create derivative works without our express written permission.
				</p>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">6. Product Recommendations & Affiliate Links</h2>
				<p class="text-[var(--text-secondary)]">
					Our website includes product recommendations with affiliate links to Amazon and other retailers. 
					When you purchase products through these links, we may earn a commission at no additional cost to you. 
					We only recommend products we genuinely believe in and use in our salon. 
					<a href="/affiliate-disclosure" class="text-pink-bright hover:underline">Learn more about our affiliate relationships</a>.
				</p>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">7. Limitation of Liability</h2>
				<p class="text-[var(--text-secondary)]">
					{siteConfig.name} and its staff shall not be liable for any direct, indirect, incidental, special, 
					or consequential damages resulting from the use or inability to use our services or website.
				</p>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">8. Changes to Terms</h2>
				<p class="text-[var(--text-secondary)]">
					We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately 
					upon posting to this page. Your continued use of our services constitutes acceptance of any changes.
				</p>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">9. Governing Law</h2>
				<p class="text-[var(--text-secondary)]">
					These terms shall be governed by and construed in accordance with the laws of the State of New York, 
					without regard to its conflict of law provisions.
				</p>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">10. Contact Information</h2>
				<p class="text-[var(--text-secondary)]">
					Questions about the Terms of Service should be sent to us at:
				</p>
				<p class="text-[var(--text-secondary)] mt-4">
					<strong class="text-[var(--text-primary)]">{siteConfig.name}</strong><br>
					{siteConfig.address.street}<br>
					{siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}<br>
					Phone: <a href="tel:{siteConfig.phone}" class="text-pink-bright hover:underline">{siteConfig.phone}</a><br>
					Email: <a href="mailto:{siteConfig.email}" class="text-pink-bright hover:underline">{siteConfig.email}</a>
				</p>
			</div>
		</div>
	</section>
</div>
