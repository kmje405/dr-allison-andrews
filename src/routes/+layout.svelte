<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { clientAuth } from '$lib/utils/client-auth';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';

	onMount(async () => {
		if (browser) {
			// Initialize authentication on app load
			await clientAuth.init();
		}
	});
</script>

<Navigation />
<main>
	<slot />
</main>
<Footer />

<style>
	main {
		min-height: calc(100vh - 200px); /* Adjust based on nav/footer height */
	}
</style>
