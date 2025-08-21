<script lang="ts">
	import PageTemplate from '$lib/components/PageTemplate.svelte';
	import { getAllPosts, type BlogPost } from '$lib/utils/blog.js';

	const seo = {
		title: 'Blog',
		description:
			'Read the latest insights, research updates, and professional thoughts from Dr. Allison Andrews.',
		keywords: ['blog', 'articles', 'research', 'insights', 'Dr. Allison Andrews'],
		ogType: 'website' as const
	};

	// Get all published blog posts from JSON
	const blogPosts: BlogPost[] = getAllPosts();
</script>

<PageTemplate {seo}>
	{#snippet children()}
		<header class="blog-header">
			<h1 class="blog-title">Blog</h1>
			<p class="blog-subtitle">Insights, research updates, and professional thoughts</p>
		</header>

		<main class="blog-content">
			{#if blogPosts.length > 0}
				<div class="blog-posts">
					{#each blogPosts as post}
						<article class="blog-post">
							<header class="post-header">
								<h2 class="post-title">
									<a href="/blog/{post.slug}" class="post-link">{post.title}</a>
								</h2>
								<div class="post-meta">
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
							</header>
							<p class="post-excerpt">{post.excerpt}</p>
							<a href="/blog/{post.slug}" class="read-more">Read more →</a>
						</article>
					{/each}
				</div>
			{:else}
				<div class="no-posts">
					<h2>Coming Soon</h2>
					<p>Blog posts will be published here soon. Check back for updates!</p>
				</div>
			{/if}
		</main>
	{/snippet}
</PageTemplate>

<style>
	.blog-header {
		margin-bottom: 3rem;
		text-align: center;
	}

	.blog-title {
		font-size: 2.5rem;
		font-weight: bold;
		color: #111827;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	@media (min-width: 768px) {
		.blog-title {
			font-size: 3rem;
		}
	}

	.blog-subtitle {
		font-size: 1.25rem;
		color: #6b7280;
		max-width: 42rem;
		margin: 0 auto;
	}

	.blog-content {
		max-width: 56rem;
		margin: 0 auto;
	}

	.blog-posts {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.blog-post {
		padding: 2rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		background-color: white;
		transition: all 0.2s ease-in-out;
	}

	.blog-post:hover {
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.post-header {
		margin-bottom: 1rem;
	}

	.post-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	.post-link {
		color: #111827;
		text-decoration: none;
		transition: color 0.2s ease-in-out;
	}

	.post-link:hover {
		color: #fe795d;
	}

	.post-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #6b7280;
		margin-bottom: 0.75rem;
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
		margin-bottom: 0.5rem;
	}

	.tag {
		background-color: #f3f4f6;
		color: #374151;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.post-excerpt {
		color: #374151;
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	.read-more {
		color: #fe795d;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s ease-in-out;
	}

	.read-more:hover {
		color: #ef562f;
		text-decoration: underline;
	}

	.no-posts {
		text-align: center;
		padding: 3rem;
		color: #6b7280;
	}

	.no-posts h2 {
		font-size: 1.5rem;
		color: #111827;
		margin-bottom: 1rem;
	}

	/* Dark mode styles */
	@media (prefers-color-scheme: dark) {
		.blog-title {
			color: white;
		}

		.blog-subtitle {
			color: #9ca3af;
		}

		.blog-post {
			background-color: #1f2937;
			border-color: #374151;
		}

		.post-link {
			color: white;
		}

		.post-meta {
			color: #9ca3af;
		}

		.tag {
			background-color: #374151;
			color: #d1d5db;
		}

		.post-excerpt {
			color: #d1d5db;
		}

		.no-posts {
			color: #9ca3af;
		}

		.no-posts h2 {
			color: white;
		}
	}
</style>
