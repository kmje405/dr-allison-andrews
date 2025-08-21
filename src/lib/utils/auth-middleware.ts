import { json } from '@sveltejs/kit';
import { DatabaseAuth } from './db-auth';
import type { RequestEvent } from '@sveltejs/kit';

export interface AuthenticatedUser {
	id: number;
	email: string;
	name: string;
	role: string;
	isActive: boolean;
	emailVerified: boolean;
}

/**
 * Authentication middleware for API routes
 * Extracts and verifies JWT token from Authorization header or request body
 */
export async function requireAuth(
	request: Request
): Promise<{ user: AuthenticatedUser } | Response> {
	try {
		// Try to get token from Authorization header first
		let token = request.headers.get('Authorization');
		if (token && token.startsWith('Bearer ')) {
			token = token.substring(7);
		}

		// If no header token, try to get from request body
		if (!token) {
			try {
				const body = await request.clone().json();
				token = body.token;
			} catch {
				// Body might not be JSON or might be empty
			}
		}

		// If still no token, check for cookie (fallback)
		if (!token) {
			const cookies = request.headers.get('Cookie');
			if (cookies) {
				const tokenMatch = cookies.match(/auth_token=([^;]+)/);
				if (tokenMatch) {
					token = tokenMatch[1];
				}
			}
		}

		if (!token) {
			return json({ success: false, message: 'Authentication required' }, { status: 401 });
		}

		// Verify the token
		const user = await DatabaseAuth.verifySession(token);
		if (!user) {
			return json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
		}

		return { user };
	} catch (error) {
		console.error('Auth middleware error:', error);
		return json({ success: false, message: 'Authentication failed' }, { status: 401 });
	}
}

/**
 * Admin-only authentication middleware
 * Requires user to be authenticated AND have admin role
 */
export async function requireAdmin(
	request: Request
): Promise<{ user: AuthenticatedUser } | Response> {
	const authResult = await requireAuth(request);

	// If auth failed, return the error response
	if (authResult instanceof Response) {
		return authResult;
	}

	// Check if user is admin
	if (authResult.user.role !== 'admin') {
		return json({ success: false, message: 'Admin access required' }, { status: 403 });
	}

	return authResult;
}

/**
 * Helper function to extract token from SvelteKit RequestEvent
 */
export function getTokenFromEvent(event: RequestEvent): string | null {
	// Try Authorization header first
	const token = event.request.headers.get('Authorization');
	if (token && token.startsWith('Bearer ')) {
		return token.substring(7);
	}

	// Try cookies
	const authToken = event.cookies.get('auth_token');
	if (authToken) {
		return authToken;
	}

	return null;
}
