<script lang="ts">
	import { browser } from '$app/environment';

	let showRuler = $state(false);
	let showLegend = $state(false);
	let currentBreakpoint = $state('');
	let windowWidth = $state(0);

	// Visual guide toggles
	let showContainerGuide = $state(true);
	let showBreakpointEdges = $state(true);
	let showComponentOutlines = $state(true);
	let showGridOverlay = $state(false);

	// Dragging state
	let isDragging = $state(false);
	let dragOffset = $state({ x: 0, y: 0 });
	let legendPosition = $state({ x: 20, y: 70 }); // Default position from right/top

	// Breakpoint definitions matching our design system
	const breakpoints = {
		base: { min: 0, max: 474, color: '#ef4444' },
		xs: { min: 475, max: 639, color: '#f97316' },
		sm: { min: 640, max: 767, color: '#eab308' },
		md: { min: 768, max: 1023, color: '#22c55e' },
		lg: { min: 1024, max: 1279, color: '#3b82f6' },
		xl: { min: 1280, max: 1535, color: '#8b5cf6' },
		'2xl': { min: 1536, max: Infinity, color: '#ec4899' }
	};

	// Toggle ruler with keyboard shortcut (Ctrl/Cmd + Shift + R)
	function handleKeydown(event: KeyboardEvent) {
		if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'R') {
			event.preventDefault();
			showRuler = !showRuler;
		}
	}

	// Listen for custom event from mobile navigation
	function handleToggleEvent() {
		showRuler = !showRuler;
		if (showRuler) {
			showLegend = true; // Auto-open legend when toggled from mobile
		}
	}

	// Update current breakpoint based on window size
	function updateBreakpoint() {
		if (!browser) return;

		windowWidth = window.innerWidth;
		const width = windowWidth;

		if (width >= 1536) currentBreakpoint = '2xl';
		else if (width >= 1280) currentBreakpoint = 'xl';
		else if (width >= 1024) currentBreakpoint = 'lg';
		else if (width >= 768) currentBreakpoint = 'md';
		else if (width >= 640) currentBreakpoint = 'sm';
		else if (width >= 475) currentBreakpoint = 'xs';
		else currentBreakpoint = 'base';
	}

	$effect(() => {
		if (browser) {
			updateBreakpoint();
			window.addEventListener('resize', updateBreakpoint);
			window.addEventListener('toggle-breakpoint-ruler', handleToggleEvent);
			return () => {
				window.removeEventListener('resize', updateBreakpoint);
				window.removeEventListener('toggle-breakpoint-ruler', handleToggleEvent);
			};
		}
	});

	// Drag functionality
	function handleMouseDown(event: MouseEvent) {
		if (event.target instanceof HTMLElement && event.target.closest('.legend-header')) {
			isDragging = true;
			const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
			dragOffset.x = event.clientX - rect.left;
			dragOffset.y = event.clientY - rect.top;

			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
			event.preventDefault();
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging) return;

		const newX = event.clientX - dragOffset.x;
		const newY = event.clientY - dragOffset.y;

		// Keep legend within viewport bounds
		const maxX = window.innerWidth - 280; // legend width
		const maxY = window.innerHeight - 200; // approximate legend height

		legendPosition.x = Math.max(0, Math.min(newX, maxX));
		legendPosition.y = Math.max(60, Math.min(newY, maxY)); // Keep below ruler bar
	}

	function handleMouseUp() {
		isDragging = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showRuler}
	<!-- Main ruler bar -->
	<div class="breakpoint-ruler" role="complementary" aria-label="Development breakpoint ruler">
		<!-- Current breakpoint indicator -->
		<div class="breakpoint-indicator">
			<span
				class="breakpoint-name"
				style="color: {breakpoints[currentBreakpoint as keyof typeof breakpoints]?.color}"
				>{currentBreakpoint}</span
			>
			<span class="breakpoint-size">{windowWidth}px</span>
		</div>

		<!-- Breakpoint markers -->
		<div class="breakpoint-markers">
			{#each Object.entries(breakpoints) as [name, bp]}
				<div
					class="marker"
					class:active={name === currentBreakpoint}
					style="background-color: {bp.color}"
					data-breakpoint="{name} ({bp.min === 0 ? '0' : bp.min}px+)"
				></div>
			{/each}
		</div>

		<!-- Control buttons -->
		<div class="ruler-controls">
			<button
				class="control-button legend-toggle"
				onclick={() => (showLegend = !showLegend)}
				aria-label="Toggle legend"
				class:active={showLegend}
			>
				⚙️
			</button>
			<button
				class="control-button ruler-toggle"
				onclick={() => (showRuler = false)}
				aria-label="Hide breakpoint ruler"
			>
				×
			</button>
		</div>

		<!-- Instructions -->
		<div class="ruler-instructions">
			Press <kbd>Ctrl/Cmd + Shift + R</kbd> to toggle
		</div>
	</div>

	<!-- Legend panel -->
	{#if showLegend}
		<div
			class="legend-panel"
			class:dragging={isDragging}
			style="left: {legendPosition.x}px; top: {legendPosition.y}px;"
			onmousedown={handleMouseDown}
		>
			<div class="legend-header">
				<div class="drag-handle">
					<span class="drag-icon">⋮⋮</span>
					<h3>Visual Guides</h3>
				</div>
				<button class="legend-close" onclick={() => (showLegend = false)}>×</button>
			</div>
			<div class="legend-content">
				<label class="legend-item">
					<input type="checkbox" bind:checked={showContainerGuide} />
					<span class="legend-color" style="background-color: #3b82f6;"></span>
					Container Guide (1280px)
				</label>

				<label class="legend-item">
					<input type="checkbox" bind:checked={showBreakpointEdges} />
					<span class="legend-color" style="background-color: #8b5cf6;"></span>
					Breakpoint Edges
				</label>

				<label class="legend-item">
					<input type="checkbox" bind:checked={showComponentOutlines} />
					<span class="legend-color" style="background-color: #10b981;"></span>
					Component Outlines
				</label>

				<label class="legend-item">
					<input type="checkbox" bind:checked={showGridOverlay} />
					<span class="legend-color" style="background-color: #ffffff;"></span>
					Grid Overlay
				</label>
			</div>
		</div>
	{/if}

	<!-- Visual guides overlay -->
	<div class="visual-guides">
		<!-- Container width guide (1280px max-width) -->
		{#if showContainerGuide}
			<div class="container-guide">
				<div class="container-outline">
					<div class="guide-label">Container: 1280px max-width</div>
				</div>
			</div>
		{/if}

		<!-- Breakpoint edge indicators -->
		{#if showBreakpointEdges}
			{#each Object.entries(breakpoints) as [name, bp]}
				{#if bp.min > 0 && bp.min <= windowWidth + 200}
					<div
						class="breakpoint-edge"
						style="left: {bp.min}px; border-color: {bp.color};"
						data-label="{name} ({bp.min}px)"
					>
						<div class="edge-label" style="background-color: {bp.color}">
							{name} ({bp.min}px)
						</div>
					</div>
				{/if}
			{/each}
		{/if}

		<!-- Component boundary highlighter -->
		{#if showComponentOutlines}
			<div class="component-highlighter">
				<!-- Navigation boundary -->
				<div class="component-outline nav-outline">
					<div class="component-label">Navigation</div>
				</div>

				<!-- Page container boundary -->
				<div class="component-outline page-outline">
					<div class="component-label">Page Container</div>
				</div>
			</div>
		{/if}

		<!-- Grid overlay -->
		{#if showGridOverlay}
			<div class="grid-overlay">
				{#each Array(20) as _, i}
					<div class="grid-line vertical" style="left: {(i + 1) * 5}%"></div>
				{/each}
				{#each Array(10) as _, i}
					<div class="grid-line horizontal" style="top: {(i + 1) * 10}%"></div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.breakpoint-ruler {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 60px;
		background: rgba(0, 0, 0, 0.95);
		color: white;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 12px;
		border-bottom: 3px solid #3b82f6;
		backdrop-filter: blur(10px);
	}

	.breakpoint-indicator {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.breakpoint-name {
		font-size: 18px;
		font-weight: bold;
		text-shadow: 0 0 10px currentColor;
	}

	.breakpoint-size {
		font-size: 12px;
		color: #9ca3af;
	}

	.breakpoint-markers {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex: 1;
		justify-content: center;
	}

	.marker {
		position: relative;
		width: 3px;
		height: 35px;
		cursor: help;
		transition: all 0.2s ease;
		opacity: 0.6;
	}

	.marker.active {
		opacity: 1;
		height: 45px;
		box-shadow: 0 0 15px currentColor;
	}

	.marker::after {
		content: attr(data-breakpoint);
		position: absolute;
		bottom: -25px;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		font-size: 9px;
		color: #9ca3af;
		background: rgba(0, 0, 0, 0.8);
		padding: 2px 4px;
		border-radius: 2px;
	}

	.ruler-controls {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.control-button {
		border: none;
		border-radius: 50%;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 16px;
		line-height: 1;
		transition: all 0.2s ease;
	}

	.legend-toggle {
		background: #6b7280;
		color: white;
	}

	.legend-toggle:hover {
		background: #4b5563;
		transform: scale(1.1);
	}

	.legend-toggle.active {
		background: #3b82f6;
		box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
	}

	.ruler-toggle {
		background: #ef4444;
		color: white;
	}

	.ruler-toggle:hover {
		background: #dc2626;
		transform: scale(1.1);
	}

	.ruler-instructions {
		font-size: 10px;
		color: #6b7280;
		text-align: right;
	}

	kbd {
		background: #374151;
		padding: 2px 4px;
		border-radius: 3px;
		font-size: 9px;
	}

	/* Legend panel */
	.legend-panel {
		position: fixed;
		width: 280px;
		background: rgba(0, 0, 0, 0.95);
		color: white;
		border-radius: 8px;
		border: 1px solid #374151;
		z-index: 10000;
		backdrop-filter: blur(10px);
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		cursor: move;
		transition: box-shadow 0.2s ease;
	}

	.legend-panel.dragging {
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
		cursor: grabbing;
	}

	.legend-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		border-bottom: 1px solid #374151;
		cursor: grab;
	}

	.legend-header:active {
		cursor: grabbing;
	}

	.drag-handle {
		display: flex;
		align-items: center;
		gap: 8px;
		flex: 1;
	}

	.drag-icon {
		color: #6b7280;
		font-size: 12px;
		line-height: 1;
		user-select: none;
	}

	.legend-header h3 {
		margin: 0;
		font-size: 14px;
		font-weight: bold;
		color: #3b82f6;
		user-select: none;
	}

	.legend-close {
		background: #ef4444;
		color: white;
		border: none;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 14px;
		line-height: 1;
	}

	.legend-close:hover {
		background: #dc2626;
	}

	.legend-content {
		padding: 16px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
		cursor: pointer;
		font-size: 12px;
		transition: all 0.2s ease;
	}

	.legend-item:hover {
		color: #3b82f6;
	}

	.legend-item:last-child {
		margin-bottom: 0;
	}

	.legend-item input[type='checkbox'] {
		width: 14px;
		height: 14px;
		cursor: pointer;
	}

	.legend-color {
		width: 12px;
		height: 12px;
		border-radius: 2px;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	/* Visual guides overlay */
	.visual-guides {
		position: fixed;
		top: 60px;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		z-index: 9998;
	}

	/* Container guide */
	.container-guide {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: 1280px;
		height: 100%;
	}

	.container-outline {
		position: relative;
		width: 100%;
		height: 100%;
		border: 2px dashed #3b82f6;
		border-top: none;
	}

	.guide-label {
		position: absolute;
		top: 10px;
		right: 10px;
		background: #3b82f6;
		color: white;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 11px;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
	}

	/* Breakpoint edges */
	.breakpoint-edge {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		border-left: 2px solid;
		opacity: 0.7;
	}

	.edge-label {
		position: absolute;
		top: 20px;
		left: 5px;
		color: white;
		padding: 2px 6px;
		border-radius: 3px;
		font-size: 10px;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		white-space: nowrap;
		transform: rotate(90deg);
		transform-origin: left center;
	}

	/* Component highlighter */
	.component-highlighter {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.component-outline {
		position: absolute;
		border: 1px solid;
		border-radius: 4px;
	}

	.nav-outline {
		top: 0;
		left: 0;
		right: 0;
		height: 80px;
		border-color: #f59e0b;
		background: rgba(245, 158, 11, 0.1);
	}

	.page-outline {
		top: 80px;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: 1280px;
		bottom: 0;
		border-color: #10b981;
		background: rgba(16, 185, 129, 0.05);
	}

	.component-label {
		position: absolute;
		top: 5px;
		left: 10px;
		background: rgba(0, 0, 0, 0.8);
		color: white;
		padding: 2px 6px;
		border-radius: 3px;
		font-size: 10px;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
	}

	/* Grid overlay */
	.grid-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0.4;
		pointer-events: none;
	}

	.grid-line {
		position: absolute;
		background: #3b82f6;
		box-shadow: 0 0 1px rgba(59, 130, 246, 0.5);
	}

	.grid-line.vertical {
		width: 1px;
		height: 100%;
	}

	.grid-line.horizontal {
		height: 1px;
		width: 100%;
	}

	/* Dark mode grid lines */
	@media (prefers-color-scheme: dark) {
		.grid-line {
			background: #60a5fa;
			box-shadow: 0 0 1px rgba(96, 165, 250, 0.5);
		}
	}

	/* Responsive visibility */
	@media (max-width: 640px) {
		.breakpoint-markers {
			gap: 0.5rem;
		}

		.marker::after {
			font-size: 8px;
		}

		.ruler-instructions {
			display: none;
		}
	}
</style>
