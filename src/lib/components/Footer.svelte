<script lang="ts">
	import {
		EnvelopeOutline,
		PhoneOutline,
		MapPinOutline,
		GithubSolid,
		TwitterSolid,
		LinkedinSolid,
		GlobeSolid
	} from 'flowbite-svelte-icons';

	// Footer configuration - easily customizable
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		main: [
			{ label: 'Home', href: '/' },
			{ label: 'About', href: '/about' },
			{ label: 'Contact', href: '/contact' }
		],
		legal: [
			{ label: 'Privacy Policy', href: '/privacy' },
			{ label: 'Terms of Service', href: '/terms' },
			{ label: 'Accessibility', href: '/accessibility' }
		],
		resources: [
			{ label: 'Blog', href: '/blog' },
			{ label: 'Resources', href: '/resources' },
			{ label: 'FAQ', href: '/faq' }
		]
	};

	const contactInfo = {
		email: 'contact@drallison.com',
		phone: '+1 (555) 123-4567',
		address: 'Available for remote consultations'
	};

	const socialLinks = [
		{ name: 'LinkedIn', href: '#', component: LinkedinSolid },
		{ name: 'Twitter', href: '#', component: TwitterSolid },
		{ name: 'GitHub', href: '#', component: GithubSolid },
		{ name: 'Website', href: '#', component: GlobeSolid }
	];
</script>

