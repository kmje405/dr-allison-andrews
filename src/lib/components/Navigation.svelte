<script lang="ts">
	import { BarsOutline, CloseOutline } from 'flowbite-svelte-icons';
	import { dev } from '$app/environment';

	type NavLink = {
		label: string;
		href: string;
	};

	const navLinks: NavLink[] = [
		{ label: 'Home', href: '/' },
		{ label: 'About', href: '/about' },
		{ label: 'Blog', href: '/blog' },
		{ label: 'Contact', href: '/contact' }
	];

	let mobileMenuOpen = $state(false);

	// Prevent body scroll when mobile menu is open
	$effect(() => {
		document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	// Toggle breakpoint ruler
	function toggleBreakpointRuler() {
		// Dispatch custom event to toggle ruler
		window.dispatchEvent(new CustomEvent('toggle-breakpoint-ruler'));
	}
</script>

<div class="navigation">
	<nav class="nav-container">
		<!-- Logo/Brand -->
		<div class="nav-brand">
			<a href="/" class="brand-link">Dr. Allison Andrews</a>
		</div>

		<!-- Desktop Navigation -->
		<ul class="nav-desktop">
			{#each navLinks as { label, href }}
				<li class="nav-item">
					<a {href} class="nav-link">{label}</a>
				</li>
			{/each}
		</ul>

		<!-- Mobile Menu Button -->
		<button
			class="mobile-menu-button"
			aria-label="Open menu"
			aria-controls="mobile-drawer"
			aria-expanded={mobileMenuOpen}
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
		>
			<BarsOutline class="menu-icon" />
		</button>
	</nav>
</div>

<!-- Mobile Menu Overlay -->
{#if mobileMenuOpen}
	<div
		class="mobile-overlay"
		aria-hidden="true"
		onclick={() => (mobileMenuOpen = false)}
		onkeydown={(e) => e.key === 'Escape' && (mobileMenuOpen = false)}
		role="button"
		tabindex="0"
	></div>
{/if}

<!-- Mobile Drawer -->
<div
	id="mobile-drawer"
	class="mobile-drawer"
	class:open={mobileMenuOpen}
	role="dialog"
	aria-modal="true"
	aria-label="Site navigation"
	tabindex="-1"
	onclick={(e) => e.stopPropagation()}
	onkeydown={(e) => e.key === 'Escape' && (mobileMenuOpen = false)}
>
	<div class="drawer-header">
		<button class="close-button" aria-label="Close menu" onclick={() => (mobileMenuOpen = false)}>
			<CloseOutline class="close-icon" />
		</button>
	</div>

	<nav class="drawer-nav">
		{#each navLinks as { label, href }}
			<a {href} class="mobile-nav-link" onclick={() => (mobileMenuOpen = false)}>
				{label}
			</a>
		{/each}

		<!-- Development tools (only in dev mode) -->
		{#if dev}
			<div class="dev-section">
				<div class="dev-label">Development Tools</div>
				<button
					class="dev-toggle"
					onclick={() => {
						toggleBreakpointRuler();
						mobileMenuOpen = false;
					}}
				>
					⚙️ Toggle Guides
				</button>
			</div>
		{/if}
	</nav>
</div>

<style>
	.navigation {
		position: relative;
		background-color: white;
		border-bottom: 1px solid #e5e7eb;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	}

	.nav-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		max-width: 1280px;
		margin-left: auto;
		margin-right: auto;
		padding: 1.5rem 1rem;
	}

	/* Responsive padding to match PageTemplate */
	@media (min-width: 640px) {
		.nav-container {
			padding: 1.5rem 1.5rem;
		}
	}

	@media (min-width: 768px) {
		.nav-container {
			padding: 1.5rem 2rem;
		}
	}

	@media (min-width: 1024px) {
		.nav-container {
			padding: 1.5rem 3rem;
		}
	}

	@media (min-width: 1280px) {
		.nav-container {
			padding: 1.5rem 4rem;
		}
	}

	.nav-brand {
		font-size: 1.25rem;
		font-weight: bold;
	}

	.brand-link {
		color: #111827;
		text-decoration: none;
	}

	.nav-desktop {
		display: none;
		flex-direction: row;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.nav-desktop {
			display: flex;
		}
	}

	.nav-item {
		margin: 0;
	}

	.nav-link {
		text-decoration: none;
		padding: 0.5rem 1rem;
		display: block;
		color: #374151;
		font-weight: 500;
		border-radius: 0.375rem;
		transition: all 0.2s ease-in-out;
	}

	.nav-link:hover {
		background-color: #f3f4f6;
		color: #1f2937;
	}

	.mobile-menu-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid #d1d5db;
		background-color: white;
		font-size: 0.875rem;
		font-weight: 500;
		color: #111827;
		cursor: pointer;
		margin-right: 0.5rem;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		transition: all 0.2s ease-in-out;
	}

	.mobile-menu-button:hover {
		background-color: #f3f4f6;
		color: #3b82f6;
	}

	.mobile-menu-button:focus {
		z-index: 10;
		outline: none;
		box-shadow: 0 0 0 4px rgba(156, 163, 175, 0.5);
	}

	@media (min-width: 768px) {
		.mobile-menu-button {
			display: none;
		}
	}

	:global(.menu-icon) {
		height: 2.5rem;
		width: 2.5rem;
	}

	.mobile-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 40;
	}

	.mobile-drawer {
		position: fixed;
		top: 0;
		right: 0;
		height: 100vh;
		width: 320px;
		background-color: white;
		box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
		transform: translateX(100%);
		transition: transform 0.3s ease-in-out;
		z-index: 50;
	}

	.mobile-drawer.open {
		transform: translateX(0);
	}

	.drawer-header {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-bottom: 1.5rem;
		padding: 1rem;
		padding-right: 0.5rem;
		padding-top: 0.5rem;
	}

	.close-button {
		padding: 0.5rem;
		margin-right: 0.5rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.5rem;
		border: 1px solid #d1d5db;
		background-color: white;
		font-size: 0.875rem;
		font-weight: 500;
		color: #111827;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	.close-button:hover {
		background-color: #f3f4f6;
		color: #3b82f6;
	}

	.close-button:focus {
		z-index: 10;
		outline: none;
		box-shadow: 0 0 0 4px rgba(156, 163, 175, 0.5);
	}

	:global(.close-icon) {
		height: 1.25rem;
		width: 1.25rem;
	}

	.drawer-nav {
		padding: 1rem;
	}

	.mobile-nav-link {
		padding-top: 0.75rem;
		padding-bottom: 4rem;
		padding-left: 0.75rem;
		padding-right: 0.75rem;
		display: block;
		color: #111827;
		border-radius: 0.375rem;
		transition: all 0.2s ease-in-out;
		text-decoration: none;
	}

	.mobile-nav-link:hover {
		background-color: #f3f4f6;
	}

	.dev-section {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid #e5e7eb;
	}

	.dev-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.5rem;
		padding-left: 0.75rem;
	}

	.dev-toggle {
		width: 100%;
		padding: 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #3b82f6;
		background: rgba(59, 130, 246, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		text-align: left;
	}

	.dev-toggle:hover {
		background: rgba(59, 130, 246, 0.15);
		border-color: rgba(59, 130, 246, 0.3);
	}

	/* Dark mode styles */
	@media (prefers-color-scheme: dark) {
		.navigation {
			background-color: #1f2937;
			border-bottom-color: #374151;
		}

		.brand-link {
			color: white;
		}

		.mobile-menu-button {
			border-color: #4b5563;
			background-color: #374151;
			color: #d1d5db;
		}

		.mobile-menu-button:hover {
			background-color: #4b5563;
			color: white;
		}

		.mobile-menu-button:focus {
			box-shadow: 0 0 0 4px rgba(75, 85, 99, 0.5);
		}

		.mobile-drawer {
			background-color: #1f2937;
		}

		.close-button {
			border-color: #4b5563;
			background-color: #374151;
			color: #d1d5db;
		}

		.close-button:hover {
			background-color: #4b5563;
			color: white;
		}

		.close-button:focus {
			box-shadow: 0 0 0 4px rgba(75, 85, 99, 0.5);
		}

		.mobile-nav-link {
			color: white;
		}

		.mobile-nav-link:hover {
			background-color: #374151;
		}

		.dev-section {
			border-top-color: #374151;
		}

		.dev-label {
			color: #9ca3af;
		}

		.dev-toggle {
			color: #60a5fa;
			background: rgba(96, 165, 250, 0.1);
			border-color: rgba(96, 165, 250, 0.2);
		}

		.dev-toggle:hover {
			background: rgba(96, 165, 250, 0.15);
			border-color: rgba(96, 165, 250, 0.3);
		}
	}
</style>
