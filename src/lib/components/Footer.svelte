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

	.social-icon {
		width: 1.25rem;
		height: 1.25rem;
		background-color: #d1d5db;
		mask-size: contain;
		mask-repeat: no-repeat;
		mask-position: center;
	}

	/* Social icon masks - you can replace these with actual SVG icons */
	.social-linkedin {
		mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/%3E%3C/svg%3E");
	}
	.social-twitter {
		mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'/%3E%3C/svg%3E");
	}
	.social-research {
		mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E");
	}
	.social-orcid {
		mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947 0 .525-.422.947-.947.947-.525 0-.946-.422-.946-.947 0-.525.421-.947.946-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 3.925-1.303 3.925-3.722 0-2.016-1.284-3.722-3.925-3.722h-2.297z'/%3E%3C/svg%3E");
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
