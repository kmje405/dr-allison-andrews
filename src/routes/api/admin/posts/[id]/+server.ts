import { json } from '@sveltejs/kit';
import { updateBlogPost, deleteBlogPost } from '$lib/utils/blog-db.js';
import type { RequestHandler } from './$types';

// PUT - Update blog post
export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const postId = parseInt(params.id);
		const postData = await request.json();

		if (isNaN(postId)) {
			return json({ success: false, message: 'Invalid post ID' }, { status: 400 });
		}

		const updatedPost = await updateBlogPost(postId, postData);

		if (updatedPost) {
			return json({ success: true, post: updatedPost });
		} else {
			return json({ success: false, message: 'Post not found' }, { status: 404 });
		}
	} catch (error) {
		console.error('Error updating post:', error);
		return json({ success: false, message: 'Failed to update post' }, { status: 500 });
	}
};

// DELETE - Delete blog post
export const DELETE: RequestHandler = async ({ params }) => {
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
		console.error('Error deleting post:', error);
		return json({ success: false, message: 'Failed to delete post' }, { status: 500 });
	}
};
