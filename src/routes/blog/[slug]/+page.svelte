<script lang="ts">
	import PageTemplate from '$lib/components/PageTemplate.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// Get the blog post from server-loaded data
	const post = data.post;

	// SEO data for the specific post
	const seo = {
		title: post.title,
		description: post.excerpt,
		keywords: [...post.tags, 'blog', 'Dr. Allison Andrews'],
		ogType: 'article' as const,
		articleAuthor: post.author,
		articlePublishedTime: post.date,
		articleTags: post.tags
	};
</script>

<PageTemplate {seo} schemaType="Article">
	{#snippet children()}
		<article class="blog-post">
			<header class="post-header">
				<div class="post-meta">
					<a href="/blog" class="back-link">← Back to Blog</a>
				</div>

				<h1 class="post-title">{post.title}</h1>

				<div class="post-info">
					<div class="post-details">
						<span class="post-author">By {post.author}</span>
						<span class="post-separator">•</span>
						<time class="post-date" datetime={post.date}>
							{new Date(post.date).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</time>
						<span class="post-separator">•</span>
						<span class="read-time">{post.readTime}</span>
					</div>

					{#if post.tags.length > 0}
						<div class="post-tags">
							{#each post.tags as tag}
								<span class="tag">{tag}</span>
							{/each}
						</div>
					{/if}
				</div>
			</header>

			<div class="post-content">
				{@html post.content}
			</div>

			<footer class="post-footer">
				<div class="post-navigation">
					<a href="/blog" class="nav-button">← All Posts</a>
					<a href="/contact" class="nav-button">Get in Touch →</a>
				</div>

				<div class="post-sharing">
					<p class="sharing-text">Found this helpful? Share your thoughts or questions:</p>
					<a href="/contact" class="contact-button">Contact Me</a>
				</div>
			</footer>
		</article>
	{/snippet}
</PageTemplate>

<style>
	.blog-post {
		max-width: 56rem;
		margin: 0 auto;
	}

	.post-header {
		margin-bottom: 3rem;
	}

	.post-meta {
		margin-bottom: 1rem;
	}

	.back-link {
		color: #fe795d;
		text-decoration: none;
		font-size: 0.875rem;
		transition: color 0.2s ease-in-out;
	}

	.back-link:hover {
		color: #ef562f;
		text-decoration: underline;
	}

	.post-title {
		font-size: 2.5rem;
		font-weight: bold;
		color: #111827;
		margin-bottom: 1.5rem;
		line-height: 1.2;
	}

	@media (min-width: 768px) {
		.post-title {
			font-size: 3rem;
		}
	}

	.post-info {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.post-info {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}

	.post-details {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.post-author {
		font-weight: 500;
	}

	.post-separator {
		color: #d1d5db;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag {
		background-color: #f3f4f6;
		color: #374151;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.post-content {
		font-size: 1.125rem;
		line-height: 1.75;
		color: #374151;
		margin-bottom: 3rem;
	}

	.post-content :global(h2) {
		font-size: 1.875rem;
		font-weight: 600;
		color: #111827;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.post-content :global(h3) {
		font-size: 1.5rem;
		font-weight: 600;
		color: #111827;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}

	.post-content :global(p) {
		margin-bottom: 1.5rem;
	}

	.post-content :global(ul) {
		margin-bottom: 1.5rem;
		padding-left: 1.5rem;
	}

	.post-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.post-content :global(a) {
		color: #fe795d;
		text-decoration: none;
	}

	.post-content :global(a:hover) {
		text-decoration: underline;
	}

	.post-content :global(strong) {
		font-weight: 600;
		color: #111827;
	}

	.post-footer {
		border-top: 1px solid #e5e7eb;
		padding-top: 2rem;
		margin-top: 3rem;
	}

	.post-navigation {
		display: flex;
		justify-content: space-between;
		margin-bottom: 2rem;
		gap: 1rem;
	}

	@media (max-width: 640px) {
		.post-navigation {
			flex-direction: column;
		}
	}

	.nav-button {
		color: #fe795d;
		text-decoration: none;
		font-weight: 500;
		padding: 0.75rem 1.5rem;
		border: 1px solid #fe795d;
		border-radius: 0.375rem;
		transition: all 0.2s ease-in-out;
		text-align: center;
	}

	.nav-button:hover {
		background-color: #fe795d;
		color: white;
	}

	.post-sharing {
		text-align: center;
		padding: 2rem;
		background-color: #f9fafb;
		border-radius: 0.5rem;
	}

	.sharing-text {
		color: #6b7280;
		margin-bottom: 1rem;
	}

	.contact-button {
		background-color: #fe795d;
		color: white;
		text-decoration: none;
		font-weight: 500;
		padding: 0.75rem 2rem;
		border-radius: 0.375rem;
		transition: background-color 0.2s ease-in-out;
	}

	.contact-button:hover {
		background-color: #ef562f;
	}

	/* Dark mode styles */
	@media (prefers-color-scheme: dark) {
		.post-title {
			color: white;
		}

		.post-details {
			color: #9ca3af;
		}

		.tag {
			background-color: #374151;
			color: #d1d5db;
		}

		.post-content {
			color: #d1d5db;
		}

		.post-content :global(h2),
		.post-content :global(h3) {
			color: white;
		}

		.post-content :global(strong) {
			color: white;
		}

		.post-footer {
			border-top-color: #374151;
		}

		.post-sharing {
			background-color: #1f2937;
		}

		.sharing-text {
			color: #9ca3af;
		}
	}
</style>
