import type { ComponentType } from 'svelte';

export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	date: string;
	modified?: string;
	author: string;
	category: string;
	tags: string[];
	image: string;
	readingTime: number;
	published: boolean;
}

// Blog post metadata index
// Content is loaded dynamically via Svelte components in routes/blog/[slug]/+page.svelte
export const posts: BlogPost[] = [
	{
		slug: 'best-hair-dryers-2025',
		title: 'Best Hair Dryers 2025: Salon-Quality Results at Home',
		description: 'Professional stylists review the top hair dryers for every budget. From Dyson to Revlon, find your perfect match.',
		date: '2025-01-15',
		author: 'Elyn Makna',
		category: 'Reviews',
		tags: ['hair-dryers', 'styling-tools', 'reviews'],
		image: '/blog/hair-dryers-2025.jpg',
		readingTime: 8,
		published: true
	},
	{
		slug: 'keratin-treatment-guide',
		title: 'The Complete Guide to Keratin Treatments',
		description: 'Everything you need to know about keratin treatments: benefits, aftercare, and our recommended at-home products.',
		date: '2025-01-10',
		author: 'Elyn Makna',
		category: 'Guides',
		tags: ['keratin', 'treatments', 'hair-care'],
		image: '/blog/keratin-guide.jpg',
		readingTime: 12,
		published: true
	},
	{
		slug: 'dyson-vs-ghd-vs-revlon',
		title: 'Dyson vs ghd vs Revlon: Hair Dryer Comparison (2025)',
		description: 'We tested three popular hair dryers side-by-side in our salon. See which one is worth your money based on your hair type.',
		date: '2025-02-05',
		author: 'Elyn Makna',
		category: 'Reviews',
		tags: ['hair-dryers', 'comparison', 'styling-tools', 'dyson', 'ghd', 'revlon'],
		image: '/blog/hair-dryer-comparison.jpg',
		readingTime: 8,
		published: true
	},
	{
		slug: 'balayage-vs-highlights',
		title: 'Balayage vs Highlights: Which is Right for You?',
		description: 'Our color specialists explain the differences between balayage and traditional highlights to help you choose.',
		date: '2025-01-05',
		author: 'Elyn Makna',
		category: 'Education',
		tags: ['color', 'balayage', 'highlights'],
		image: '/blog/balayage-vs-highlights.jpg',
		readingTime: 6,
		published: true
	},
	{
		slug: 'summer-hair-care-tips',
		title: 'Summer Hair Care: Protect Your Color Investment',
		description: 'Essential tips for protecting your hair from sun, chlorine, and humidity this summer.',
		date: '2024-12-28',
		author: 'Elyn Makna',
		category: 'Tips',
		tags: ['summer', 'hair-care', 'color-protection'],
		image: '/blog/summer-hair-care.jpg',
		readingTime: 5,
		published: true
	},
	{
		slug: 'best-products-damaged-hair',
		title: '10 Best Products for Damaged Hair (Restoration Guide)',
		description: 'Our stylists share the products they actually use to repair and restore damaged hair.',
		date: '2024-12-20',
		author: 'Elyn Makna',
		category: 'Reviews',
		tags: ['damaged-hair', 'products', 'restoration'],
		image: '/blog/damaged-hair-products.jpg',
		readingTime: 10,
		published: true
	},
	{
		slug: 'how-to-make-blowout-last',
		title: 'How to Make Your Blowout Last 5+ Days',
		description: 'Pro tips and product recommendations for extending the life of your salon blowout.',
		date: '2024-12-15',
		author: 'Elyn Makna',
		category: 'Tips',
		tags: ['blowout', 'styling', 'tips'],
		image: '/blog/blowout-tips.jpg',
		readingTime: 7,
		published: true
	}
];

export function getPublishedPosts(): BlogPost[] {
	return posts
		.filter(p => p.published)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
	return posts.find(p => p.slug === slug && p.published);
}

export function getPostsByCategory(category: string): BlogPost[] {
	return getPublishedPosts().filter(p => 
		p.category.toLowerCase() === category.toLowerCase()
	);
}

export function getPostsByTag(tag: string): BlogPost[] {
	return getPublishedPosts().filter(p => 
		p.tags.includes(tag.toLowerCase())
	);
}

export function getAllCategories(): string[] {
	return [...new Set(posts.map(p => p.category))];
}

export function getAllTags(): string[] {
	const tagSet = new Set<string>();
	posts.forEach(p => p.tags.forEach(t => tagSet.add(t)));
	return [...tagSet];
}

// Generate excerpt from description
export function generateExcerpt(description: string, maxLength: number = 160): string {
	if (description.length <= maxLength) return description;
	return description.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

// Format date for display
export function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}
