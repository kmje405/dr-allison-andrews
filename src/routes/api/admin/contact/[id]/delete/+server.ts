import { json } from '@sveltejs/kit';
import { deleteContactSubmission } from '$lib/utils/contact-db.js';
import { requireAdmin } from '$lib/utils/auth-middleware';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, request }) => {
	// Check authentication first
	const authResult = await requireAdmin(request);
	if (authResult instanceof Response) {
		return authResult;
	}

	try {
		const submissionId = parseInt(params.id);

		if (isNaN(submissionId)) {
			return json({ success: false, message: 'Invalid submission ID' }, { status: 400 });
		}

		const success = await deleteContactSubmission(submissionId);

		if (success) {
			return json({ success: true, message: 'Submission deleted permanently' });
		} else {
			return json({ success: false, message: 'Submission not found' }, { status: 404 });
		}
	} catch (error) {
		console.error('Delete submission error:', error);
		return json({ success: false, message: 'Failed to delete submission' }, { status: 500 });
	}
};
