<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css'; // ← this makes styles global
	import { dev } from '$app/environment';
	import favicon from '$lib/assets/favicon.svg';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import BreakpointRuler from '$lib/components/BreakpointRuler.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<!-- Development tools (only in dev mode) -->
{#if dev}
	<BreakpointRuler />
{/if}
<Navigation />
<main class="site__container">
	{@render children?.()}
</main>

<Footer />

<style>
	.site__container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
