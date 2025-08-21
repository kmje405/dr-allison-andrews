import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Netlify adapter configuration
		adapter: adapter({
			// Enable edge functions for server-side rendering
			edge: false,
			// Split routes for better performance
			split: false
		})
	}
};

export default config;
