import { json } from '@sveltejs/kit';
import { togglePostPublished } from '$lib/utils/blog-db.js';
import { requireAdmin } from '$lib/utils/auth-middleware';
import type { RequestHandler } from './$types';

// POST - Toggle published status
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

		const updatedPost = await togglePostPublished(postId);

		if (updatedPost) {
			return json({ success: true, post: updatedPost });
		} else {
			return json({ success: false, message: 'Post not found' }, { status: 404 });
		}
	} catch (error) {
		console.error('Error toggling published status:', error);
		return json({ success: false, message: 'Failed to toggle published status' }, { status: 500 });
	}
};
