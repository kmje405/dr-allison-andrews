<script lang="ts">
	type NavLink = {
		label: string;
		href: string;
	};
	const navLinks: NavLink[] = [
		{ label: 'Home', href: '/' },
		{ label: 'About', href: '/about' }
	];
</script>

<div class="navigation">
	<nav>
		<ul>
			{#each navLinks as { label, href }}
				<li><a {href}>{label}</a></li>
			{/each}
		</ul>
	</nav>
</div>

<style>
	.navigation {
		position: relative;
	}

	nav ul {
		display: flex;
		flex-direction: row;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 1rem;
	}

	nav li {
		margin: 0;
	}

	nav a {
		text-decoration: none;
		padding: 0.5rem 1rem;
		display: block;
	}
</style>
