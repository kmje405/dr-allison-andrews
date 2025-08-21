import { getPostsWithTags } from '$lib/utils/blog-db.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Get all posts (including unpublished ones for admin)
		const allPosts = await getPostsWithTags();

		// Transform database posts to match admin interface format
		const transformedPosts = allPosts.map((post) => ({
			id: post.id,
			title: post.title,
			slug: post.slug,
			published: post.published,
			featured: post.featured,
			date: post.createdAt.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
			author: post.author,
			tags: post.tags,
			readTime: post.readTime,
			excerpt: post.excerpt
		}));

		return {
			posts: transformedPosts
		};
	} catch (error) {
		console.error('Error loading admin data:', error);
		return {
			posts: []
		};
	}
};
