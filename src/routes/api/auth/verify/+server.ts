import { json } from '@sveltejs/kit';
import { DatabaseAuth } from '$lib/utils/db-auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { token } = await request.json();

		if (!token) {
			return json({ success: false, message: 'Token is required' }, { status: 400 });
		}

		const user = await DatabaseAuth.verifySession(token);

		if (user) {
			return json({ success: true, user }, { status: 200 });
		} else {
			return json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
		}
	} catch (error) {
		console.error('Verify API error:', error);
		return json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
};
