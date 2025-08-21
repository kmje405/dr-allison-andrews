import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Types
export interface AuthUser {
	id: number;
	email: string;
	name: string;
	role: string;
	isActive: boolean;
	emailVerified: boolean;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

// Stores
export const currentUser = writable<AuthUser | null>(null);
export const isAuthenticated = writable<boolean>(false);
export const isAdmin = writable<boolean>(false);

// Client-side auth helpers
export const clientAuth = {
	// Initialize auth state from stored token
	async init() {
		if (!browser) return;

		const token = localStorage.getItem('auth_token');
		if (token) {
			// Verify token with server
			await this.verifyStoredToken(token);
		}
	},

	// Verify stored token with server
	async verifyStoredToken(token: string) {
		try {
			const response = await fetch('/api/auth/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token })
			});

			if (response.ok) {
				const { user } = await response.json();
				this.setAuthState(user, token);
			} else {
				this.clearAuthState();
			}
		} catch (error) {
			console.error('Token verification failed:', error);
			this.clearAuthState();
		}
	},

	// Set authentication state
	setAuthState(user: AuthUser, token: string) {
		if (browser) {
			localStorage.setItem('auth_token', token);
		}
		currentUser.set(user);
		isAuthenticated.set(true);
		isAdmin.set(user.role === 'admin');
	},

	// Clear authentication state
	clearAuthState() {
		if (browser) {
			localStorage.removeItem('auth_token');
		}
		currentUser.set(null);
		isAuthenticated.set(false);
		isAdmin.set(false);
	},

	// Get stored token
	getToken(): string | null {
		if (!browser) return null;
		return localStorage.getItem('auth_token');
	},

	// Login
	async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string }> {
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials)
			});

			const result = await response.json();

			if (result.success) {
				this.setAuthState(result.user, result.token);
			}

			return result;
		} catch (error) {
			console.error('Login failed:', error);
			return { success: false, message: 'Login failed' };
		}
	},

	// Logout
	async logout(): Promise<void> {
		const token = this.getToken();
		if (token) {
			try {
				await fetch('/api/auth/logout', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ token })
				});
			} catch (error) {
				console.error('Logout request failed:', error);
			}
		}
		this.clearAuthState();
	}
};
