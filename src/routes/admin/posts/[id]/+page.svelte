<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import PageTemplate from '$lib/components/PageTemplate.svelte';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import { currentUser, isAuthenticated, isAdmin, clientAuth } from '$lib/utils/client-auth';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	let form = $state({
		title: data.post?.title || '',
		slug: data.post?.slug || '',
		excerpt: data.post?.excerpt || '',
		content: data.post?.content || '',
		author: data.post?.author || 'Dr. Allison Andrews',
		readTime: data.post?.readTime || '5 min read',
		published: data.post?.published || false,
		featured: data.post?.featured || false,
		tags: data.post?.tags?.join(', ') || ''
	});

	let isLoading = $state(false);
	let error = $state('');
	let success = $state('');
	let authChecked = $state(false);
	let richTextEditor = $state<any>(null);

	const seo = {
		title: data.isNew ? 'Create New Post' : `Edit: ${data.post?.title}`,
		description: 'Blog post editor for Dr. Allison Andrews website',
		keywords: ['admin', 'blog', 'editor'],
		ogType: 'website' as const
	};

	onMount(async () => {
		// Wait a bit for the global auth initialization to complete
		setTimeout(() => {
			// Check authentication after stores have had time to update
			if (!$isAuthenticated || !$isAdmin) {
				goto('/admin');
			} else {
				authChecked = true;
			}
		}, 500);
	});

	function generateSlug(title: string): string {
		const baseSlug = title
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, '') // Remove special characters
			.replace(/\s+/g, '-') // Replace spaces with hyphens
			.replace(/-+/g, '-') // Replace multiple hyphens with single
			.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

		// For new posts, add timestamp to ensure uniqueness
		if (data.isNew) {
			const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
			return baseSlug ? `${baseSlug}-${timestamp}` : `post-${timestamp}`;
		}

		return baseSlug || 'untitled-post';
	}

	function handleTitleChange() {
		// Always auto-generate slug from title
		form.slug = generateSlug(form.title);
	}

	function handleContentChange(content: string) {
		form.content = content;
	}

	async function handleSubmit() {
		if (!form.title || !form.slug || !form.content) {
			error = 'Title, slug, and content are required';
			return;
		}

		isLoading = true;
		error = '';
		success = '';

		try {
			const postData = {
				title: form.title,
				slug: form.slug,
				excerpt: form.excerpt,
				content: form.content,
				author: form.author,
				readTime: form.readTime,
				published: form.published,
				featured: form.featured,
				tags: form.tags
					.split(',')
					.map((tag) => tag.trim())
					.filter((tag) => tag)
			};

			const url = data.isNew ? '/api/admin/posts' : `/api/admin/posts/${data.post?.id}`;

			const method = data.isNew ? 'POST' : 'PUT';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(postData)
			});

			const result = await response.json();

			if (result.success) {
				success = data.isNew ? 'Post created successfully!' : 'Post updated successfully!';
				if (data.isNew) {
					// Redirect to edit the newly created post
					setTimeout(() => {
						goto(`/admin/posts/${result.post.id}`);
					}, 1500);
				}
			} else {
				error = result.message || 'Failed to save post';
			}
		} catch (err) {
			error = 'Failed to save post. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function handleCancel() {
		goto('/admin');
	}
</script>

