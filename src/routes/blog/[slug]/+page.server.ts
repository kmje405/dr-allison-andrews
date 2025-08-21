import { getPostWithTagsBySlug } from '$lib/utils/blog-db.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const post = await getPostWithTagsBySlug(params.slug);

		if (!post) {
			error(404, 'Blog post not found');
		}

		// Transform database post to match the expected format
		const transformedPost = {
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
		};

		return {
			post: transformedPost
		};
	} catch (err) {
		console.error('Error loading blog post:', err);
		error(404, 'Blog post not found');
	}
};
