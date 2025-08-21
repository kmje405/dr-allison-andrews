import { getPostsWithTags } from '$lib/utils/blog-db.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const posts = await getPostsWithTags();

		// Transform database posts to match the expected format
		const transformedPosts = posts.map((post) => ({
			slug: post.slug,
			title: post.title,
			excerpt: post.excerpt,
			content: post.content,
			date: post.createdAt.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
			author: post.author,
			tags: post.tags,
			readTime: post.readTime,
			published: post.published,
			featured: post.featured
		}));

		return {
			posts: transformedPosts
		};
	} catch (error) {
		console.error('Error loading blog posts:', error);
		return {
			posts: []
		};
	}
};
