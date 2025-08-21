<script lang="ts">
	import PageTemplate from '$lib/components/PageTemplate.svelte';

	const seo = {
		title: 'Terms of Service',
		description:
			'Terms of service for Dr. Allison Andrews website. Review the terms and conditions for using our services.',
		keywords: ['terms of service', 'terms and conditions', 'legal', 'Dr. Allison Andrews'],
		ogType: 'website' as const
	};
</script>

<PageTemplate {seo}>
	{#snippet children()}
		<header class="terms-header">
			<h1 class="terms-title">Terms of Service</h1>
			<p class="terms-subtitle">
				Last updated: {new Date().toLocaleDateString()}
			</p>
		</header>

		<main class="terms-content">
			<section class="terms-section">
				<h2>Acceptance of Terms</h2>
				<p>
					By accessing and using this website, you accept and agree to be bound by the terms and
					provision of this agreement.
				</p>
			</section>

			<section class="terms-section">
				<h2>Use License</h2>
				<p>
					Permission is granted to temporarily download one copy of the materials on Dr. Allison
					Andrews' website for personal, non-commercial transitory viewing only.
				</p>
			</section>

			<section class="terms-section">
				<h2>Disclaimer</h2>
				<p>
					The materials on Dr. Allison Andrews' website are provided on an 'as is' basis. Dr.
					Allison Andrews makes no warranties, expressed or implied, and hereby disclaims and
					negates all other warranties including without limitation, implied warranties or
					conditions of merchantability, fitness for a particular purpose, or non-infringement of
					intellectual property or other violation of rights.
				</p>
			</section>

			<section class="terms-section">
				<h2>Limitations</h2>
				<p>
					In no event shall Dr. Allison Andrews or its suppliers be liable for any damages
					(including, without limitation, damages for loss of data or profit, or due to business
					interruption) arising out of the use or inability to use the materials on Dr. Allison
					Andrews' website.
				</p>
			</section>

			<section class="terms-section">
				<h2>Contact Information</h2>
				<p>
					If you have any questions about these Terms of Service, please contact us at <a
						href="mailto:contact@drallison.com"
						class="terms-link">contact@drallison.com</a
					>.
				</p>
			</section>
		</main>
	{/snippet}
</PageTemplate>

<style>
	.terms-header {
		margin-bottom: 3rem;
	}

	.terms-title {
		font-size: 2.5rem;
		font-weight: bold;
		color: #111827;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	@media (min-width: 768px) {
		.terms-title {
			font-size: 3rem;
		}
	}

	.terms-subtitle {
		font-size: 1rem;
		color: #6b7280;
		font-style: italic;
	}

	.terms-content {
		max-width: 56rem;
		margin: 0 auto;
		font-size: 1.125rem;
		line-height: 1.75;
	}

	.terms-section {
		margin-bottom: 3rem;
	}

	.terms-section h2 {
		font-size: 1.875rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 1rem;
	}

	.terms-section p {
		color: #374151;
		margin-bottom: 1rem;
	}

	.terms-link {
		color: #fe795d;
		text-decoration: none;
	}

	.terms-link:hover {
		text-decoration: underline;
	}

	/* Dark mode styles */
	@media (prefers-color-scheme: dark) {
		.terms-title {
			color: white;
		}

		.terms-subtitle {
			color: #9ca3af;
		}

		.terms-section h2 {
			color: white;
		}

		.terms-section p {
			color: #d1d5db;
		}
	}
</style>
