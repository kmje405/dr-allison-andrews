import { json } from '@sveltejs/kit';
import { DatabaseAuth } from '$lib/utils/db-auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { token } = await request.json();

		if (!token) {
			return json({ success: false, message: 'Token is required' }, { status: 400 });
		}

		await DatabaseAuth.logout(token);
		return json({ success: true, message: 'Logged out successfully' }, { status: 200 });
	} catch (error) {
		console.error('Logout API error:', error);
		return json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
};
