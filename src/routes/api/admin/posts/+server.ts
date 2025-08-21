import { json } from '@sveltejs/kit';
import { createBlogPost, getPostsWithTags } from '$lib/utils/blog-db.js';
import type { RequestHandler } from './$types';

// GET - Get all posts for admin
export const GET: RequestHandler = async () => {
	try {
		const posts = await getPostsWithTags();
		return json(posts);
	} catch (error) {
		console.error('Error fetching posts:', error);
		return json({ error: 'Failed to fetch posts' }, { status: 500 });
	}
};

// POST - Create new blog post
export const POST: RequestHandler = async ({ request }) => {
	try {
		const postData = await request.json();

		// Validate required fields
		if (!postData.title || !postData.slug || !postData.content) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const newPost = await createBlogPost({
			slug: postData.slug,
			title: postData.title,
			excerpt: postData.excerpt || '',
			content: postData.content,
			author: postData.author || 'Dr. Allison Andrews',
			readTime: postData.readTime || '5 min read',
			published: postData.published || false,
			featured: postData.featured || false,
			tags: postData.tags || []
		});

		return json(newPost, { status: 201 });
	} catch (error) {
		console.error('Error creating post:', error);
		return json({ error: 'Failed to create post' }, { status: 500 });
	}
};
