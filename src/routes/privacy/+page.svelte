<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { siteConfig } from '$lib/utils/seo';
</script>

<SEO 
	title="Privacy Policy"
	description="Privacy Policy for Hairven by Elyn. Learn how we collect, use, and protect your personal information."
/>

<div class="min-h-screen bg-black">
	<section class="py-20">
		<div class="max-w-4xl mx-auto px-4">
			<h1 class="text-4xl md:text-5xl font-display text-white mb-8">Privacy Policy</h1>
			<p class="text-gray-medium mb-8">Last updated: February 10, 2026</p>
			
			<div class="prose prose-invert max-w-none">
				<p class="lead text-xl text-gray-light">
					At {siteConfig.name}, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
				</p>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">Information We Collect</h2>
				<p class="text-gray-light">We collect information that you voluntarily provide to us when you:</p>
				<ul class="text-gray-light space-y-2 ml-6">
					<li>Book an appointment through our website</li>
					<li>Contact us via our contact form</li>
					<li>Subscribe to our newsletter</li>
					<li>Visit our salon in person</li>
				</ul>
				
				<p class="text-gray-light mt-4">This information may include:</p>
				<ul class="text-gray-light space-y-2 ml-6">
					<li>Name, email address, and phone number</li>
					<li>Hair type, preferences, and service history</li>
					<li>Appointment dates and service preferences</li>
				</ul>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">How We Use Your Information</h2>
				<p class="text-gray-light">We use your personal information to:</p>
				<ul class="text-gray-light space-y-2 ml-6">
					<li>Schedule and manage your appointments</li>
					<li>Send appointment reminders and confirmations</li>
					<li>Provide personalized service recommendations</li>
					<li>Send newsletters and promotional offers (with your consent)</li>
					<li>Improve our services and customer experience</li>
				</ul>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">Data Security</h2>
				<p class="text-gray-light">
					We implement appropriate security measures to protect your personal information from unauthorized access, 
					alteration, disclosure, or destruction. Your data is stored securely and only accessible to authorized staff members.
				</p>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">Third-Party Services</h2>
				<p class="text-gray-light">
					We use third-party services for analytics (Google Analytics) and advertising (Google AdSense). 
					These services may collect anonymous usage data. We do not sell your personal information to third parties.
				</p>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">Cookies</h2>
				<p class="text-gray-light">
					Our website uses cookies to enhance your browsing experience. You can disable cookies in your browser settings, 
					though this may affect some website functionality.
				</p>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">Your Rights</h2>
				<p class="text-gray-light">You have the right to:</p>
				<ul class="text-gray-light space-y-2 ml-6">
					<li>Access the personal information we have about you</li>
					<li>Request correction of inaccurate information</li>
					<li>Request deletion of your personal information</li>
					<li>Opt-out of marketing communications</li>
				</ul>

				<h2 class="text-2xl font-display text-pink-bright mt-8 mb-4">Contact Us</h2>
				<p class="text-gray-light">
					If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at:
				</p>
				<p class="text-gray-light mt-4">
					<strong class="text-white">{siteConfig.name}</strong><br>
					{siteConfig.address.street}<br>
					{siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}<br>
					Phone: <a href="tel:{siteConfig.phone}" class="text-pink-bright hover:underline">{siteConfig.phone}</a><br>
					Email: <a href="mailto:{siteConfig.email}" class="text-pink-bright hover:underline">{siteConfig.email}</a>
				</p>
			</div>
		</div>
	</section>
</div>
