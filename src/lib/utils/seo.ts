export interface SEOData {
	title?: string;
	description?: string;
	keywords?: string[];
	author?: string;
	canonical?: string;
	robots?: string;

	// Open Graph
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	ogImageAlt?: string;
	ogType?: 'website' | 'article' | 'profile' | 'book' | 'music' | 'video';
	ogUrl?: string;
	ogSiteName?: string;

	// Twitter Card
	twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
	twitterSite?: string;
	twitterCreator?: string;
	twitterTitle?: string;
	twitterDescription?: string;
	twitterImage?: string;
	twitterImageAlt?: string;

	// Article specific (for blog posts, etc.)
	articleAuthor?: string;
	articlePublishedTime?: string;
	articleModifiedTime?: string;
	articleSection?: string;
	articleTags?: string[];

	// Schema.org JSON-LD
	jsonLd?: Record<string, unknown>;
}

export const defaultSEO: SEOData = {
	title: 'Dr. Allison Andrews',
	description: 'Professional website of Dr. Allison Andrews',
	author: 'Dr. Allison Andrews',
	robots: 'index, follow',
	ogType: 'website',
	ogSiteName: 'Dr. Allison Andrews',
	twitterCard: 'summary_large_image',
	keywords: []
};

/**
 * Merge SEO data with defaults
 */
export function mergeSEO(seo: Partial<SEOData> = {}): SEOData {
	return {
		...defaultSEO,
		...seo,
		// Merge arrays
		keywords: [...(defaultSEO.keywords || []), ...(seo.keywords || [])],
		articleTags: [...(defaultSEO.articleTags || []), ...(seo.articleTags || [])]
	};
}

/**
 * Generate page title with site name
 */
export function generateTitle(
	pageTitle?: string,
	siteName: string = 'Dr. Allison Andrews'
): string {
	if (!pageTitle || pageTitle === siteName) {
		return siteName;
	}
	return `${pageTitle} | ${siteName}`;
}

/**
 * Generate canonical URL
 */
export function generateCanonical(path: string, baseUrl: string = 'https://drallison.com'): string {
	const cleanPath = path.startsWith('/') ? path : `/${path}`;
	return `${baseUrl}${cleanPath}`;
}

/**
 * Generate JSON-LD structured data
 */
export function generateJsonLd(
	seo: SEOData,
	type: 'WebSite' | 'WebPage' | 'Article' | 'Person' = 'WebPage'
): Record<string, any> {
	const baseSchema = {
		'@context': 'https://schema.org',
		'@type': type
	};

	switch (type) {
		case 'WebSite':
			return {
				...baseSchema,
				name: seo.ogSiteName || seo.title,
				description: seo.description,
				url: seo.canonical || seo.ogUrl,
				author: {
					'@type': 'Person',
					name: seo.author
				}
			};

		case 'WebPage':
			return {
				...baseSchema,
				name: seo.title,
				description: seo.description,
				url: seo.canonical || seo.ogUrl,
				isPartOf: {
					'@type': 'WebSite',
					name: seo.ogSiteName,
					url: seo.canonical?.split('/').slice(0, 3).join('/')
				}
			};

		case 'Article':
			return {
				...baseSchema,
				headline: seo.title,
				description: seo.description,
				author: {
					'@type': 'Person',
					name: seo.articleAuthor || seo.author
				},
				datePublished: seo.articlePublishedTime,
				dateModified: seo.articleModifiedTime,
				articleSection: seo.articleSection,
				keywords: seo.articleTags?.join(', '),
				url: seo.canonical || seo.ogUrl,
				image: seo.ogImage
			};

		case 'Person':
			return {
				...baseSchema,
				name: seo.author,
				description: seo.description,
				url: seo.canonical || seo.ogUrl
			};

		default:
			return baseSchema;
	}
}

/**
 * Validate required SEO fields
 */
export function validateSEO(seo: SEOData): { isValid: boolean; errors: string[] } {
	const errors: string[] = [];

	if (!seo.title) errors.push('Title is required');
	if (!seo.description) errors.push('Description is required');
	if (seo.description && seo.description.length > 160) {
		errors.push('Description should be under 160 characters');
	}
	if (seo.title && seo.title.length > 60) {
		errors.push('Title should be under 60 characters');
	}

	return {
		isValid: errors.length === 0,
		errors
	};
}
