<script lang="ts">
	import PageTemplate from '$lib/components/PageTemplate.svelte';

	const seo = {
		title: 'About',
		description:
			'Learn more about Dr. Allison Andrews, her background, education, and professional experience.',
		keywords: [
			'Dr. Allison Andrews',
			'about',
			'biography',
			'background',
			'education',
			'experience'
		],
		ogType: 'website' as const
	};
</script>

<PageTemplate {seo}>
	{#snippet children()}
		<header class="about-header">
			<h1 class="about-title">About Dr. Allison Andrews</h1>
		</header>

		<main class="about-content">
			<section class="about-section">
				<h2>Background</h2>
				<p>
					Dr. Allison Andrews brings extensive experience and expertise to her field. With a
					commitment to excellence and innovation, she has established herself as a respected
					professional and thought leader.
				</p>
			</section>

			<section class="about-section">
				<h2>Education</h2>
				<p>
					Dr. Andrews holds advanced degrees and certifications that form the foundation of her
					professional practice. Her educational background reflects a dedication to continuous
					learning and academic excellence.
				</p>
			</section>

			<section class="about-section">
				<h2>Professional Experience</h2>
				<p>
					Throughout her career, Dr. Andrews has worked with diverse organizations and clients,
					developing innovative solutions and contributing to meaningful projects. Her experience
					spans multiple areas of expertise and industry sectors.
				</p>
			</section>

			<section class="about-section">
				<h2>Philosophy</h2>
				<p>
					Dr. Andrews believes in the power of collaboration, evidence-based practice, and ethical
					leadership. She is committed to making a positive impact through her work and contributing
					to the advancement of her field.
				</p>
			</section>
		</main>
	{/snippet}
</PageTemplate>

<style>
	.about-header {
		margin-bottom: 3rem;
	}

	.about-title {
		font-size: 2.5rem;
		font-weight: bold;
		color: #111827;
		margin-bottom: 1.5rem;
		line-height: 1.2;
	}

	@media (min-width: 768px) {
		.about-title {
			font-size: 3rem;
		}
	}

	.about-content {
		max-width: 56rem;
		margin: 0 auto;
		font-size: 1.125rem;
		line-height: 1.75;
		border: 1px solid red;
	}

	.about-section {
		margin-bottom: 3rem;
	}

	.about-section h2 {
		font-size: 1.875rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 1rem;
	}

	.about-section p {
		color: #374151;
		margin-bottom: 1rem;
	}

	/* Dark mode styles */
	@media (prefers-color-scheme: dark) {
		.about-title {
			color: white;
		}

		.about-section h2 {
			color: white;
		}

		.about-section p {
			color: #d1d5db;
		}
	}
</style>
