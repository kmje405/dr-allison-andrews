<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import PageTemplate from '$lib/components/PageTemplate.svelte';
	import { currentUser, isAuthenticated, isAdmin, clientAuth } from '$lib/utils/client-auth';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	let showLoginPrompt = $state(false);
	let showAdminSetup = $state(false);
	let loginForm = $state({ email: '', password: '' });
	let adminSetupForm = $state({ email: '', password: '', name: '' });
	let loginError = $state('');
	let setupError = $state('');
	let isLoading = $state(false);

	onMount(async () => {
		// Initialize auth state
		clientAuth.init();

		// Check if we need to show admin setup
		try {
			const response = await fetch('/api/auth/setup-admin', { method: 'GET' });
			if (response.status === 404) {
				// No admin exists, show setup form
				showAdminSetup = true;
			} else if (!$isAuthenticated) {
				showLoginPrompt = true;
			} else if (!$isAdmin) {
				// Redirect non-admin users
				window.location.href = '/';
			}
		} catch (error) {
			console.error('Error checking admin setup:', error);
			if (!$isAuthenticated) {
				showLoginPrompt = true;
			}
		}
	});

	async function handleLogin() {
		if (!loginForm.email || !loginForm.password) {
			loginError = 'Please fill in all fields';
			return;
		}

		isLoading = true;
		loginError = '';

		try {
			const result = await clientAuth.login(loginForm);
			if (result.success) {
				showLoginPrompt = false;
				// Page will re-render with authenticated state
			} else {
				loginError = result.message;
			}
		} catch (error) {
			loginError = 'Login failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	async function handleAdminSetup() {
		if (!adminSetupForm.email || !adminSetupForm.password || !adminSetupForm.name) {
			setupError = 'Please fill in all fields';
			return;
		}

		isLoading = true;
		setupError = '';

		try {
			const response = await fetch('/api/auth/setup-admin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(adminSetupForm)
			});

			const result = await response.json();

			if (result.success) {
				// Now log in the admin user
				const loginResult = await clientAuth.login({
					email: adminSetupForm.email,
					password: adminSetupForm.password
				});

				if (loginResult.success) {
					showAdminSetup = false;
					// Page will re-render with authenticated state
				} else {
					setupError = 'Admin created but login failed. Please try logging in.';
					showAdminSetup = false;
					showLoginPrompt = true;
				}
			} else {
				setupError = result.message;
			}
		} catch (error) {
			setupError = 'Setup failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	async function handleLogout() {
		await clientAuth.logout();
		showLoginPrompt = true;
	}

	const seo = {
		title: 'Admin Dashboard',
		description: 'Blog administration dashboard for Dr. Allison Andrews',
		keywords: ['admin', 'dashboard', 'blog management'],
		ogType: 'website' as const
	};

	// Get blog posts from server-loaded data
	let blogPosts = $state(data.posts);

	async function togglePublished(postId: number) {
		try {
			const token = clientAuth.getToken();
			const response = await fetch(`/api/admin/posts/${postId}/toggle-published`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				// Update the local state
				const post = blogPosts.find((p) => p.id === postId);
				if (post) {
					post.published = !post.published;
				}
			} else if (response.status === 401) {
				// Token expired or invalid, redirect to login
				await clientAuth.logout();
				showLoginPrompt = true;
			} else {
				console.error('Failed to toggle published status');
			}
		} catch (error) {
			console.error('Error toggling published status:', error);
		}
	}

	async function toggleFeatured(postId: number) {
		try {
			const token = clientAuth.getToken();
			const response = await fetch(`/api/admin/posts/${postId}/toggle-featured`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				// Update the local state
				const post = blogPosts.find((p) => p.id === postId);
				if (post) {
					post.featured = !post.featured;
				}
			} else if (response.status === 401) {
				// Token expired or invalid, redirect to login
				await clientAuth.logout();
				showLoginPrompt = true;
			} else {
				console.error('Failed to toggle featured status');
			}
		} catch (error) {
			console.error('Error toggling featured status:', error);
		}
	}

	async function deletePost(postId: number, postTitle: string) {
		// Double confirmation
		const firstConfirm = confirm(`Are you sure you want to delete "${postTitle}"?`);
		if (!firstConfirm) return;

		const secondConfirm = confirm(
			`This action cannot be undone. Are you absolutely sure you want to permanently delete "${postTitle}"?`
		);
		if (!secondConfirm) return;

		try {
			const token = clientAuth.getToken();
			const response = await fetch(`/api/admin/posts/${postId}/delete`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				// Remove the post from local state
				blogPosts = blogPosts.filter((p) => p.id !== postId);
			} else if (response.status === 401) {
				// Token expired or invalid, redirect to login
				await clientAuth.logout();
				showLoginPrompt = true;
			} else {
				const result = await response.json();
				alert(`Failed to delete post: ${result.message}`);
			}
		} catch (error) {
			console.error('Error deleting post:', error);
			alert('Failed to delete post. Please try again.');
		}
	}

	function editPost(postId: number) {
		window.location.href = `/admin/posts/${postId}`;
	}
</script>

{#if showAdminSetup}
	<PageTemplate {seo}>
		{#snippet children()}
			<div class="login-prompt">
				<div class="login-card">
					<h1 class="login-title">Admin Setup Required</h1>
					<p class="login-description">Create the first admin user to access the dashboard.</p>

					<form
						class="login-form"
						onsubmit={(e) => {
							e.preventDefault();
							handleAdminSetup();
						}}
					>
						<div class="form-group">
							<label for="setup-name">Full Name</label>
							<input
								id="setup-name"
								type="text"
								bind:value={adminSetupForm.name}
								placeholder="Enter your full name"
								required
							/>
						</div>

						<div class="form-group">
							<label for="setup-email">Email</label>
							<input
								id="setup-email"
								type="email"
								bind:value={adminSetupForm.email}
								placeholder="Enter your email"
								required
							/>
						</div>

						<div class="form-group">
							<label for="setup-password">Password</label>
							<input
								id="setup-password"
								type="password"
								bind:value={adminSetupForm.password}
								placeholder="Enter a secure password"
								required
							/>
						</div>

						{#if setupError}
							<div class="error-message">{setupError}</div>
						{/if}

						<div class="login-buttons">
							<button type="submit" class="login-button" disabled={isLoading}>
								{isLoading ? 'Creating...' : 'Create Admin User'}
							</button>
							<a href="/" class="back-link">← Back to Site</a>
						</div>
					</form>
				</div>
			</div>
		{/snippet}
	</PageTemplate>
{:else if showLoginPrompt}
	<PageTemplate {seo}>
		{#snippet children()}
			<div class="login-prompt">
				<div class="login-card">
					<h1 class="login-title">Admin Login</h1>
					<p class="login-description">
						Please log in with your admin credentials to access the dashboard.
					</p>

					<form
						class="login-form"
						onsubmit={(e) => {
							e.preventDefault();
							handleLogin();
						}}
					>
						<div class="form-group">
							<label for="email">Email</label>
							<input
								id="email"
								type="email"
								bind:value={loginForm.email}
								placeholder="Enter your email"
								required
							/>
						</div>

						<div class="form-group">
							<label for="password">Password</label>
							<input
								id="password"
								type="password"
								bind:value={loginForm.password}
								placeholder="Enter your password"
								required
							/>
						</div>

						{#if loginError}
							<div class="error-message">{loginError}</div>
						{/if}

						<div class="login-buttons">
							<button type="submit" class="login-button" disabled={isLoading}>
								{isLoading ? 'Logging in...' : 'Log In'}
							</button>
							<a href="/" class="back-link">← Back to Site</a>
						</div>
					</form>
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
						Welcome back, {$currentUser?.name || $currentUser?.email}
					</p>
				</div>

				<div class="admin-actions">
					<button class="logout-button" onclick={handleLogout}> Log Out </button>
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
										title={post.featured ? 'Remove from featured' : 'Add to featured'}
									>
										{post.featured ? '★' : '☆'}
									</button>
								</div>
								<div class="cell actions">
									<button
										class="action-button publish"
										onclick={() => togglePublished(post.id)}
										title={post.published ? 'Unpublish post' : 'Publish post'}
									>
										{post.published ? 'Unpublish' : 'Publish'}
									</button>
									<button
										class="action-button edit"
										onclick={() => editPost(post.id)}
										title="Edit post"
									>
										Edit
									</button>
									<button
										class="action-button delete"
										onclick={() => deletePost(post.id, post.title)}
										title="Delete post"
									>
										Delete
									</button>
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
							<button
								class="card-button"
								onclick={() => (window.location.href = '/admin/posts/new')}>Create Post</button
							>
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

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		text-align: left;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group label {
		font-weight: 500;
		color: #374151;
		font-size: 0.875rem;
	}

	.form-group input {
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 1rem;
		transition: border-color 0.2s ease;
	}

	.form-group input:focus {
		outline: none;
		border-color: #fe795d;
		box-shadow: 0 0 0 3px rgba(254, 121, 93, 0.1);
	}

	.error-message {
		background-color: #fef2f2;
		color: #dc2626;
		padding: 0.75rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		text-align: center;
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
		width: 100%;
	}

	.login-button:hover:not(:disabled) {
		background-color: #ef562f;
	}

	.login-button:disabled {
		background-color: #9ca3af;
		cursor: not-allowed;
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

	.action-button.publish {
		background-color: #d1fae5;
		color: #065f46;
	}

	.action-button.publish:hover {
		background-color: #a7f3d0;
	}

	.action-button.edit {
		background-color: #dbeafe;
		color: #1e40af;
	}

	.action-button.edit:hover {
		background-color: #bfdbfe;
	}

	.action-button.delete {
		background-color: #fee2e2;
		color: #dc2626;
	}

	.action-button.delete:hover {
		background-color: #fecaca;
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
