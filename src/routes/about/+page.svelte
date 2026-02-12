<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO 
	title="About Us"
	description="The story behind Hairven by Elyn — from a small-town salon in Cortland, NY to a trusted voice in hair care. Meet the stylists behind the reviews."
/>

<div class="min-h-screen" style="background-color: var(--bg-primary);">
	<!-- Hero -->
	<section class="relative py-14 sm:py-20 bg-gradient-to-b from-pink-bright/10">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
			<h1 class="text-4xl sm:text-5xl md:text-6xl font-handwritten text-pink-bright mb-4 sm:mb-6">Our Story</h1>
			<p class="text-base sm:text-lg max-w-2xl mx-auto" style="color: var(--text-secondary);">
				From behind the chair to behind the screen — how a salon in upstate New York became a trusted name in hair care.
			</p>
		</div>
	</section>

	<!-- The Story -->
	<section class="py-12 sm:py-16">
		<div class="max-w-3xl mx-auto px-4 sm:px-6">
			<div class="space-y-6 text-sm sm:text-base leading-relaxed" style="color: var(--text-secondary);">
				<p>
					It started with a question nobody could answer.
				</p>
				<p>
					Elina Makna — everyone calls her Elyn — grew up in New York with a pair of scissors in one hand and a dream in the other. She wasn't born into money. She wasn't handed a business. What she had was a gift for making people feel like the best version of themselves, and a stubborn belief that small-town girls could build something real.
				</p>
				<p>
					In 2018, she opened <strong class="text-pink-bright">Hairven by Elyn</strong> on Owego Street in Cortland, NY. Not in Manhattan. Not in LA. In a small college town where everyone knows your name and word of mouth is the only marketing that matters.
				</p>
				<p>
					And word spread fast.
				</p>
				<p>
					Clients started driving from Syracuse, Ithaca, Binghamton — sometimes two hours each way — just to sit in her chair. She became known for French Balayage, the kind of sun-kissed color that looks like you were born with it. But what really set her apart wasn't just technique. It was honesty.
				</p>

				<div class="my-8 sm:my-10 p-5 sm:p-8 rounded-lg border-l-4 border-pink-bright" style="background-color: var(--bg-tertiary);">
					<p class="italic text-base sm:text-lg" style="color: var(--text-primary);">
						"I'm not going to sell you a $60 shampoo if a $12 one does the same thing. That's not how I was raised."
					</p>
					<p class="mt-3 text-sm text-pink-bright font-medium">— Elyn</p>
				</div>

				<p>
					See, here's the thing about working in a salon: every single day, someone asks you what products to use. What hair dryer should I buy? Is Olaplex really worth it? My hair is falling apart — what do I do?
				</p>
				<p>
					And most of the time, the answer you get from the internet is garbage. Sponsored posts. Fake reviews. Influencers who've never touched a blow dryer in their professional life telling you to spend $400 on something that's no better than what's at Target.
				</p>
				<p>
					That drove Elyn crazy.
				</p>
				<p>
					So she started keeping notes. Every product that came through the salon — she'd test it. On herself first, then on clients who were willing. She'd track how it performed over weeks, not minutes. How it held up in humidity. How it looked after the third wash. Whether it actually delivered on the promises printed on the bottle.
				</p>
				<p>
					Those notes became this site.
				</p>
				<p>
					<strong class="text-pink-bright">Hairven by Elyn</strong> is what happens when a working stylist gets tired of the noise and decides to just tell people the truth. Every product you see here has been used on real clients, in a real salon, under real conditions. If it made the cut, it's here. If it didn't, it's not — no matter how much the brand wanted us to feature it.
				</p>
			</div>
		</div>
	</section>

	<!-- What Makes Us Different -->
	<section class="py-12 sm:py-16" style="background-color: var(--bg-tertiary);">
		<div class="max-w-5xl mx-auto px-4 sm:px-6">
			<h2 class="text-2xl sm:text-3xl font-display text-center mb-8 sm:mb-12" style="color: var(--text-primary);">What Makes Us Different</h2>
			<div class="grid sm:grid-cols-2 gap-6 sm:gap-8">
				<div class="theme-card p-5 sm:p-6">
					<div class="text-2xl mb-3">🪑</div>
					<h3 class="font-semibold mb-2 text-sm sm:text-base" style="color: var(--text-primary);">We Actually Use This Stuff</h3>
					<p class="text-sm" style="color: var(--text-muted);">Every product gets tested on real clients over real time. Not a 30-second demo for a camera. Weeks of use, multiple hair types, honest results.</p>
				</div>
				<div class="theme-card p-5 sm:p-6">
					<div class="text-2xl mb-3">🚫</div>
					<h3 class="font-semibold mb-2 text-sm sm:text-base" style="color: var(--text-primary);">No Pay-to-Play</h3>
					<p class="text-sm" style="color: var(--text-muted);">We don't accept money from brands to feature their products. If something's on this site, it's because it earned its spot — not because someone wrote us a check.</p>
				</div>
				<div class="theme-card p-5 sm:p-6">
					<div class="text-2xl mb-3">💬</div>
					<h3 class="font-semibold mb-2 text-sm sm:text-base" style="color: var(--text-primary);">Straight Talk</h3>
					<p class="text-sm" style="color: var(--text-muted);">We'll tell you when the expensive option isn't worth it. We'll tell you when the cheap option is actually great. No fluff, no corporate speak.</p>
				</div>
				<div class="theme-card p-5 sm:p-6">
					<div class="text-2xl mb-3">💸</div>
					<h3 class="font-semibold mb-2 text-sm sm:text-base" style="color: var(--text-primary);">Same Price, Always</h3>
					<p class="text-sm" style="color: var(--text-muted);">When you buy through our links, you pay the exact same Amazon price. We earn a small commission at zero extra cost to you. That's how we keep the lights on.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Meet Elyn -->
	<section class="py-12 sm:py-16">
		<div class="max-w-3xl mx-auto px-4 sm:px-6">
			<h2 class="text-2xl sm:text-3xl font-display mb-6 sm:mb-8 text-center" style="color: var(--text-primary);">Meet Elyn</h2>
			<div class="theme-card p-5 sm:p-8">
				<div class="space-y-4 text-sm sm:text-base" style="color: var(--text-secondary);">
					<p>
						Elina Makna is a licensed cosmetologist with over 8 years behind the chair. She specializes in French Balayage, color correction, and the kind of transformative cuts that make people cry happy tears in the mirror.
					</p>
					<p>
						She's the person who will tell you your hair needs a break before she'll agree to bleach it again. The one who remembers your kid's name and asks about your dog. The one who stays late because she refuses to rush a client out the door.
					</p>
					<p>
						When she's not in the salon, she's testing products, writing reviews, and trying to cut through the noise in an industry that has way too much of it.
					</p>
					<p class="text-pink-bright font-medium">
						Based in Cortland, NY. Powered by coffee and an unreasonable number of hair clips.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="py-12 sm:py-16 bg-pink-bright/10">
		<div class="max-w-2xl mx-auto px-4 sm:px-6 text-center">
			<h2 class="text-2xl sm:text-3xl font-display mb-3" style="color: var(--text-primary);">See What We Recommend</h2>
			<p class="mb-6 text-sm sm:text-base" style="color: var(--text-muted);">
				Explore our curated picks or read the honest reviews behind them.
			</p>
			<div class="flex flex-col sm:flex-row gap-3 justify-center">
				<a href="/shop" class="px-8 py-3 bg-pink-bright font-semibold rounded-lg hover:bg-pink-medium transition-colors text-sm sm:text-base" style="color: var(--text-inverse);">
					Shop Products
				</a>
				<a href="/blog" class="px-8 py-3 border-2 border-pink-bright text-pink-bright font-semibold rounded-lg hover:bg-pink-bright hover:text-black transition-colors text-sm sm:text-base">
					Read Reviews
				</a>
			</div>
		</div>
	</section>
</div>
