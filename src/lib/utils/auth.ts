import { browser } from '$app/environment';
import { writable } from 'svelte/store';

// Types for Netlify Identity
interface NetlifyUser {
	id: string;
	email: string;
	user_metadata: {
		full_name?: string;
		avatar_url?: string;
	};
	app_metadata: {
		roles?: string[];
	};
}

interface NetlifyIdentity {
	init: (config?: Record<string, unknown>) => void;
	open: (tab?: string) => void;
	close: () => void;
	currentUser: () => NetlifyUser | null;
	on: (event: string, callback: (user?: NetlifyUser) => void) => void;
	off: (event: string, callback: (user?: NetlifyUser) => void) => void;
	logout: () => void;
}

declare global {
	interface Window {
		netlifyIdentity: NetlifyIdentity;
	}
}

// Auth store
export const user = writable<NetlifyUser | null>(null);
export const isAuthenticated = writable<boolean>(false);
export const isAdmin = writable<boolean>(false);

// Initialize Netlify Identity
export function initAuth() {
	if (!browser || !window.netlifyIdentity) return;

	// Initialize Netlify Identity
	window.netlifyIdentity.init();

	// Set initial user state
	const currentUser = window.netlifyIdentity.currentUser();
	if (currentUser) {
		user.set(currentUser);
		isAuthenticated.set(true);
		isAdmin.set(checkAdminRole(currentUser));
	}

	// Listen for auth events
	window.netlifyIdentity.on('login', (authUser) => {
		if (authUser) {
			user.set(authUser);
			isAuthenticated.set(true);
			isAdmin.set(checkAdminRole(authUser));
			window.netlifyIdentity.close();
		}
	});

	window.netlifyIdentity.on('logout', () => {
		user.set(null);
		isAuthenticated.set(false);
		isAdmin.set(false);
	});
}

// Check if user has admin role
function checkAdminRole(user: NetlifyUser): boolean {
	return user.app_metadata?.roles?.includes('admin') || false;
}

// Auth actions
export const auth = {
	login: () => {
		if (browser && window.netlifyIdentity) {
			window.netlifyIdentity.open('login');
		}
	},

	signup: () => {
		if (browser && window.netlifyIdentity) {
			window.netlifyIdentity.open('signup');
		}
	},

	logout: () => {
		if (browser && window.netlifyIdentity) {
			window.netlifyIdentity.logout();
		}
	},

	getCurrentUser: (): NetlifyUser | null => {
		if (browser && window.netlifyIdentity) {
			return window.netlifyIdentity.currentUser();
		}
		return null;
	}
};

// Admin guard function
export function requireAdmin(): boolean {
	const currentUser = auth.getCurrentUser();
	return currentUser ? checkAdminRole(currentUser) : false;
}

// Route protection helper
export function protectAdminRoute() {
	if (!browser) return true; // Allow SSR

	const currentUser = auth.getCurrentUser();
	if (!currentUser || !checkAdminRole(currentUser)) {
		// Redirect to home or show login
		window.location.href = '/';
		return false;
	}
	return true;
}
