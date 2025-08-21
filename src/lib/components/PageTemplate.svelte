<script lang="ts">
	import SEOHead from './SEOHead.svelte';
	import type { SEOData } from '$lib/utils/seo.js';

	interface Props {
		seo?: Partial<SEOData>;
		schemaType?: 'WebSite' | 'WebPage' | 'Article' | 'Person';
		containerClass?: string;
		children?: import('svelte').Snippet;
	}

	let {
		seo = {},
		schemaType = 'WebPage',
		containerClass = 'page-container',
		children
	}: Props = $props();
</script>

<SEOHead {seo} {schemaType} />

<div class={containerClass}>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	/* Page container with responsive margins */
	:global(.page-container) {
		width: 100%;
		max-width: 1280px;
		margin-left: auto;
		margin-right: auto;
		display: block;
		box-sizing: border-box;
		position: relative;
		padding: 1.5rem 1rem;
	}

	/* Responsive padding for different screen sizes */
	@media (min-width: 640px) {
		:global(.page-container) {
			padding: 2rem 1.5rem;
		}
	}

	@media (min-width: 768px) {
		:global(.page-container) {
			padding: 3rem 2rem;
		}
	}

	@media (min-width: 1024px) {
		:global(.page-container) {
			padding: 4rem 3rem;
		}
	}

	@media (min-width: 1280px) {
		:global(.page-container) {
			padding: 5rem 4rem;
		}
	}

	/* Force centering by using flexbox on parent if needed */
	:global(body) {
		margin: 0;
		padding: 0;
	}

	/* Ensure main container is properly centered */
	:global(.site__container) {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		min-height: 100vh;
		margin: 0;
		padding: 0;
	}
</style>
