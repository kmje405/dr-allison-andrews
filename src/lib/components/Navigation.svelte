<script lang="ts">
	import { BarsOutline, CloseOutline } from 'flowbite-svelte-icons';

	type NavLink = {
		label: string;
		href: string;
	};

	const navLinks: NavLink[] = [
		{ label: 'About', href: '/about' },
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
</script>

<div class="navigation">
	<nav class="flex items-center justify-between p-6">
		<!-- Logo/Brand -->
		<div class="text-xl font-bold">
			<a href="/" class="text-gray-900 dark:text-white">Dr. Allison Andrews</a>
		</div>

		<!-- Desktop Navigation -->
		<ul class="hidden md:flex">
			{#each navLinks as { label, href }}
				<li class="m-0">
					<a {href} class="nav-link">{label}</a>
				</li>
			{/each}
		</ul>

		<!-- Mobile Menu Button -->
		<button
			class="md:hidden p-2 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
			aria-label="Open menu"
			aria-controls="mobile-drawer"
			aria-expanded={mobileMenuOpen}
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
		>
			<BarsOutline class="h-10 w-10" />
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
	<div class="flex items-center justify-end mb-6 p-4 pr-6">
		<button
			class="p-2 mr-2 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
			aria-label="Close menu"
			onclick={() => (mobileMenuOpen = false)}
		>
			<CloseOutline class="h-5 w-5" />
		</button>
	</div>

	<nav class="space-y-0 p-4">
		{#each navLinks as { label, href }}
			<a {href} class="mobile-nav-link" onclick={() => (mobileMenuOpen = false)}>
				{label}
			</a>
		{/each}
	</nav>
</div>

<style>
	.navigation {
		position: relative;
		background-color: white;
		border-bottom: 1px solid #e5e7eb;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	}

	.navigation ul {
		display: flex;
		flex-direction: row;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 1rem;
	}

	/* Hide desktop nav on mobile */
	@media (max-width: 767px) {
		.navigation ul {
			display: none;
		}
	}

	/* Show desktop nav on medium screens and up */
	@media (min-width: 768px) {
		.navigation ul {
			display: flex;
		}
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

	@media (prefers-color-scheme: dark) {
		.mobile-drawer {
			background-color: #1f2937;
		}
	}

	/* Mobile nav item spacing */
	.mobile-nav-link {
		padding-top: 0.75rem !important;
		padding-bottom: 4rem !important;
		padding-left: 0.75rem !important;
		padding-right: 0.75rem !important;
		display: block;
		color: #111827;
		border-radius: 0.375rem;
		transition: all 0.2s ease-in-out;
		text-decoration: none;
	}

	.mobile-nav-link:hover {
		background-color: #f3f4f6;
	}

	@media (prefers-color-scheme: dark) {
		.mobile-nav-link {
			color: white;
		}

		.mobile-nav-link:hover {
			background-color: #374151;
		}
	}

	/* Close button spacing */
	.mobile-drawer .flex {
		padding-right: 0.5rem;
		padding-top: 0.5rem;
	}

	.mobile-drawer button[aria-label='Close menu'] {
		margin-right: 0.5rem !important;
		padding: 0.5rem !important;
	}

	/* Hamburger menu button spacing */
	nav button[aria-label='Open menu'] {
		margin-right: 0.5rem;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}
</style>
