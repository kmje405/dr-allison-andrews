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

	let isSubmitting = $state(false);
	let submitMessage = $state('');
	let submitSuccess = $state(false);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isSubmitting = true;
		submitMessage = '';
		submitSuccess = false;

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.success) {
				submitSuccess = true;
				submitMessage = result.message;
				form.reset();
			} else {
				submitSuccess = false;
				submitMessage = result.message || 'Failed to send message. Please try again.';
			}
		} catch (error) {
			submitSuccess = false;
			submitMessage = 'Failed to send message. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
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

			<section class="contact-form-section">
				<h2 class="section-title">Send a Message</h2>

				<form
					name="contact"
					method="POST"
					data-netlify="true"
					data-netlify-honeypot="bot-field"
					class="contact-form"
					onsubmit={handleSubmit}
				>
					<!-- Hidden field for Netlify -->
					<input type="hidden" name="form-name" value="contact" />

					<!-- Honeypot field for spam protection -->
					<div style="display: none;">
						<label>Don't fill this out if you're human: <input name="bot-field" /></label>
					</div>

					<div class="form-group">
						<label for="name" class="form-label">Name *</label>
						<input
							type="text"
							id="name"
							name="name"
							required
							class="form-input"
							placeholder="Your full name"
						/>
					</div>

					<div class="form-group">
						<label for="email" class="form-label">Email *</label>
						<input
							type="email"
							id="email"
							name="email"
							required
							class="form-input"
							placeholder="your.email@example.com"
						/>
					</div>

					<div class="form-group">
						<label for="subject" class="form-label">Subject</label>
						<input
							type="text"
							id="subject"
							name="subject"
							class="form-input"
							placeholder="Brief subject line"
						/>
					</div>

					<div class="form-group">
						<label for="message" class="form-label">Message *</label>
						<textarea
							id="message"
							name="message"
							required
							rows="6"
							class="form-textarea"
							placeholder="Please describe your inquiry or how I can help you..."
						></textarea>
					</div>

					{#if submitMessage}
						<div class="submit-message" class:success={submitSuccess} class:error={!submitSuccess}>
							{submitMessage}
						</div>
					{/if}

					<button type="submit" class="submit-button" disabled={isSubmitting}>
						{isSubmitting ? 'Sending...' : 'Send Message'}
					</button>
				</form>
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
	}

	@media (min-width: 768px) {
		.contact-content {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 1024px) {
		.contact-content {
			grid-template-columns: 1fr 1fr 1fr;
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

	/* Contact Form Styles */
	.contact-form-section {
		grid-column: 1 / -1;
		margin-top: 2rem;
	}

	.contact-form {
		max-width: 40rem;
		margin: 0 auto;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-label {
		display: block;
		font-weight: 500;
		color: #111827;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
	}

	.form-input,
	.form-textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 1rem;
		transition:
			border-color 0.2s ease-in-out,
			box-shadow 0.2s ease-in-out;
		background-color: white;
	}

	.form-input:focus,
	.form-textarea:focus {
		outline: none;
		border-color: #fe795d;
		box-shadow: 0 0 0 3px rgba(254, 121, 93, 0.1);
	}

	.form-textarea {
		resize: vertical;
		min-height: 120px;
	}

	.submit-button {
		background-color: #fe795d;
		color: white;
		font-weight: 500;
		padding: 0.75rem 2rem;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		transition:
			background-color 0.2s ease-in-out,
			transform 0.1s ease-in-out;
		font-size: 1rem;
		width: 100%;
	}

	.submit-button:hover {
		background-color: #ef562f;
		transform: translateY(-1px);
	}

	.submit-button:active {
		transform: translateY(0);
	}

	.submit-button:disabled {
		background-color: #9ca3af;
		cursor: not-allowed;
		transform: none;
	}

	.submit-message {
		padding: 0.75rem;
		border-radius: 0.375rem;
		margin-bottom: 1rem;
		font-weight: 500;
	}

	.submit-message.success {
		background-color: #d1fae5;
		color: #065f46;
		border: 1px solid #a7f3d0;
	}

	.submit-message.error {
		background-color: #fee2e2;
		color: #991b1b;
		border: 1px solid #fca5a5;
	}

	@media (min-width: 640px) {
		.submit-button {
			width: auto;
		}
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

		.form-label {
			color: white;
		}

		.form-input,
		.form-textarea {
			background-color: #374151;
			border-color: #4b5563;
			color: white;
		}

		.form-input:focus,
		.form-textarea:focus {
			border-color: #fe795d;
			box-shadow: 0 0 0 3px rgba(254, 121, 93, 0.1);
		}

		.form-input::placeholder,
		.form-textarea::placeholder {
			color: #9ca3af;
		}

		.submit-message.success {
			background-color: #064e3b;
			color: #a7f3d0;
			border-color: #065f46;
		}

		.submit-message.error {
			background-color: #7f1d1d;
			color: #fca5a5;
			border-color: #991b1b;
		}
	}
</style>
