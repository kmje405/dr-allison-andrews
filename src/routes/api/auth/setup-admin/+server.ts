import { json } from '@sveltejs/kit';
import { DatabaseAuth } from '$lib/utils/db-auth';
import { db } from '$lib/db/connection';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		// Check if any admin user exists
		const existingAdmin = await db.select().from(users).where(eq(users.role, 'admin')).limit(1);

		if (existingAdmin.length > 0) {
			return json({ adminExists: true }, { status: 200 });
		} else {
			return json({ adminExists: false }, { status: 404 });
		}
	} catch (error) {
		console.error('Check admin API error:', error);
		return json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, password, name } = await request.json();

		if (!email || !password || !name) {
			return json(
				{ success: false, message: 'Email, password, and name are required' },
				{ status: 400 }
			);
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({ success: false, message: 'Invalid email format' }, { status: 400 });
		}

		// Basic password validation
		if (password.length < 8) {
			return json(
				{ success: false, message: 'Password must be at least 8 characters long' },
				{ status: 400 }
			);
		}

		const result = await DatabaseAuth.createAdminUser({ email, password, name });

		if (result.success) {
			return json(result, { status: 201 });
		} else {
			return json(result, { status: 400 });
		}
	} catch (error) {
		console.error('Setup admin API error:', error);
		return json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
};
