# Best Practices Implementation Guide

This document outlines the best practices implemented in this SvelteKit project for responsive design, SEO, and development workflow.

## 🎯 Standardized Breakpoints

### Breakpoint System

We've implemented a standardized breakpoint system in `src/app.css`:

```css
/* Standardized breakpoints */
--breakpoint-xs: 475px; /* Extra small devices */
--breakpoint-sm: 640px; /* Small devices (phones) */
--breakpoint-md: 768px; /* Medium devices (tablets) */
--breakpoint-lg: 1024px; /* Large devices (desktops) */
--breakpoint-xl: 1280px; /* Extra large devices */
--breakpoint-2xl: 1536px; /* 2X large devices */
```

### Container Sizes

Corresponding container max-widths for each breakpoint:

```css
--container-xs: 100%;
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### Usage in Tailwind

Use standard Tailwind responsive prefixes:

- `xs:` - 475px and up
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up
- `2xl:` - 1536px and up

## 🔧 Development Tools

### Breakpoint Ruler

A toggleable development tool to visualize breakpoints:

**Location**: `src/lib/components/BreakpointRuler.svelte`

**Features**:

- Shows current breakpoint and screen width
- Visual markers for all breakpoints
- Keyboard shortcut: `Ctrl/Cmd + Shift + R`
- Only visible in development mode
- Color-coded breakpoint indicators

**Usage**:

```svelte
import BreakpointRuler from '$lib/components/BreakpointRuler.svelte';

{#if dev}
	<BreakpointRuler />
{/if}
```

## 📄 SEO & Meta Tags System

### SEO Utilities

**Location**: `src/lib/utils/seo.ts`

**Features**:

- TypeScript interfaces for SEO data
- Default SEO configuration
- Utility functions for title generation, canonical URLs
- JSON-LD structured data generation
- SEO validation helpers

### SEO Data Interface

```typescript
interface SEOData {
	title?: string;
	description?: string;
	keywords?: string[];
	author?: string;
	canonical?: string;
	robots?: string;

	// Open Graph
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	ogType?: 'website' | 'article' | 'profile';

	// Twitter Card
	twitterCard?: 'summary' | 'summary_large_image';
	twitterSite?: string;

	// Article specific
	articleAuthor?: string;
	articlePublishedTime?: string;
	articleTags?: string[];
}
```

### SEO Head Component

**Location**: `src/lib/components/SEOHead.svelte`

Automatically generates:

- Basic meta tags (title, description, keywords)
- Open Graph meta tags
- Twitter Card meta tags
- Article meta tags (for blog posts)
- JSON-LD structured data
- Canonical URLs

### Page Template Component

**Location**: `src/lib/components/PageTemplate.svelte`

A standardized page wrapper that includes:

- SEO head management
- Consistent container styling
- Schema.org structured data

**Usage**:

```svelte
<script lang="ts">
	import PageTemplate from '$lib/components/PageTemplate.svelte';

	const seo = {
		title: 'Page Title',
		description: 'Page description for SEO',
		keywords: ['keyword1', 'keyword2'],
		ogType: 'website' as const
	};
</script>

<PageTemplate {seo} schemaType="WebPage">
	{#snippet children()}
		<h1>Your page content</h1>
	{/snippet}
</PageTemplate>
```

## 🌐 Open Graph Implementation

### Automatic Open Graph Tags

The SEO system automatically generates Open Graph tags:

- `og:title` - Page title
- `og:description` - Page description
- `og:type` - Content type (website, article, etc.)
- `og:url` - Canonical URL
- `og:site_name` - Site name
- `og:image` - Social sharing image
- `og:image:alt` - Image alt text

### Twitter Card Support

Automatic Twitter Card meta tags:

- `twitter:card` - Card type
- `twitter:site` - Site Twitter handle
- `twitter:creator` - Content creator handle
- `twitter:title` - Tweet title
- `twitter:description` - Tweet description
- `twitter:image` - Tweet image

## 📱 Responsive Design Guidelines

### Mobile-First Approach

Always design for mobile first, then enhance for larger screens:

```svelte
<!-- Mobile first, then tablet and desktop -->
<div class="text-sm md:text-base lg:text-lg">Content</div>
```

### Container Usage

Use consistent container classes:

```svelte
<!-- Standard page container -->
<div class="container mx-auto px-4 py-8">Content</div>

<!-- Max-width container -->
<div class="mx-auto max-w-4xl px-4">Content</div>
```

### Grid Systems

Use Tailwind's responsive grid:

```svelte
<!-- Responsive grid -->
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
	<div>Item 1</div>
	<div>Item 2</div>
	<div>Item 3</div>
</div>
```

## 🚀 Performance Best Practices

### Image Optimization

- Use appropriate image formats (WebP, AVIF)
- Implement responsive images with `srcset`
- Add proper `alt` attributes for accessibility

### Code Splitting

- Use dynamic imports for large components
- Implement route-based code splitting
- Lazy load non-critical components

### SEO Performance

- Generate static meta tags when possible
- Use structured data for rich snippets
- Implement proper canonical URLs
- Optimize page titles and descriptions

## 🔍 Development Workflow

### SEO Testing

1. Use the browser's developer tools to inspect meta tags
2. Test Open Graph tags with Facebook's Sharing Debugger
3. Validate Twitter Cards with Twitter's Card Validator
4. Check structured data with Google's Rich Results Test

### Responsive Testing

1. Use the breakpoint ruler in development mode
2. Test on actual devices when possible
3. Use browser developer tools' device simulation
4. Test touch interactions on mobile devices

### Accessibility

- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast ratios

## 📚 File Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── BreakpointRuler.svelte    # Development breakpoint tool
│   │   ├── SEOHead.svelte            # SEO meta tags component
│   │   └── PageTemplate.svelte       # Standard page wrapper
│   └── utils/
│       └── seo.ts                    # SEO utilities and types
├── routes/
│   ├── +layout.svelte               # Main layout with breakpoint ruler
│   ├── +page.svelte                 # Home page with SEO
│   ├── about/
│   │   └── +page.svelte             # About page with SEO
│   └── contact/
│       └── +page.svelte             # Contact page with SEO
└── app.css                          # Global styles with breakpoints
```

## 🎨 Customization

### Breakpoints

Modify breakpoints in `src/app.css`:

```css
@theme {
	--breakpoint-sm: 640px; /* Customize as needed */
	--breakpoint-md: 768px;
	/* ... */
}
```

### Default SEO

Update default SEO values in `src/lib/utils/seo.ts`:

```typescript
export const defaultSEO: SEOData = {
	title: 'Your Site Name',
	description: 'Your default description',
	author: 'Your Name'
	// ...
};
```

### Styling

Customize the breakpoint ruler appearance in `BreakpointRuler.svelte` styles section.

## 📋 Checklist for New Pages

- [ ] Import and use `PageTemplate` component
- [ ] Define page-specific SEO data
- [ ] Set appropriate `schemaType` (WebPage, Article, etc.)
- [ ] Include relevant keywords
- [ ] Write compelling meta description (under 160 characters)
- [ ] Set appropriate Open Graph type
- [ ] Test responsive design with breakpoint ruler
- [ ] Validate SEO implementation

This implementation provides a solid foundation for responsive, SEO-friendly web development with SvelteKit.
