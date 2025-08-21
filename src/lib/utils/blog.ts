import blogData from '$lib/data/blog-posts.json';

export interface BlogPost {
	slug: string;
	title: string;
	excerpt: string;
	content: string;
	date: string;
	author: string;
	tags: string[];
	readTime: string;
	published: boolean;
	featured: boolean;
}

/**
 * Get all published blog posts, sorted by date (newest first)
 */
export function getAllPosts(): BlogPost[] {
	return blogData.posts
		.filter((post) => post.published)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug: string): BlogPost | null {
	const post = blogData.posts.find((post) => post.slug === slug && post.published);
	return post || null;
}

/**
 * Get featured blog posts
 */
export function getFeaturedPosts(): BlogPost[] {
	return blogData.posts
		.filter((post) => post.published && post.featured)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): BlogPost[] {
	return blogData.posts
		.filter((post) => post.published && post.tags.includes(tag))
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get all unique tags from published posts
 */
export function getAllTags(): string[] {
	const tags = new Set<string>();
	blogData.posts
		.filter((post) => post.published)
		.forEach((post) => {
			post.tags.forEach((tag) => tags.add(tag));
		});
	return Array.from(tags).sort();
}

/**
 * Get recent posts (limit specified)
 */
export function getRecentPosts(limit: number = 5): BlogPost[] {
	return getAllPosts().slice(0, limit);
}

/**
 * Search posts by title or content
 */
export function searchPosts(query: string): BlogPost[] {
	const searchTerm = query.toLowerCase();
	return blogData.posts
		.filter(
			(post) =>
				post.published &&
				(post.title.toLowerCase().includes(searchTerm) ||
					post.excerpt.toLowerCase().includes(searchTerm) ||
					post.content.toLowerCase().includes(searchTerm) ||
					post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
		)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
