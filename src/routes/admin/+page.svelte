<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import PageTemplate from '$lib/components/PageTemplate.svelte';
	import { user, isAuthenticated, isAdmin, auth } from '$lib/utils/auth.js';

	let showLoginPrompt = $state(false);

	onMount(() => {
		// Check if user is authenticated and admin
		const currentUser = auth.getCurrentUser();
		if (!currentUser) {
			showLoginPrompt = true;
		} else if (!$isAdmin) {
			// Redirect non-admin users
			window.location.href = '/';
		}
	});

	const seo = {
		title: 'Admin Dashboard',
		description: 'Blog administration dashboard for Dr. Allison Andrews',
		keywords: ['admin', 'dashboard', 'blog management'],
		ogType: 'website' as const
	};

	// Sample blog posts for management (this would come from your data source)
	let blogPosts = [
		{
			id: 1,
			title: 'Welcome to My Professional Blog',
			slug: 'welcome-to-my-blog',
			published: true,
			featured: true,
			date: '2024-01-15'
		},
		{
			id: 2,
			title: 'Latest Research Developments',
			slug: 'latest-research-developments',
			published: true,
			featured: false,
			date: '2024-01-10'
		},
		{
			id: 3,
			title: 'Professional Best Practices',
			slug: 'professional-best-practices',
			published: true,
			featured: false,
			date: '2024-01-05'
		}
	];

	function togglePublished(postId: number) {
		const post = blogPosts.find((p) => p.id === postId);
		if (post) {
			post.published = !post.published;
			// Here you would save to your data source
			console.log(`Post ${postId} published status: ${post.published}`);
		}
	}

	function toggleFeatured(postId: number) {
		const post = blogPosts.find((p) => p.id === postId);
		if (post) {
			post.featured = !post.featured;
			// Here you would save to your data source
			console.log(`Post ${postId} featured status: ${post.featured}`);
		}
	}
</script>

