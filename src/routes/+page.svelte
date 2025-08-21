<script lang="ts">
	import PageTemplate from '$lib/components/PageTemplate.svelte';

	const seo = {
		title: 'Dr. Allison Andrews',
		description:
			'Welcome to the professional website of Dr. Allison Andrews. Learn about my work, research, and expertise.',
		keywords: ['Dr. Allison Andrews', 'professional', 'research', 'expertise'],
		ogType: 'website' as const
	};
</script>

<PageTemplate {seo} schemaType="WebSite">
	{#snippet children()}
		<header class="home-header">
			<h1 class="home-title">Dr. Allison Andrews</h1>
			<p class="home-subtitle">
				Welcome to my professional website. Explore my work, research, and areas of expertise.
			</p>
		</header>

		<main class="home-content">
			<section class="home-section">
				<h2>About</h2>
				<p>
					This is the professional website of Dr. Allison Andrews. Here you can learn more about my
					background, current work, and areas of expertise.
				</p>
			</section>

			<section class="home-section">
				<h2>Areas of Focus</h2>
				<ul>
					<li>Research and Development</li>
					<li>Professional Consulting</li>
					<li>Academic Collaboration</li>
					<li>Industry Partnerships</li>
				</ul>
			</section>
		</main>
	{/snippet}
</PageTemplate>

<style>
	.home-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.home-title {
		font-size: 2.5rem;
		font-weight: bold;
		color: #111827;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	@media (min-width: 768px) {
		.home-title {
			font-size: 3.75rem;
		}
	}

	.home-subtitle {
		font-size: 1.25rem;
		color: #4b5563;
		max-width: 42rem;
		margin: 0 auto;
		line-height: 1.6;
	}

	.home-content {
		max-width: 56rem;
		margin: 0 auto;
		font-size: 1.125rem;
		line-height: 1.75;
	}

	.home-section {
		margin-bottom: 3rem;
	}

	.home-section h2 {
		font-size: 1.875rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 1rem;
	}

	.home-section p {
		color: #374151;
		margin-bottom: 1rem;
	}

	.home-section ul {
		color: #374151;
		padding-left: 1.5rem;
	}

	.home-section li {
		margin-bottom: 0.5rem;
	}

	/* Dark mode styles */
	@media (prefers-color-scheme: dark) {
		.home-title {
			color: white;
		}

		.home-subtitle {
			color: #d1d5db;
		}

		.home-section h2 {
			color: white;
		}

		.home-section p,
		.home-section ul {
			color: #d1d5db;
		}
	}
</style>
