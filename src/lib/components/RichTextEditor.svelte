<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		value: string;
		placeholder?: string;
		onchange?: (content: string) => void;
	}

	const { value = '', placeholder = 'Write your content here...', onchange }: Props = $props();

	let editorContainer: HTMLDivElement;
	let quill: any;

	onMount(async () => {
		if (browser) {
			// Dynamically import Quill to avoid SSR issues
			const { default: Quill } = await import('quill');

			// Import Quill CSS
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
			document.head.appendChild(link);

			// Configure Quill with blog-appropriate toolbar
			quill = new Quill(editorContainer, {
				theme: 'snow',
				placeholder,
				modules: {
					toolbar: [
						[{ header: [1, 2, 3, false] }],
						['bold', 'italic', 'underline', 'strike'],
						[{ color: [] }, { background: [] }],
						[{ list: 'ordered' }, { list: 'bullet' }],
						[{ indent: '-1' }, { indent: '+1' }],
						[{ align: [] }],
						['blockquote', 'code-block'],
						['link', 'image'],
						['clean']
					]
				}
			});

			// Set initial content
			if (value) {
				quill.root.innerHTML = value;
			}

			// Listen for content changes
			quill.on('text-change', () => {
				const content = quill.root.innerHTML;
				if (onchange) {
					onchange(content);
				}
			});
		}
	});

	onDestroy(() => {
		if (quill) {
			quill = null;
		}
	});

	// Method to get content (can be called from parent)
	export function getContent(): string {
		return quill ? quill.root.innerHTML : '';
	}

	// Method to set content (can be called from parent)
	export function setContent(content: string): void {
		if (quill) {
			quill.root.innerHTML = content;
		}
	}
</script>

<div class="rich-text-editor">
	<div bind:this={editorContainer} class="editor-container"></div>
</div>

<style>
	.rich-text-editor {
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		overflow: hidden;
	}

	.rich-text-editor :global(.ql-toolbar) {
		border: none;
		border-bottom: 1px solid #e5e7eb;
		background-color: #f9fafb;
	}

	.rich-text-editor :global(.ql-container) {
		border: none;
		font-family: inherit;
		font-size: 1rem;
		line-height: 1.6;
	}

	.rich-text-editor :global(.ql-editor) {
		min-height: 300px;
		padding: 1rem;
	}

	.rich-text-editor :global(.ql-editor.ql-blank::before) {
		color: #9ca3af;
		font-style: normal;
	}

	.rich-text-editor :global(.ql-editor h1) {
		font-size: 2rem;
		font-weight: bold;
		margin: 1rem 0;
	}

	.rich-text-editor :global(.ql-editor h2) {
		font-size: 1.5rem;
		font-weight: bold;
		margin: 0.875rem 0;
	}

	.rich-text-editor :global(.ql-editor h3) {
		font-size: 1.25rem;
		font-weight: bold;
		margin: 0.75rem 0;
	}

	.rich-text-editor :global(.ql-editor p) {
		margin: 0.5rem 0;
	}

	.rich-text-editor :global(.ql-editor blockquote) {
		border-left: 4px solid #fe795d;
		padding-left: 1rem;
		margin: 1rem 0;
		font-style: italic;
		color: #6b7280;
	}

	.rich-text-editor :global(.ql-editor pre) {
		background-color: #f3f4f6;
		border-radius: 0.375rem;
		padding: 1rem;
		margin: 1rem 0;
		overflow-x: auto;
	}

	.rich-text-editor :global(.ql-editor ul),
	.rich-text-editor :global(.ql-editor ol) {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}

	.rich-text-editor :global(.ql-editor li) {
		margin: 0.25rem 0;
	}

	/* Focus styles */
	.rich-text-editor:focus-within {
		border-color: #fe795d;
		box-shadow: 0 0 0 3px rgba(254, 121, 93, 0.1);
	}
</style>
