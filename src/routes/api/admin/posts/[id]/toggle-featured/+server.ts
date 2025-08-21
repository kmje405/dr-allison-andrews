import { json } from '@sveltejs/kit';
import { togglePostFeatured } from '$lib/utils/blog-db.js';
import { requireAdmin } from '$lib/utils/auth-middleware';
import type { RequestHandler } from './$types';

// POST - Toggle featured status
export const POST: RequestHandler = async ({ params, request }) => {
	// Check authentication first
	const authResult = await requireAdmin(request);
	if (authResult instanceof Response) {
		return authResult;
	}

	try {
		const postId = parseInt(params.id);

		if (isNaN(postId)) {
			return json({ success: false, message: 'Invalid post ID' }, { status: 400 });
		}

		const updatedPost = await togglePostFeatured(postId);

		if (updatedPost) {
			return json({ success: true, post: updatedPost });
		} else {
			return json({ success: false, message: 'Post not found' }, { status: 404 });
		}
	} catch (error) {
		console.error('Error toggling featured status:', error);
		return json({ success: false, message: 'Failed to toggle featured status' }, { status: 500 });
	}
};