<footer class="site-footer">
	<div class="footer-container">
		<!-- Main Footer Content -->
		<div class="footer-content">
			<!-- Brand Section -->
			<div class="footer-brand">
				<h3 class="brand-title">Dr. Allison Andrews</h3>
				<p class="brand-description">
					Professional expertise in research, consulting, and academic collaboration.
				</p>

				<!-- Social Links -->
				<div class="social-links">
					{#each socialLinks as social}
						<a
							href={social.href}
							class="social-link"
							aria-label={social.name}
							target="_blank"
							rel="noopener noreferrer"
						>
							<svelte:component this={social.component} class="social-icon" />
						</a>
					{/each}
				</div>
			</div>

			<!-- Navigation Links -->
			<div class="footer-nav">
				<div class="nav-column">
					<h4 class="nav-title">Navigation</h4>
					<ul class="nav-list">
						{#each footerLinks.main as link}
							<li><a href={link.href} class="nav-link">{link.label}</a></li>
						{/each}
					</ul>
				</div>

				<div class="nav-column">
					<h4 class="nav-title">Resources</h4>
					<ul class="nav-list">
						{#each footerLinks.resources as link}
							<li><a href={link.href} class="nav-link">{link.label}</a></li>
						{/each}
					</ul>
				</div>

				<div class="nav-column">
					<h4 class="nav-title">Legal</h4>
					<ul class="nav-list">
						{#each footerLinks.legal as link}
							<li><a href={link.href} class="nav-link">{link.label}</a></li>
						{/each}
					</ul>
				</div>
			</div>

			<!-- Contact Information -->
			<div class="footer-contact">
				<h4 class="contact-title">Get in Touch</h4>
				<div class="contact-info">
					<div class="contact-item">
						<EnvelopeOutline class="contact-icon" />
						<a href="mailto:{contactInfo.email}" class="contact-link">
							{contactInfo.email}
						</a>
					</div>

					<div class="contact-item">
						<PhoneOutline class="contact-icon" />
						<a href="tel:{contactInfo.phone.replace(/\D/g, '')}" class="contact-link">
							{contactInfo.phone}
						</a>
					</div>

					<div class="contact-item">
						<MapPinOutline class="contact-icon" />
						<span class="contact-text">{contactInfo.address}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer Bottom -->
		<div class="footer-bottom">
			<div class="footer-bottom-content">
				<p class="copyright">
					© {currentYear} Dr. Allison Andrews. All rights reserved.
				</p>

				<div class="footer-meta">
					<span class="meta-item">Built with SvelteKit</span>
					<span class="meta-separator">•</span>
					<span class="meta-item">Designed for accessibility</span>
				</div>
			</div>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		background-color: #1f2937;
		color: #d1d5db;
		margin-top: auto;
	}

	.footer-container {
		max-width: 1280px;
		margin: 0 auto;
		padding: 3rem 1rem 1rem;
	}

	@media (min-width: 640px) {
		.footer-container {
			padding: 4rem 1.5rem 1.5rem;
		}
	}

	@media (min-width: 768px) {
		.footer-container {
			padding: 4rem 2rem 1.5rem;
		}
	}

	@media (min-width: 1024px) {
		.footer-container {
			padding: 5rem 3rem 2rem;
		}
	}

	@media (min-width: 1280px) {
		.footer-container {
			padding: 5rem 4rem 2rem;
		}
	}

	.footer-content {
		display: grid;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	@media (min-width: 768px) {
		.footer-content {
			grid-template-columns: 1fr 2fr 1fr;
			gap: 3rem;
		}
	}

	/* Brand Section */
	.footer-brand {
		max-width: 300px;
	}

	.brand-title {
		font-size: 1.25rem;
		font-weight: bold;
		color: white;
		margin-bottom: 0.75rem;
	}

	.brand-description {
		font-size: 0.875rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
		color: #9ca3af;
	}

	.social-links {
		display: flex;
		gap: 1rem;
	}

	.social-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		background-color: #374151;
		border-radius: 0.5rem;
		transition: all 0.2s ease-in-out;
		text-decoration: none;
	}

	.social-link:hover {
		background-color: #4b5563;
		transform: translateY(-2px);
	}

	/* Navigation Section */
	.footer-nav {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 2rem;
	}

	@media (min-width: 768px) {
		.footer-nav {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.nav-column {
		min-width: 0;
	}

	.nav-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: white;
		margin-bottom: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.nav-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.nav-list li {
		margin-bottom: 0.5rem;
	}

	.nav-link {
		color: #9ca3af;
		text-decoration: none;
		font-size: 0.875rem;
		transition: color 0.2s ease-in-out;
	}

	.nav-link:hover {
		color: white;
	}

	/* Contact Section */
	.footer-contact {
		max-width: 300px;
	}

	.contact-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: white;
		margin-bottom: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.contact-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	:global(.contact-icon) {
		width: 1.25rem;
		height: 1.25rem;
		color: #9ca3af;
		flex-shrink: 0;
	}

	.contact-link {
		color: #9ca3af;
		text-decoration: none;
		font-size: 0.875rem;
		transition: color 0.2s ease-in-out;
	}

	.contact-link:hover {
		color: white;
	}

	.contact-text {
		color: #9ca3af;
		font-size: 0.875rem;
	}

	/* Footer Bottom */
	.footer-bottom {
		border-top: 1px solid #374151;
		padding-top: 1.5rem;
	}

	.footer-bottom-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;
	}

	@media (min-width: 768px) {
		.footer-bottom-content {
			flex-direction: row;
			justify-content: space-between;
			text-align: left;
		}
	}

	.copyright {
		font-size: 0.875rem;
		color: #9ca3af;
		margin: 0;
	}

	.footer-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		color: #6b7280;
	}

	.meta-separator {
		color: #4b5563;
	}

	/* Light mode styles */
	@media (prefers-color-scheme: light) {
		.site-footer {
			background-color: #f9fafb;
			color: #374151;
			border-top: 1px solid #e5e7eb;
		}

		.brand-title,
		.nav-title,
		.contact-title {
			color: #111827;
		}

		.brand-description,
		.nav-link,
		.contact-link,
		.contact-text,
		.copyright {
			color: #6b7280;
		}

		.nav-link:hover,
		.contact-link:hover {
			color: #111827;
		}

		.social-link {
			background-color: #e5e7eb;
		}

		.social-link:hover {
			background-color: #d1d5db;
		}

		:global(.social-icon),
		:global(.contact-icon) {
			color: #6b7280;
		}

		.footer-bottom {
			border-top-color: #e5e7eb;
		}

		.footer-meta {
			color: #9ca3af;
		}

		.meta-separator {
			color: #d1d5db;
		}
	}
</style>
