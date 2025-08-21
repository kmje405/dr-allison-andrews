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

	// Modal state for viewing contact submissions
	let showSubmissionModal = $state(false);
	let selectedSubmission = $state<any>(null);

	// Get archived submissions from server-loaded data
	let archivedSubmissions = $state(data.archivedSubmissions);

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

	async function deleteSubmission(submissionId: number, submissionName: string) {
		// Double confirmation for permanent deletion
		const firstConfirm = confirm(
			`Are you sure you want to permanently delete the submission from "${submissionName}"?`
		);
		if (!firstConfirm) return;

		const secondConfirm = confirm(
			`This action cannot be undone. Are you absolutely sure you want to permanently delete this submission?`
		);
		if (!secondConfirm) return;

		try {
			const token = clientAuth.getToken();
			const response = await fetch(`/api/admin/contact/${submissionId}/delete`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				// Remove the submission from local state
				archivedSubmissions = archivedSubmissions.filter((s) => s.id !== submissionId);
			} else if (response.status === 401) {
				// Token expired or invalid, redirect to login
				await clientAuth.logout();
				showLoginPrompt = true;
			} else {
				const result = await response.json();
				alert(`Failed to delete submission: ${result.message}`);
			}
		} catch (error) {
			console.error('Error deleting submission:', error);
			alert('Failed to delete submission. Please try again.');
		}
	}

	function viewSubmission(submission: any) {
		selectedSubmission = submission;
		showSubmissionModal = true;
	}

	function closeSubmissionModal() {
		showSubmissionModal = false;
		selectedSubmission = null;
	}

	const seo = {
		title: 'Archived Contact Submissions',
		description: 'View archived contact form submissions',
		keywords: ['admin', 'contact', 'archived', 'submissions'],
		ogType: 'website' as const
	};
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
					<h1 class="admin-title">Archived Contact Submissions</h1>
					<p class="admin-subtitle">View and manage archived contact form submissions</p>
				</div>

				<div class="admin-actions">
					<a href="/admin" class="back-button">← Back to Dashboard</a>
					<button class="logout-button" onclick={handleLogout}> Log Out </button>
				</div>
			</div>

			<div class="admin-content">
				<section class="archived-submissions">
					{#if archivedSubmissions.length === 0}
						<p class="no-submissions">No archived submissions yet.</p>
					{:else}
						<div class="submissions-table">
							<div class="table-header">
								<div class="header-cell">Name</div>
								<div class="header-cell">Email</div>
								<div class="header-cell">Subject</div>
								<div class="header-cell">Archived Date</div>
								<div class="header-cell">Actions</div>
							</div>

							{#each archivedSubmissions as submission}
								<div class="table-row">
									<div class="cell">{submission.name}</div>
									<div class="cell">
										<a href="mailto:{submission.email}" class="email-link">{submission.email}</a>
									</div>
									<div class="cell">{submission.subject || 'No subject'}</div>
									<div class="cell">
										{submission.archivedAt
											? new Date(submission.archivedAt).toLocaleDateString()
											: 'Unknown'}
									</div>
									<div class="cell actions">
										<button
											class="action-button view"
											onclick={() => viewSubmission(submission)}
											title="View full message"
										>
											View
										</button>
										<button
											class="action-button delete"
											onclick={() => deleteSubmission(submission.id, submission.name)}
											title="Permanently delete submission"
										>
											Delete
										</button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</section>
			</div>
		{/snippet}
	</PageTemplate>

	<!-- Contact Submission Modal -->
	{#if showSubmissionModal && selectedSubmission}
		<div class="modal-overlay" onclick={closeSubmissionModal}>
			<div class="modal-content" onclick={(e) => e.stopPropagation()}>
				<div class="modal-header">
					<h3 class="modal-title">Archived Contact Submission</h3>
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
							<span class="detail-label">Original Date:</span>
							<span class="detail-value">
								{new Date(selectedSubmission.createdAt).toLocaleString()}
							</span>
						</div>

						<div class="detail-row">
							<span class="detail-label">Archived Date:</span>
							<span class="detail-value">
								{selectedSubmission.archivedAt
									? new Date(selectedSubmission.archivedAt).toLocaleString()
									: 'Unknown'}
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
	/* Reuse styles from main admin page */
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

	.admin-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.admin-title {
		font-size: 2rem;
		font-weight: bold;
		color: #111827;
		margin-bottom: 0.5rem;
	}

	.admin-subtitle {
		color: #6b7280;
		margin: 0;
	}

	.admin-actions {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.back-button {
		background-color: #f3f4f6;
		color: #374151;
		text-decoration: none;
		font-weight: 500;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		transition: background-color 0.2s ease;
		font-size: 0.875rem;
	}

	.back-button:hover {
		background-color: #e5e7eb;
	}

	.logout-button {
		background-color: #ef4444;
		color: white;
		border: none;
		font-weight: 500;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
		font-size: 0.875rem;
	}

	.logout-button:hover {
		background-color: #dc2626;
	}

	.admin-content {
		max-width: 75rem;
		margin: 0 auto;
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

	.table-header {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
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
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		border-bottom: 1px solid #f3f4f6;
		transition: background-color 0.2s ease;
	}

	.table-row:hover {
		background-color: #f9fafb;
	}

	.cell {
		padding: 1rem;
		color: #374151;
		font-size: 0.875rem;
		display: flex;
		align-items: center;
	}

	.cell.actions {
		gap: 0.5rem;
	}

	.email-link {
		color: #fe795d;
		text-decoration: none;
	}

	.email-link:hover {
		text-decoration: underline;
	}

	.action-button {
		background-color: #6b7280;
		color: white;
		border: none;
		font-weight: 500;
		padding: 0.375rem 0.75rem;
		border-radius: 0.25rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
		font-size: 0.75rem;
	}

	.action-button.view {
		background-color: #3b82f6;
	}

	.action-button.view:hover {
		background-color: #2563eb;
	}

	.action-button.delete {
		background-color: #ef4444;
	}

	.action-button.delete:hover {
		background-color: #dc2626;
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		color: #6b7280;
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
		min-width: 120px;
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

	/* Dark mode styles */
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

		.admin-header {
			border-bottom-color: #374151;
		}

		.no-submissions {
			background-color: #374151;
			color: #d1d5db;
		}

		.submissions-table {
			background: #1f2937;
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

		.email-link {
			color: #fbbf24;
		}

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
	}
</style>