{#if showLoginPrompt}
	<PageTemplate {seo}>
		{#snippet children()}
			<div class="login-prompt">
				<div class="login-card">
					<h1 class="login-title">Admin Access Required</h1>
					<p class="login-description">
						Please log in with your admin credentials to access the dashboard.
					</p>

					<div class="login-buttons">
						<button class="login-button" onclick={() => auth.login()}> Log In </button>
						<a href="/" class="back-link">← Back to Site</a>
					</div>
				</div>
			</div>
		{/snippet}
	</PageTemplate>
{:else if $isAuthenticated && $isAdmin}
	<PageTemplate {seo}>
		{#snippet children()}
			<div class="admin-header">
				<div class="admin-title-section">
					<h1 class="admin-title">Admin Dashboard</h1>
					<p class="admin-subtitle">
						Welcome back, {$user?.user_metadata?.full_name || $user?.email}
					</p>
				</div>

				<div class="admin-actions">
					<button class="logout-button" onclick={() => auth.logout()}> Log Out </button>
				</div>
			</div>

			<div class="admin-content">
				<section class="blog-management">
					<h2 class="section-title">Blog Posts</h2>

					<div class="posts-table">
						<div class="table-header">
							<div class="header-cell">Title</div>
							<div class="header-cell">Date</div>
							<div class="header-cell">Status</div>
							<div class="header-cell">Featured</div>
							<div class="header-cell">Actions</div>
						</div>

						{#each blogPosts as post}
							<div class="table-row">
								<div class="cell post-title">
									<a href="/blog/{post.slug}" class="post-link" target="_blank">
										{post.title}
									</a>
								</div>
								<div class="cell">{new Date(post.date).toLocaleDateString()}</div>
								<div class="cell">
									<span
										class="status-badge"
										class:published={post.published}
										class:draft={!post.published}
									>
										{post.published ? 'Published' : 'Draft'}
									</span>
								</div>
								<div class="cell">
									<button
										class="toggle-button"
										class:active={post.featured}
										onclick={() => toggleFeatured(post.id)}
									>
										{post.featured ? '★' : '☆'}
									</button>
								</div>
								<div class="cell actions">
									<button class="action-button" onclick={() => togglePublished(post.id)}>
										{post.published ? 'Unpublish' : 'Publish'}
									</button>
									<button class="action-button edit">Edit</button>
								</div>
							</div>
						{/each}
					</div>
				</section>

				<section class="quick-actions">
					<h2 class="section-title">Quick Actions</h2>

					<div class="action-cards">
						<div class="action-card">
							<h3 class="card-title">New Blog Post</h3>
							<p class="card-description">Create a new blog post</p>
							<button class="card-button">Create Post</button>
						</div>

						<div class="action-card">
							<h3 class="card-title">Site Analytics</h3>
							<p class="card-description">View site performance</p>
							<a href="https://app.netlify.com" target="_blank" class="card-button">
								View Analytics
							</a>
						</div>

						<div class="action-card">
							<h3 class="card-title">Form Submissions</h3>
							<p class="card-description">Check contact form messages</p>
							<a href="https://app.netlify.com" target="_blank" class="card-button"> View Forms </a>
						</div>
					</div>
				</section>
			</div>
		{/snippet}
	</PageTemplate>
{:else}
	<PageTemplate {seo}>
		{#snippet children()}
			<div class="loading">
				<p>Loading...</p>
			</div>
		{/snippet}
	</PageTemplate>
{/if}

<style>
	/* Login Prompt Styles */
	.login-prompt {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
	}

	.login-card {
		background: white;
		padding: 3rem;
		border-radius: 1rem;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		text-align: center;
		max-width: 400px;
		width: 100%;
	}

	.login-title {
		font-size: 1.875rem;
		font-weight: bold;
		color: #111827;
		margin-bottom: 1rem;
	}

	.login-description {
		color: #6b7280;
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.login-buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.login-button {
		background-color: #fe795d;
		color: white;
		font-weight: 500;
		padding: 0.75rem 2rem;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
		font-size: 1rem;
	}

	.login-button:hover {
		background-color: #ef562f;
	}

	.back-link {
		color: #6b7280;
		text-decoration: none;
		font-size: 0.875rem;
	}

	.back-link:hover {
		color: #374151;
	}

	/* Admin Dashboard Styles */
	.admin-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.admin-title {
		font-size: 2.5rem;
		font-weight: bold;
		color: #111827;
		margin-bottom: 0.5rem;
	}

	.admin-subtitle {
		color: #6b7280;
		font-size: 1.125rem;
	}

	.logout-button {
		background-color: #6b7280;
		color: white;
		font-weight: 500;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.logout-button:hover {
		background-color: #4b5563;
	}

	.admin-content {
		display: grid;
		gap: 3rem;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 1.5rem;
	}

	/* Posts Table */
	.posts-table {
		background: white;
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.table-header {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
		background-color: #f9fafb;
		border-bottom: 1px solid #e5e7eb;
	}

	.header-cell {
		padding: 1rem;
		font-weight: 600;
		color: #374151;
		font-size: 0.875rem;
	}

	.table-row {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
		border-bottom: 1px solid #f3f4f6;
	}

	.table-row:hover {
		background-color: #f9fafb;
	}

	.cell {
		padding: 1rem;
		display: flex;
		align-items: center;
		font-size: 0.875rem;
	}

	.post-link {
		color: #fe795d;
		text-decoration: none;
		font-weight: 500;
	}

	.post-link:hover {
		text-decoration: underline;
	}

	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.status-badge.published {
		background-color: #d1fae5;
		color: #065f46;
	}

	.status-badge.draft {
		background-color: #fef3c7;
		color: #92400e;
	}

	.toggle-button {
		background: none;
		border: none;
		font-size: 1.25rem;
		cursor: pointer;
		color: #d1d5db;
		transition: color 0.2s ease;
	}

	.toggle-button.active {
		color: #fbbf24;
	}

	.actions {
		gap: 0.5rem;
	}

	.action-button {
		background-color: #f3f4f6;
		color: #374151;
		border: none;
		padding: 0.375rem 0.75rem;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.75rem;
		transition: background-color 0.2s ease;
	}

	.action-button:hover {
		background-color: #e5e7eb;
	}

	.action-button.edit {
		background-color: #dbeafe;
		color: #1e40af;
	}

	.action-button.edit:hover {
		background-color: #bfdbfe;
	}

	/* Quick Actions */
	.action-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.action-card {
		background: white;
		padding: 1.5rem;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.card-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 0.5rem;
	}

	.card-description {
		color: #6b7280;
		font-size: 0.875rem;
		margin-bottom: 1rem;
	}

	.card-button {
		background-color: #fe795d;
		color: white;
		text-decoration: none;
		font-weight: 500;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
		display: inline-block;
		font-size: 0.875rem;
	}

	.card-button:hover {
		background-color: #ef562f;
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		color: #6b7280;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.admin-header {
			flex-direction: column;
			gap: 1rem;
		}

		.table-header,
		.table-row {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}

		.header-cell,
		.cell {
			padding: 0.75rem;
		}

		.posts-table {
			overflow-x: auto;
		}
	}

	/* Dark Mode */
	@media (prefers-color-scheme: dark) {
		.login-card {
			background-color: #1f2937;
		}

		.login-title {
			color: white;
		}

		.admin-title {
			color: white;
		}

		.section-title {
			color: white;
		}

		.posts-table {
			background-color: #1f2937;
		}

		.table-header {
			background-color: #374151;
		}

		.header-cell {
			color: #d1d5db;
		}

		.table-row:hover {
			background-color: #374151;
		}

		.cell {
			color: #d1d5db;
		}

		.action-card {
			background-color: #1f2937;
		}

		.card-title {
			color: white;
		}
	}
</style>
