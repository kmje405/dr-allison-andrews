<script lang="ts">
	import PageTemplate from '$lib/components/PageTemplate.svelte';

	const seo = {
		title: 'Contact',
		description:
			'Get in touch with Dr. Allison Andrews. Find contact information and ways to connect for professional inquiries.',
		keywords: [
			'Dr. Allison Andrews',
			'contact',
			'get in touch',
			'professional inquiries',
			'consultation'
		],
		ogType: 'website' as const
	};
</script>

<PageTemplate {seo}>
	{#snippet children()}
		<header class="contact-header">
			<h1 class="contact-title">Contact Dr. Allison Andrews</h1>
			<p class="contact-subtitle">
				Get in touch for professional inquiries, consultations, or collaboration opportunities.
			</p>
		</header>

		<main class="contact-content">
			<section class="contact-info">
				<h2 class="section-title">Contact Information</h2>

				<div class="contact-items">
					<div class="contact-item">
						<div class="contact-icon">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								></path>
							</svg>
						</div>
						<div class="contact-details">
							<h3 class="contact-method">Email</h3>
							<p class="contact-value">contact@drallison.com</p>
						</div>
					</div>

					<div class="contact-item">
						<div class="contact-icon">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								></path>
							</svg>
						</div>
						<div class="contact-details">
							<h3 class="contact-method">Location</h3>
							<p class="contact-value">Available for remote consultations</p>
						</div>
					</div>
				</div>
			</section>

			<section class="services-section">
				<h2 class="section-title">Professional Services</h2>

				<div class="services-grid">
					<div class="service-card">
						<h3 class="service-title">Consultations</h3>
						<p class="service-description">Professional consulting services and expert advice</p>
					</div>

					<div class="service-card">
						<h3 class="service-title">Collaboration</h3>
						<p class="service-description">Research partnerships and academic collaboration</p>
					</div>

					<div class="service-card">
						<h3 class="service-title">Speaking</h3>
						<p class="service-description">
							Conference presentations and professional speaking engagements
						</p>
					</div>
				</div>
			</section>
		</main>

		<footer class="contact-footer">
			<p class="footer-text">
				For all professional inquiries, please allow 2-3 business days for a response.
			</p>
		</footer>
	{/snippet}
</PageTemplate>

<style>
	.contact-header {
		margin-bottom: 3rem;
	}

	.contact-title {
		font-size: 2.5rem;
		font-weight: bold;
		color: #111827;
		margin-bottom: 1.5rem;
		line-height: 1.2;
	}

	@media (min-width: 768px) {
		.contact-title {
			font-size: 3rem;
		}
	}

	.contact-subtitle {
		font-size: 1.25rem;
		color: #4b5563;
		line-height: 1.6;
	}

	.contact-content {
		display: grid;
		gap: 3rem;
		max-width: 75rem;
		margin: 0 auto;
		border: 1px solid red;
	}

	@media (min-width: 768px) {
		.contact-content {
			grid-template-columns: 1fr 1fr;
		}
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 1.5rem;
	}

	.contact-items {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.contact-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.contact-icon {
		flex-shrink: 0;
		width: 1.5rem;
		height: 1.5rem;
		color: #fe795d;
	}

	.contact-method {
		font-weight: 500;
		color: #111827;
		margin-bottom: 0.25rem;
	}

	.contact-value {
		color: #4b5563;
	}

	.services-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.service-card {
		padding: 1rem;
		background-color: #f9fafb;
		border-radius: 0.5rem;
	}

	.service-title {
		font-weight: 500;
		color: #111827;
		margin-bottom: 0.5rem;
	}

	.service-description {
		color: #4b5563;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.contact-footer {
		margin-top: 3rem;
		padding: 1.5rem;
		background-color: #fff5f2;
		border-radius: 0.5rem;
		max-width: 75rem;
		margin-left: auto;
		margin-right: auto;
	}

	.footer-text {
		text-align: center;
		color: #4b5563;
		margin: 0;
	}

	/* Dark mode styles */
	@media (prefers-color-scheme: dark) {
		.contact-title {
			color: white;
		}

		.contact-subtitle {
			color: #d1d5db;
		}

		.section-title {
			color: white;
		}

		.contact-method {
			color: white;
		}

		.contact-value {
			color: #d1d5db;
		}

		.service-card {
			background-color: #374151;
		}

		.service-title {
			color: white;
		}

		.service-description {
			color: #d1d5db;
		}

		.contact-footer {
			background-color: #374151;
		}

		.footer-text {
			color: #d1d5db;
		}
	}
</style>
