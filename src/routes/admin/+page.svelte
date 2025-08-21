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

	// Get blog posts and contact submissions from server-loaded data
	let blogPosts = $state(data.posts);
	let contactSubmissions = $state(data.contactSubmissions);

	// Modal state for viewing contact submissions
	let showSubmissionModal = $state(false);
	let selectedSubmission = $state<any>(null);

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

	function viewSubmission(submission: any) {
		selectedSubmission = submission;
		showSubmissionModal = true;
	}

	function closeSubmissionModal() {
		showSubmissionModal = false;
		selectedSubmission = null;
	}

	async function archiveSubmission(submissionId: number, submissionName: string) {
		const confirm = window.confirm(
			`Are you sure you want to archive the submission from "${submissionName}"?`
		);
		if (!confirm) return;

		try {
			const token = clientAuth.getToken();
			const response = await fetch(`/api/admin/contact/${submissionId}/archive`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				// Remove the submission from local state
				contactSubmissions = contactSubmissions.filter((s) => s.id !== submissionId);
			} else if (response.status === 401) {
				// Token expired or invalid, redirect to login
				await clientAuth.logout();
				showLoginPrompt = true;
			} else {
				const result = await response.json();
				alert(`Failed to archive submission: ${result.message}`);
			}
		} catch (error) {
			console.error('Error archiving submission:', error);
			alert('Failed to archive submission. Please try again.');
		}
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

				<section class="contact-submissions">
					<div class="section-header">
						<h2 class="section-title">Contact Submissions</h2>
						<a href="/admin/contact/archived" class="archived-link"> View Archived </a>
					</div>

					{#if contactSubmissions.length === 0}
						<p class="no-submissions">No contact submissions yet.</p>
					{:else}
						<div class="submissions-table">
							<div class="table-header">
								<div class="header-cell">Name</div>
								<div class="header-cell">Email</div>
								<div class="header-cell">Subject</div>
								<div class="header-cell">Date</div>
								<div class="header-cell">Actions</div>
							</div>

							{#each contactSubmissions as submission}
								<div class="table-row">
									<div class="cell">{submission.name}</div>
									<div class="cell">
										<a href="mailto:{submission.email}" class="email-link">{submission.email}</a>
									</div>
									<div class="cell">{submission.subject || 'No subject'}</div>
									<div class="cell">{new Date(submission.createdAt).toLocaleDateString()}</div>
									<div class="cell actions">
										<button
											class="action-button view"
											onclick={() => viewSubmission(submission)}
											title="View full message"
										>
											View
										</button>
										<button
											class="action-button archive"
											onclick={() => archiveSubmission(submission.id, submission.name)}
											title="Archive submission"
										>
											Archive
										</button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
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
							<h3 class="card-title">Contact Messages</h3>
							<p class="card-description">View contact form submissions</p>
							<span class="card-button disabled">
								{contactSubmissions.length} message{contactSubmissions.length !== 1 ? 's' : ''}
							</span>
						</div>
					</div>
				</section>
			</div>
		{/snippet}
	</PageTemplate>

	<!-- Contact Submission Modal -->
	{#if showSubmissionModal && selectedSubmission}
		<div
			class="modal-overlay"
			onclick={closeSubmissionModal}
			onkeydown={(e) => e.key === 'Escape' && closeSubmissionModal()}
			role="presentation"
		>
			<div
				class="modal-content"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
				tabindex="-1"
			>
				<div class="modal-header">
					<h3 class="modal-title">Contact Submission</h3>
					<button class="modal-close" onclick={closeSubmissionModal}>×</button>
				</div>

				<div class="modal-body">
					<div class="submission-details">
						<div class="detail-row">
							<span class="detail-label">From:</span>
							<span class="detail-value">{selectedSubmission.name}</span>
						</div>

						<div class="detail-row">
							<span class="detail-label">Email:</span>
							<a href="mailto:{selectedSubmission.email}" class="detail-value email-link">
								{selectedSubmission.email}
							</a>
						</div>

						<div class="detail-row">
							<span class="detail-label">Date:</span>
							<span class="detail-value">
								{new Date(selectedSubmission.createdAt).toLocaleString()}
							</span>
						</div>

						<div class="detail-row">
							<span class="detail-label">Subject:</span>
							<span class="detail-value">{selectedSubmission.subject || 'No subject'}</span>
						</div>

						<div class="detail-row message-row">
							<span class="detail-label">Message:</span>
							<div class="message-content">{selectedSubmission.message}</div>
						</div>
					</div>
				</div>

				<div class="modal-footer">
					<a
						href="mailto:{selectedSubmission.email}?subject=Re: {selectedSubmission.subject ||
							'Your message'}&body=Hi {selectedSubmission.name},%0A%0A"
						class="reply-button"
					>
						Reply via Email
					</a>
					<button
						class="modal-button archive"
						onclick={() => {
							archiveSubmission(selectedSubmission.id, selectedSubmission.name);
							closeSubmissionModal();
						}}
					>
						Archive
					</button>
					<button class="modal-button secondary" onclick={closeSubmissionModal}>Close</button>
				</div>
			</div>
		</div>
	{/if}
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

		.no-submissions {
			background-color: #374151;
			color: #d1d5db;
		}

		.submissions-table {
			background: #1f2937;
		}

		.email-link {
			color: #fbbf24;
		}

		.card-button.disabled {
			background-color: #4b5563;
			color: #9ca3af;
		}
	}

	/* Contact Submissions Styles */
	.contact-submissions {
		margin-top: 3rem;
	}

	.no-submissions {
		color: #6b7280;
		font-style: italic;
		text-align: center;
		padding: 2rem;
		background-color: #f9fafb;
		border-radius: 0.5rem;
	}

	.submissions-table {
		background: white;
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.email-link {
		color: #fe795d;
		text-decoration: none;
	}

	.email-link:hover {
		text-decoration: underline;
	}

	.action-button.view {
		background-color: #3b82f6;
	}

	.action-button.view:hover {
		background-color: #2563eb;
	}

	.card-button.disabled {
		background-color: #e5e7eb;
		color: #6b7280;
		cursor: default;
		pointer-events: none;
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.modal-content {
		background: white;
		border-radius: 0.5rem;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
		max-width: 600px;
		width: 100%;
		max-height: 90vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.modal-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #111827;
		margin: 0;
	}

	.modal-close {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: #6b7280;
		cursor: pointer;
		padding: 0.25rem;
		line-height: 1;
	}

	.modal-close:hover {
		color: #374151;
	}

	.modal-body {
		padding: 1.5rem;
		overflow-y: auto;
		flex: 1;
	}

	.submission-details {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.detail-row {
		display: flex;
		gap: 1rem;
	}

	.detail-row.message-row {
		flex-direction: column;
		gap: 0.5rem;
	}

	.detail-label {
		font-weight: 500;
		color: #374151;
		min-width: 80px;
		flex-shrink: 0;
	}

	.detail-value {
		color: #111827;
		flex: 1;
	}

	.message-content {
		background-color: #f9fafb;
		padding: 1rem;
		border-radius: 0.375rem;
		border: 1px solid #e5e7eb;
		white-space: pre-wrap;
		line-height: 1.6;
		color: #374151;
	}

	.modal-footer {
		display: flex;
		gap: 0.75rem;
		padding: 1.5rem;
		border-top: 1px solid #e5e7eb;
		justify-content: flex-end;
	}

	.reply-button {
		background-color: #fe795d;
		color: white;
		text-decoration: none;
		font-weight: 500;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		transition: background-color 0.2s ease;
		font-size: 0.875rem;
	}

	.reply-button:hover {
		background-color: #ef562f;
	}

	.modal-button {
		font-weight: 500;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
		font-size: 0.875rem;
	}

	.modal-button.secondary {
		background-color: #f3f4f6;
		color: #374151;
	}

	.modal-button.secondary:hover {
		background-color: #e5e7eb;
	}

	.modal-button.archive {
		background-color: #f59e0b;
		color: white;
	}

	.modal-button.archive:hover {
		background-color: #d97706;
	}

	/* Dark mode modal styles */
	@media (prefers-color-scheme: dark) {
		.modal-content {
			background: #1f2937;
		}

		.modal-header {
			border-bottom-color: #374151;
		}

		.modal-title {
			color: white;
		}

		.modal-close {
			color: #9ca3af;
		}

		.modal-close:hover {
			color: #d1d5db;
		}

		.detail-label {
			color: #d1d5db;
		}

		.detail-value {
			color: white;
		}

		.message-content {
			background-color: #374151;
			border-color: #4b5563;
			color: #d1d5db;
		}

		.modal-footer {
			border-top-color: #374151;
		}

		.modal-button.secondary {
			background-color: #374151;
			color: #d1d5db;
		}

		.modal-button.secondary:hover {
			background-color: #4b5563;
		}

		.modal-button.archive {
			background-color: #f59e0b;
			color: white;
		}

		.modal-button.archive:hover {
			background-color: #d97706;
		}
	}
</style>
