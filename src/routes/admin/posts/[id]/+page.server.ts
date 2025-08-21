import { getPostById } from '$lib/utils/blog-db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const postId = parseInt(params.id);

	if (params.id === 'new') {
		// Creating a new post
		return {
			post: null,
			isNew: true
		};
	}

	if (isNaN(postId)) {
		throw error(404, 'Post not found');
	}

	try {
		const post = await getPostById(postId);

		if (!post) {
			throw error(404, 'Post not found');
		}

		return {
			post,
			isNew: false
		};
	} catch (err) {
		console.error('Error loading post:', err);
		throw error(500, 'Failed to load post');
	}
};
