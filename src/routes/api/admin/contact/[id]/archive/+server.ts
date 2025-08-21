import { json } from '@sveltejs/kit';
import { archiveContactSubmission } from '$lib/utils/contact-db.js';
import { requireAdmin } from '$lib/utils/auth-middleware';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request }) => {
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

		const archivedSubmission = await archiveContactSubmission(submissionId);

		if (archivedSubmission) {
			return json({ success: true, message: 'Submission archived successfully' });
		} else {
			return json({ success: false, message: 'Submission not found' }, { status: 404 });
		}
	} catch (error) {
		console.error('Archive submission error:', error);
		return json({ success: false, message: 'Failed to archive submission' }, { status: 500 });
	}
};
