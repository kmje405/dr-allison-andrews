<script lang="ts">
	import PageTemplate from '$lib/components/PageTemplate.svelte';

	const seo = {
		title: 'Privacy Policy',
		description:
			'Privacy policy for Dr. Allison Andrews website. Learn how we collect, use, and protect your personal information.',
		keywords: ['privacy policy', 'data protection', 'personal information', 'Dr. Allison Andrews'],
		ogType: 'website' as const
	};
</script>

<PageTemplate {seo}>
	{#snippet children()}
		<header class="privacy-header">
			<h1 class="privacy-title">Privacy Policy</h1>
			<p class="privacy-subtitle">
				Last updated: {new Date().toLocaleDateString()}
			</p>
		</header>

		<main class="privacy-content">
			<section class="privacy-section">
				<h2>Information We Collect</h2>
				<p>
					This privacy policy describes how Dr. Allison Andrews collects, uses, and protects your
					personal information when you visit our website.
				</p>
			</section>

			<section class="privacy-section">
				<h2>How We Use Your Information</h2>
				<p>
					We use the information we collect to provide and improve our services, communicate with
					you, and ensure the security of our website.
				</p>
			</section>

			<section class="privacy-section">
				<h2>Data Protection</h2>
				<p>
					We implement appropriate security measures to protect your personal information against
					unauthorized access, alteration, disclosure, or destruction.
				</p>
			</section>

			<section class="privacy-section">
				<h2>Contact Us</h2>
				<p>
					If you have any questions about this Privacy Policy, please contact us at <a
						href="mailto:contact@drallison.com"
						class="privacy-link">contact@drallison.com</a
					>.
				</p>
			</section>
		</main>
	{/snippet}
</PageTemplate>

<style>
	.privacy-header {
		margin-bottom: 3rem;
	}

	.privacy-title {
		font-size: 2.5rem;
		font-weight: bold;
		color: #111827;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	@media (min-width: 768px) {
		.privacy-title {
			font-size: 3rem;
		}
	}

	.privacy-subtitle {
		font-size: 1rem;
		color: #6b7280;
		font-style: italic;
	}

	.privacy-content {
		max-width: 56rem;
		margin: 0 auto;
		font-size: 1.125rem;
		line-height: 1.75;
	}

	.privacy-section {
		margin-bottom: 3rem;
	}

	.privacy-section h2 {
		font-size: 1.875rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 1rem;
	}

	.privacy-section p {
		color: #374151;
		margin-bottom: 1rem;
	}

	.privacy-link {
		color: #fe795d;
		text-decoration: none;
	}

	.privacy-link:hover {
		text-decoration: underline;
	}

	/* Dark mode styles */
	@media (prefers-color-scheme: dark) {
		.privacy-title {
			color: white;
		}

		.privacy-subtitle {
			color: #9ca3af;
		}

		.privacy-section h2 {
			color: white;
		}

		.privacy-section p {
			color: #d1d5db;
		}
	}
</style>
