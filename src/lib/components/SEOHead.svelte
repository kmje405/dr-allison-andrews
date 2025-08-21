<script lang="ts">
	import { page } from '$app/stores';
	import {
		mergeSEO,
		generateTitle,
		generateCanonical,
		generateJsonLd,
		type SEOData
	} from '$lib/utils/seo.js';

	interface Props {
		seo?: Partial<SEOData>;
		schemaType?: 'WebSite' | 'WebPage' | 'Article' | 'Person';
	}

	let { seo = {}, schemaType = 'WebPage' }: Props = $props();

	// Merge with defaults and generate computed values
	const finalSEO = $derived(() => {
		const merged = mergeSEO(seo);
		const currentUrl = $page.url.pathname;

		return {
			...merged,
			title: generateTitle(merged.title),
			canonical: merged.canonical || generateCanonical(currentUrl),
			ogUrl: merged.ogUrl || generateCanonical(currentUrl),
			ogTitle: merged.ogTitle || merged.title,
			ogDescription: merged.ogDescription || merged.description,
			twitterTitle: merged.twitterTitle || merged.title,
			twitterDescription: merged.twitterDescription || merged.description
		};
	});

	// Generate JSON-LD structured data
	const jsonLdData = $derived(() => {
		const data = generateJsonLd(finalSEO(), schemaType);
		return JSON.stringify(data);
	});
</script>

<svelte:head>
	<!-- Basic Meta Tags -->
	<title>{finalSEO().title}</title>
	<meta name="description" content={finalSEO().description} />
	{#if finalSEO().keywords && finalSEO().keywords.length > 0}
		<meta name="keywords" content={finalSEO().keywords.join(', ')} />
	{/if}
	{#if finalSEO().author}
		<meta name="author" content={finalSEO().author} />
	{/if}
	{#if finalSEO().robots}
		<meta name="robots" content={finalSEO().robots} />
	{/if}

	<!-- Canonical URL -->
	{#if finalSEO().canonical}
		<link rel="canonical" href={finalSEO().canonical} />
	{/if}

	<!-- Open Graph Meta Tags -->
	{#if finalSEO().ogTitle}
		<meta property="og:title" content={finalSEO().ogTitle} />
	{/if}
	{#if finalSEO().ogDescription}
		<meta property="og:description" content={finalSEO().ogDescription} />
	{/if}
	{#if finalSEO().ogType}
		<meta property="og:type" content={finalSEO().ogType} />
	{/if}
	{#if finalSEO().ogUrl}
		<meta property="og:url" content={finalSEO().ogUrl} />
	{/if}
	{#if finalSEO().ogSiteName}
		<meta property="og:site_name" content={finalSEO().ogSiteName} />
	{/if}
	{#if finalSEO().ogImage}
		<meta property="og:image" content={finalSEO().ogImage} />
		{#if finalSEO().ogImageAlt}
			<meta property="og:image:alt" content={finalSEO().ogImageAlt} />
		{/if}
	{/if}

	<!-- Twitter Card Meta Tags -->
	{#if finalSEO().twitterCard}
		<meta name="twitter:card" content={finalSEO().twitterCard} />
	{/if}
	{#if finalSEO().twitterSite}
		<meta name="twitter:site" content={finalSEO().twitterSite} />
	{/if}
	{#if finalSEO().twitterCreator}
		<meta name="twitter:creator" content={finalSEO().twitterCreator} />
	{/if}
	{#if finalSEO().twitterTitle}
		<meta name="twitter:title" content={finalSEO().twitterTitle} />
	{/if}
	{#if finalSEO().twitterDescription}
		<meta name="twitter:description" content={finalSEO().twitterDescription} />
	{/if}
	{#if finalSEO().twitterImage}
		<meta name="twitter:image" content={finalSEO().twitterImage} />
		{#if finalSEO().twitterImageAlt}
			<meta name="twitter:image:alt" content={finalSEO().twitterImageAlt} />
		{/if}
	{/if}

	<!-- Article Meta Tags (for blog posts, etc.) -->
	{#if finalSEO().articleAuthor}
		<meta property="article:author" content={finalSEO().articleAuthor} />
	{/if}
	{#if finalSEO().articlePublishedTime}
		<meta property="article:published_time" content={finalSEO().articlePublishedTime} />
	{/if}
	{#if finalSEO().articleModifiedTime}
		<meta property="article:modified_time" content={finalSEO().articleModifiedTime} />
	{/if}
	{#if finalSEO().articleSection}
		<meta property="article:section" content={finalSEO().articleSection} />
	{/if}
	{#if finalSEO().articleTags && finalSEO().articleTags.length > 0}
		{#each finalSEO().articleTags || [] as tag}
			<meta property="article:tag" content={String(tag)} />
		{/each}
	{/if}

	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">${jsonLdData()}</script>`}
</svelte:head>
