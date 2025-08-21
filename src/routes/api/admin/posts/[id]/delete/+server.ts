import { json } from '@sveltejs/kit';
import { deleteBlogPost } from '$lib/utils/blog-db';
import { requireAdmin } from '$lib/utils/auth-middleware';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, request }) => {
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

		const success = await deleteBlogPost(postId);

		if (success) {
			return json({ success: true, message: 'Post deleted successfully' });
		} else {
			return json({ success: false, message: 'Post not found' }, { status: 404 });
		}
	} catch (error) {
		console.error('Delete post error:', error);
		return json({ success: false, message: 'Failed to delete post' }, { status: 500 });
	}
};
