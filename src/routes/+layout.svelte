<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css'; // ← this makes styles global
	import favicon from '$lib/assets/favicon.svg';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<Navigation />
<main class="site__container">
	{@render children?.()}
</main>

<Footer />

<style>
	.site__container {
		min-height: 100vh;
		border: 1px solid red;
	}
</style>
