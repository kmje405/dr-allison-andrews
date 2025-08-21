<script lang="ts">
	import PageTemplate from '$lib/components/PageTemplate.svelte';

	const seo = {
		title: 'Resources',
		description:
			'Helpful resources, tools, and materials curated by Dr. Allison Andrews for professionals and researchers.',
		keywords: [
			'resources',
			'tools',
			'materials',
			'professional development',
			'Dr. Allison Andrews'
		],
		ogType: 'website' as const
	};

	// Placeholder resource categories
	const resourceCategories = [
		{
			title: 'Professional Development',
			description: 'Tools and resources for advancing your professional skills and knowledge.',
			resources: [
				{ name: 'Industry Best Practices Guide', type: 'PDF', url: '#' },
				{ name: 'Professional Development Checklist', type: 'Document', url: '#' },
				{ name: 'Networking Strategies', type: 'Article', url: '#' }
			]
		},
		{
			title: 'Research Tools',
			description: 'Essential tools and methodologies for conducting effective research.',
			resources: [
				{ name: 'Research Methodology Framework', type: 'PDF', url: '#' },
				{ name: 'Data Analysis Templates', type: 'Spreadsheet', url: '#' },
				{ name: 'Citation Management Guide', type: 'Guide', url: '#' }
			]
		},
		{
			title: 'Educational Materials',
			description: 'Learning resources and educational content for continuous improvement.',
			resources: [
				{ name: 'Fundamentals Course Materials', type: 'Course', url: '#' },
				{ name: 'Video Lecture Series', type: 'Video', url: '#' },
				{ name: 'Interactive Worksheets', type: 'Worksheet', url: '#' }
			]
		}
	];
</script>

<PageTemplate {seo}>
	{#snippet children()}
		<header class="resources-header">
			<h1 class="resources-title">Resources</h1>
			<p class="resources-subtitle">
				Curated tools, materials, and resources for professional development
			</p>
		</header>

		<main class="resources-content">
			{#each resourceCategories as category}
				<section class="resource-category">
					<header class="category-header">
						<h2 class="category-title">{category.title}</h2>
						<p class="category-description">{category.description}</p>
					</header>

					<div class="resource-grid">
						{#each category.resources as resource}
							<div class="resource-item">
								<div class="resource-info">
									<h3 class="resource-name">{resource.name}</h3>
									<span class="resource-type">{resource.type}</span>
								</div>
								<a href={resource.url} class="resource-link"> Access → </a>
							</div>
						{/each}
					</div>
				</section>
			{/each}

			<section class="additional-resources">
				<h2 class="section-title">Need More Resources?</h2>
				<p class="section-description">
					If you're looking for specific resources or have suggestions for additions to this
					collection, please <a href="/contact" class="contact-link">get in touch</a>. I'm always
					happy to help and expand this resource library based on community needs.
				</p>
			</section>
		</main>
	{/snippet}
</PageTemplate>

<style>
	.resources-header {
		margin-bottom: 3rem;
		text-align: center;
	}

	.resources-title {
		font-size: 2.5rem;
		font-weight: bold;
		color: #111827;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	@media (min-width: 768px) {
		.resources-title {
			font-size: 3rem;
		}
	}

	.resources-subtitle {
		font-size: 1.25rem;
		color: #6b7280;
		max-width: 42rem;
		margin: 0 auto;
	}

	.resources-content {
		max-width: 75rem;
		margin: 0 auto;
	}

	.resource-category {
		margin-bottom: 4rem;
	}

	.category-header {
		margin-bottom: 2rem;
	}

	.category-title {
		font-size: 1.875rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 0.5rem;
	}

	.category-description {
		color: #6b7280;
		font-size: 1.125rem;
	}

	.resource-grid {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	.resource-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		background-color: white;
		transition: all 0.2s ease-in-out;
	}

	.resource-item:hover {
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		transform: translateY(-1px);
	}

	.resource-info {
		flex: 1;
	}

	.resource-name {
		font-size: 1.125rem;
		font-weight: 500;
		color: #111827;
		margin-bottom: 0.25rem;
	}

	.resource-type {
		font-size: 0.875rem;
		color: #6b7280;
		background-color: #f3f4f6;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
	}

	.resource-link {
		color: #fe795d;
		text-decoration: none;
		font-weight: 500;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		transition: all 0.2s ease-in-out;
	}

	.resource-link:hover {
		background-color: #fe795d;
		color: white;
	}

	.additional-resources {
		margin-top: 4rem;
		padding: 2rem;
		background-color: #f9fafb;
		border-radius: 0.5rem;
		text-align: center;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 1rem;
	}

	.section-description {
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
		.resources-title {
			color: white;
		}

		.resources-subtitle {
			color: #9ca3af;
		}

		.category-title {
			color: white;
		}

		.category-description {
			color: #9ca3af;
		}

		.resource-item {
			background-color: #1f2937;
			border-color: #374151;
		}

		.resource-name {
			color: white;
		}

		.resource-type {
			background-color: #374151;
			color: #d1d5db;
		}

		.additional-resources {
			background-color: #1f2937;
		}

		.section-title {
			color: white;
		}

		.section-description {
			color: #9ca3af;
		}
	}
</style>
