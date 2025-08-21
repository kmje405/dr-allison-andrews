import { json } from '@sveltejs/kit';
import { DatabaseAuth } from '$lib/utils/db-auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return json({ success: false, message: 'Email and password are required' }, { status: 400 });
		}

		const result = await DatabaseAuth.login({ email, password });

		if (result.success) {
			return json(result, { status: 200 });
		} else {
			return json(result, { status: 401 });
		}
	} catch (error) {
		console.error('Login API error:', error);
		return json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
};
