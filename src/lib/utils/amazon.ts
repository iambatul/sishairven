import { env } from '$env/dynamic/public';

export const amazonConfig = {
	tag: env.PUBLIC_AMAZON_ASSOC_TAG || 'CHANGEME',
	baseUrl: 'https://www.amazon.com',
	disclosure: 'As an Amazon Associate, we earn from qualifying purchases. This comes at no additional cost to you.'
};

// =============================================================================
// AFFILIATE LINK TRACKING (Phoenix Clika Integration)
// =============================================================================

export interface AffiliateClickEvent {
	asin: string;
	product_name: string;
	category: string;
	context: 'shop_page' | 'review' | 'comparison' | 'guide' | 'product_card';
	page_url: string;
	click_timestamp: number;
	potential_revenue?: number;
}

/**
 * Track affiliate link click to Phoenix Clika backend
 */
export async function trackAffiliateClick(event: AffiliateClickEvent): Promise<void> {
	if (typeof window === 'undefined') return;
	
	try {
		await fetch('/api/clika/track-click', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(event)
		});
	} catch (e) {
		// Silent fail - don't block user experience
		console.debug('Click tracking failed:', e);
	}
}

/**
 * Create Amazon affiliate link with Phoenix tracking
 */
export function createAmazonLink(asin: string, options: {
	tag?: string;
	keywords?: string;
	track?: boolean;
	productName?: string;
	category?: string;
	context?: AffiliateClickEvent['context'];
} = {}) {
	const tag = options.tag || amazonConfig.tag;
	
	// If tag is CHANGEME or empty, just return base product URL
	if (!tag || tag === 'CHANGEME') {
		return `${amazonConfig.baseUrl}/dp/${asin}`;
	}
	
	let url = `${amazonConfig.baseUrl}/dp/${asin}?tag=${tag}`;
	
	if (options.keywords) {
		url += `&keywords=${encodeURIComponent(options.keywords)}`;
	}
	
	// Track click if requested
	if (options.track && typeof window !== 'undefined') {
		const product = curatedProducts.find(p => p.asin === asin);
		const price = product ? parseFloat(product.price.replace(/[$,]/g, '')) : 0;
		const commission = price * 0.06; // Estimate 6% commission
		
		trackAffiliateClick({
			asin,
			product_name: options.productName || product?.title || 'Unknown Product',
			category: options.category || product?.category || 'unknown',
			context: options.context || 'shop_page',
			page_url: window.location.href,
			click_timestamp: Date.now(),
			potential_revenue: commission
		});
	}
	
	return url;
}

/**
 * Create tracked affiliate link for use in components
 */
export function createTrackedAmazonLink(
	asin: string,
	productName: string,
	category: string,
	context: AffiliateClickEvent['context']
): string {
	return createAmazonLink(asin, {
		track: true,
		productName,
		category,
		context
	});
}

export function createAmazonSearchLink(keywords: string, options: {
	tag?: string;
} = {}) {
	const tag = options.tag || amazonConfig.tag;
	
	if (!tag) {
		return `${amazonConfig.baseUrl}/s?k=${encodeURIComponent(keywords)}`;
	}
	
	return `${amazonConfig.baseUrl}/s?k=${encodeURIComponent(keywords)}&tag=${tag}`;
}

export interface AmazonProduct {
	asin: string;
	title: string;
	description: string;
	price: string;
	rating: number;
	reviewCount: number;
	imageUrl: string;
	features: string[];
	category: string;
}

// Curated product data (manual entry required for compliance)
export const curatedProducts: AmazonProduct[] = [
	{
		asin: 'B01FIG3JA4',
		title: 'Dyson Supersonic Hair Dryer',
		description: 'Professional-grade hair dryer with intelligent heat control. Fast drying with no extreme heat damage.',
		price: '$429.99',
		rating: 4.7,
		reviewCount: 28500,
		imageUrl: 'https://m.media-amazon.com/images/I/61YVpBxI1IL._AC_SL1500_.jpg',
		features: ['Intelligent heat control', '3 speed settings', '4 heat settings', 'Magnetic attachments'],
		category: 'hair-tools'
	},
	{
		asin: 'B08PZVDB4J',
		title: 'ghd Platinum+ Styler',
		description: 'Professional flat iron with predictive ultra-zone technology for optimal styling temperature.',
		price: '$279.00',
		rating: 4.6,
		reviewCount: 12400,
		imageUrl: 'https://m.media-amazon.com/images/I/71K4C+7L-GL._AC_SL1500_.jpg',
		features: ['Ultra-zone technology', '185°C optimal styling', 'Wishbone hinge', 'Universal voltage'],
		category: 'hair-tools'
	},
	{
		asin: 'B09MLDPTDZ',
		title: 'Revlon One-Step Volumizer',
		description: 'Hot air brush for salon blowouts at home. Dries and styles in one step.',
		price: '$39.99',
		rating: 4.5,
		reviewCount: 45200,
		imageUrl: 'https://m.media-amazon.com/images/I/71FxH8mjKPL._AC_SL1500_.jpg',
		features: ['Ionic technology', 'Nylon pin bristles', '3 heat/speed settings', 'Lightweight design'],
		category: 'hair-tools'
	},
	{
		asin: 'B0037LTTRO',
		title: 'Moroccanoil Treatment',
		description: 'Original argan oil hair treatment. Nourishes and conditions all hair types.',
		price: '$48.00',
		rating: 4.7,
		reviewCount: 32100,
		imageUrl: 'https://m.media-amazon.com/images/I/71Z3Y4+-n9L._SL1500_.jpg',
		features: ['Argan oil infused', 'Alcohol-free', 'For all hair types', 'Adds shine and softness'],
		category: 'hair-care'
	},
	{
		asin: 'B07YQ8C6GM',
		title: 'Olaplex No. 3 Hair Perfector',
		description: 'At-home treatment that reduces breakage and visibly strengthens hair.',
		price: '$30.00',
		rating: 4.6,
		reviewCount: 67800,
		imageUrl: 'https://m.media-amazon.com/images/I/61K1jzxJ9XL._SL1500_.jpg',
		features: ['Repairs damaged hair', 'Strengthens bonds', 'Color-safe', 'Once-weekly treatment'],
		category: 'hair-care'
	},
	{
		asin: 'B08P4GRYY8',
		title: 'Kerastase Elixir Ultime Oil',
		description: 'Versatile beautifying oil with camellia and argan oils for all hair types.',
		price: '$42.00',
		rating: 4.8,
		reviewCount: 8900,
		imageUrl: 'https://m.media-amazon.com/images/I/71I8pC7wOZL._SL1500_.jpg',
		features: ['Multi-use formula', 'Heat protection', 'Anti-frizz', 'Adds luminous shine'],
		category: 'hair-care'
	}
];

export function getProductsByCategory(category: string) {
	return curatedProducts.filter(p => p.category === category);
}

export function getAllCategories() {
	return [...new Set(curatedProducts.map(p => p.category))];
}