<PageTemplate {seo}>
	{#snippet children()}
		{#if !authChecked}
			<div class="loading-container">
				<p>Loading...</p>
			</div>
		{:else}
			<div class="editor-container">
				<div class="editor-header">
					<h1 class="editor-title">
						{data.isNew ? 'Create New Post' : 'Edit Post'}
					</h1>
					<div class="editor-actions">
						<button class="cancel-button" onclick={handleCancel}> Cancel </button>
						<button class="save-button" onclick={handleSubmit} disabled={isLoading}>
							{isLoading ? 'Saving...' : 'Save Post'}
						</button>
					</div>
				</div>

				{#if error}
					<div class="error-message">{error}</div>
				{/if}

				{#if success}
					<div class="success-message">{success}</div>
				{/if}

				<form
					class="editor-form"
					onsubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				>
					<div class="form-row">
						<div class="form-group">
							<label for="title">Title *</label>
							<input
								id="title"
								type="text"
								bind:value={form.title}
								oninput={handleTitleChange}
								placeholder="Enter post title"
								required
							/>
							{#if form.slug}
								<small class="url-preview">
									URL: <span class="url-text">/blog/{form.slug}</span>
								</small>
							{/if}
						</div>
					</div>

					<!-- Slug is auto-generated from title -->

					<div class="form-row">
						<div class="form-group">
							<label for="excerpt">Excerpt</label>
							<textarea
								id="excerpt"
								bind:value={form.excerpt}
								placeholder="Brief description of the post"
								rows="3"
							></textarea>
						</div>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="content">Content *</label>
							<RichTextEditor
								bind:this={richTextEditor}
								value={form.content}
								placeholder="Write your post content here..."
								onchange={handleContentChange}
							/>
						</div>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="author">Author</label>
							<input id="author" type="text" bind:value={form.author} placeholder="Author name" />
						</div>
						<div class="form-group">
							<label for="readTime">Read Time</label>
							<input
								id="readTime"
								type="text"
								bind:value={form.readTime}
								placeholder="5 min read"
							/>
						</div>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="tags">Tags</label>
							<input id="tags" type="text" bind:value={form.tags} placeholder="tag1, tag2, tag3" />
							<small>Separate tags with commas</small>
						</div>
					</div>

					<div class="form-row">
						<div class="checkbox-group">
							<label class="checkbox-label">
								<input type="checkbox" bind:checked={form.published} />
								Published
							</label>
							<label class="checkbox-label">
								<input type="checkbox" bind:checked={form.featured} />
								Featured
							</label>
						</div>
					</div>
				</form>
			</div>
		{/if}
	{/snippet}
</PageTemplate>

<style>
	.loading-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		color: #6b7280;
	}

	.editor-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.editor-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.editor-title {
		font-size: 2rem;
		font-weight: bold;
		color: #111827;
	}

	.editor-actions {
		display: flex;
		gap: 1rem;
	}

	.cancel-button {
		background-color: #6b7280;
		color: white;
		font-weight: 500;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.cancel-button:hover {
		background-color: #4b5563;
	}

	.save-button {
		background-color: #fe795d;
		color: white;
		font-weight: 500;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.save-button:hover:not(:disabled) {
		background-color: #ef562f;
	}

	.save-button:disabled {
		background-color: #9ca3af;
		cursor: not-allowed;
	}

	.error-message {
		background-color: #fef2f2;
		color: #dc2626;
		padding: 1rem;
		border-radius: 0.375rem;
		margin-bottom: 1rem;
	}

	.success-message {
		background-color: #f0fdf4;
		color: #166534;
		padding: 1rem;
		border-radius: 0.375rem;
		margin-bottom: 1rem;
	}

	.editor-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-row {
		display: flex;
		gap: 1rem;
	}

	.form-row:has(.form-group:only-child) {
		flex-direction: column;
	}

	.form-group {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group label {
		font-weight: 500;
		color: #374151;
		font-size: 0.875rem;
	}

	.form-group input,
	.form-group textarea {
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 1rem;
		transition: border-color 0.2s ease;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #fe795d;
		box-shadow: 0 0 0 3px rgba(254, 121, 93, 0.1);
	}

	.form-group textarea {
		resize: vertical;
		font-family: inherit;
	}

	.form-group small {
		color: #6b7280;
		font-size: 0.75rem;
	}

	.url-preview {
		margin-top: 0.5rem;
		padding: 0.5rem;
		background-color: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: 0.25rem;
		color: #166534;
	}

	.url-text {
		font-family: 'Courier New', monospace;
		font-weight: 500;
	}

	.checkbox-group {
		display: flex;
		gap: 2rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 500;
		color: #374151;
		cursor: pointer;
	}

	.checkbox-label input[type='checkbox'] {
		width: 1rem;
		height: 1rem;
		accent-color: #fe795d;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.editor-container {
			padding: 1rem;
		}

		.editor-header {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.editor-actions {
			justify-content: stretch;
		}

		.form-row {
			flex-direction: column;
		}

		.checkbox-group {
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>
