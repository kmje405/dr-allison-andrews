<script lang="ts">
	import PageTemplate from '$lib/components/PageTemplate.svelte';

	const seo = {
		title: 'Accessibility',
		description:
			'Accessibility statement for Dr. Allison Andrews website. Learn about our commitment to web accessibility and inclusive design.',
		keywords: [
			'accessibility',
			'web accessibility',
			'inclusive design',
			'WCAG',
			'Dr. Allison Andrews'
		],
		ogType: 'website' as const
	};
</script>

<PageTemplate {seo}>
	{#snippet children()}
		<header class="accessibility-header">
			<h1 class="accessibility-title">Accessibility Statement</h1>
			<p class="accessibility-subtitle">Our commitment to inclusive web design</p>
		</header>

		<main class="accessibility-content">
			<section class="accessibility-section">
				<h2>Our Commitment</h2>
				<p>
					Dr. Allison Andrews is committed to ensuring digital accessibility for people with
					disabilities. We are continually improving the user experience for everyone and applying
					the relevant accessibility standards.
				</p>
			</section>

			<section class="accessibility-section">
				<h2>Accessibility Standards</h2>
				<p>
					This website strives to conform to the Web Content Accessibility Guidelines (WCAG) 2.1
					Level AA standards. These guidelines explain how to make web content more accessible to
					people with disabilities.
				</p>
			</section>

			<section class="accessibility-section">
				<h2>Accessibility Features</h2>
				<ul class="accessibility-list">
					<li>Semantic HTML structure for screen readers</li>
					<li>Keyboard navigation support</li>
					<li>High contrast color schemes</li>
					<li>Descriptive alt text for images</li>
					<li>Proper heading hierarchy</li>
					<li>Focus indicators for interactive elements</li>
				</ul>
			</section>

			<section class="accessibility-section">
				<h2>Feedback and Contact</h2>
				<p>
					We welcome your feedback on the accessibility of this website. If you encounter any
					accessibility barriers, please contact us at <a
						href="mailto:contact@drallison.com"
						class="accessibility-link">contact@drallison.com</a
					>.
				</p>
			</section>

			<section class="accessibility-section">
				<h2>Continuous Improvement</h2>
				<p>
					We regularly review and test our website for accessibility issues and work to address any
					problems that are identified. This is an ongoing process as we strive to provide the best
					possible experience for all users.
				</p>
			</section>
		</main>
	{/snippet}
</PageTemplate>

<style>
	.accessibility-header {
		margin-bottom: 3rem;
	}

	.accessibility-title {
		font-size: 2.5rem;
		font-weight: bold;
		color: #111827;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	@media (min-width: 768px) {
		.accessibility-title {
			font-size: 3rem;
		}
	}

	.accessibility-subtitle {
		font-size: 1.25rem;
		color: #6b7280;
		font-style: italic;
	}

	.accessibility-content {
		max-width: 56rem;
		margin: 0 auto;
		font-size: 1.125rem;
		line-height: 1.75;
	}

	.accessibility-section {
		margin-bottom: 3rem;
	}

	.accessibility-section h2 {
		font-size: 1.875rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 1rem;
	}

	.accessibility-section p {
		color: #374151;
		margin-bottom: 1rem;
	}

	.accessibility-list {
		color: #374151;
		padding-left: 1.5rem;
		margin-bottom: 1rem;
	}

	.accessibility-list li {
		margin-bottom: 0.5rem;
	}

	.accessibility-link {
		color: #fe795d;
		text-decoration: none;
	}

	.accessibility-link:hover {
		text-decoration: underline;
	}

	/* Dark mode styles */
	@media (prefers-color-scheme: dark) {
		.accessibility-title {
			color: white;
		}

		.accessibility-subtitle {
			color: #9ca3af;
		}

		.accessibility-section h2 {
			color: white;
		}

		.accessibility-section p,
		.accessibility-list {
			color: #d1d5db;
		}
	}
</style>
