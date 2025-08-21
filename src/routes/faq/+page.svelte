<script lang="ts">
	import PageTemplate from '$lib/components/PageTemplate.svelte';

	const seo = {
		title: 'FAQ',
		description:
			"Frequently asked questions about Dr. Allison Andrews' services, expertise, and professional approach.",
		keywords: [
			'FAQ',
			'frequently asked questions',
			'services',
			'consultation',
			'Dr. Allison Andrews'
		],
		ogType: 'website' as const
	};

	// FAQ data
	const faqCategories = [
		{
			title: 'General Questions',
			questions: [
				{
					question: 'What services do you offer?',
					answer:
						'I provide professional consulting, research collaboration, and expert advisory services across my areas of expertise. Each engagement is tailored to meet specific client needs and objectives.'
				},
				{
					question: 'How can I schedule a consultation?',
					answer:
						'You can reach out through the contact page or email me directly at contact@drallison.com. I typically respond within 2-3 business days to discuss your needs and schedule an appropriate time.'
				},
				{
					question: 'What is your professional background?',
					answer:
						'I have extensive experience in my field with advanced degrees and certifications. You can learn more about my background, education, and experience on the About page.'
				}
			]
		},
		{
			title: 'Services & Consultation',
			questions: [
				{
					question: 'Do you offer remote consultations?',
					answer:
						'Yes, I offer remote consultations via video conferencing platforms. This allows me to work with clients regardless of their geographic location while maintaining the same level of professional service.'
				},
				{
					question: 'What is your typical consultation process?',
					answer:
						'The consultation process begins with an initial discussion to understand your needs, followed by a detailed proposal outlining the scope, timeline, and deliverables. Each project is customized to ensure optimal outcomes.'
				},
				{
					question: 'How do you ensure confidentiality?',
					answer:
						'I maintain strict confidentiality standards for all client engagements. Non-disclosure agreements are available when required, and all client information is handled with the utmost discretion and security.'
				}
			]
		},
		{
			title: 'Collaboration & Research',
			questions: [
				{
					question: 'Do you collaborate on research projects?',
					answer:
						"Yes, I actively collaborate on research projects with academic institutions, organizations, and fellow researchers. I'm always interested in meaningful research opportunities that advance knowledge in my field."
				},
				{
					question: 'How can I propose a collaboration?',
					answer:
						'Please contact me with details about your proposed collaboration, including objectives, timeline, and expected outcomes. I review all collaboration proposals carefully and respond promptly to those that align with my expertise and interests.'
				},
				{
					question: 'Do you accept speaking engagements?',
					answer:
						'I do accept speaking engagements at conferences, workshops, and professional events. Please provide details about your event, audience, and preferred topics when reaching out.'
				}
			]
		}
	];

	let openQuestions = $state(new Set());

	function toggleQuestion(categoryIndex: number, questionIndex: number) {
		const key = `${categoryIndex}-${questionIndex}`;
		if (openQuestions.has(key)) {
			openQuestions.delete(key);
		} else {
			openQuestions.add(key);
		}
		openQuestions = new Set(openQuestions);
	}
</script>

<PageTemplate {seo}>
	{#snippet children()}
		<header class="faq-header">
			<h1 class="faq-title">Frequently Asked Questions</h1>
			<p class="faq-subtitle">
				Find answers to common questions about my services and professional approach
			</p>
		</header>

		<main class="faq-content">
			{#each faqCategories as category, categoryIndex}
				<section class="faq-category">
					<h2 class="category-title">{category.title}</h2>

					<div class="questions-list">
						{#each category.questions as item, questionIndex}
							<div class="question-item">
								<button
									class="question-button"
									onclick={() => toggleQuestion(categoryIndex, questionIndex)}
									aria-expanded={openQuestions.has(`${categoryIndex}-${questionIndex}`)}
								>
									<span class="question-text">{item.question}</span>
									<span
										class="question-icon"
										class:open={openQuestions.has(`${categoryIndex}-${questionIndex}`)}
									>
										+
									</span>
								</button>

								{#if openQuestions.has(`${categoryIndex}-${questionIndex}`)}
									<div class="answer-content">
										<p class="answer-text">{item.answer}</p>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/each}

			<section class="contact-section">
				<h2 class="contact-title">Still Have Questions?</h2>
				<p class="contact-description">
					If you don't find the answer you're looking for, please don't hesitate to
					<a href="/contact" class="contact-link">get in touch</a>. I'm happy to discuss your
					specific needs and answer any additional questions you may have.
				</p>
			</section>
		</main>
	{/snippet}
</PageTemplate>

<style>
	.faq-header {
		margin-bottom: 3rem;
		text-align: center;
	}

	.faq-title {
		font-size: 2.5rem;
		font-weight: bold;
		color: #111827;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	@media (min-width: 768px) {
		.faq-title {
			font-size: 3rem;
		}
	}

	.faq-subtitle {
		font-size: 1.25rem;
		color: #6b7280;
		max-width: 42rem;
		margin: 0 auto;
	}

	.faq-content {
		max-width: 56rem;
		margin: 0 auto;
	}

	.faq-category {
		margin-bottom: 3rem;
	}

	.category-title {
		font-size: 1.875rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #fe795d;
	}

	.questions-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.question-item {
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		overflow: hidden;
		background-color: white;
	}

	.question-button {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		background: none;
		border: none;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.2s ease-in-out;
	}

	.question-button:hover {
		background-color: #f9fafb;
	}

	.question-text {
		font-size: 1.125rem;
		font-weight: 500;
		color: #111827;
		flex: 1;
		margin-right: 1rem;
	}

	.question-icon {
		font-size: 1.5rem;
		font-weight: bold;
		color: #fe795d;
		transition: transform 0.2s ease-in-out;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.question-icon.open {
		transform: rotate(45deg);
	}

	.answer-content {
		padding: 0 1.5rem 1.5rem;
		border-top: 1px solid #f3f4f6;
	}

	.answer-text {
		color: #374151;
		line-height: 1.6;
		margin: 0;
		padding-top: 1rem;
	}

	.contact-section {
		margin-top: 4rem;
		padding: 2rem;
		background-color: #f9fafb;
		border-radius: 0.5rem;
		text-align: center;
	}

	.contact-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 1rem;
	}

	.contact-description {
		color: #6b7280;
		font-size: 1.125rem;
		line-height: 1.6;
	}

	.contact-link {
		color: #fe795d;
		text-decoration: none;
	}

	.contact-link:hover {
		text-decoration: underline;
	}

	/* Dark mode styles */
	@media (prefers-color-scheme: dark) {
		.faq-title {
			color: white;
		}

		.faq-subtitle {
			color: #9ca3af;
		}

		.category-title {
			color: white;
		}

		.question-item {
			background-color: #1f2937;
			border-color: #374151;
		}

		.question-button:hover {
			background-color: #374151;
		}

		.question-text {
			color: white;
		}

		.answer-content {
			border-top-color: #374151;
		}

		.answer-text {
			color: #d1d5db;
		}

		.contact-section {
			background-color: #1f2937;
		}

		.contact-title {
			color: white;
		}

		.contact-description {
			color: #9ca3af;
		}
	}
</style>
