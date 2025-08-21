<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css'; // ← this makes styles global
	import favicon from '$lib/assets/favicon.svg';
	import Navigation from '$lib/components/Navigation.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<Navigation />

{@render children?.()}
