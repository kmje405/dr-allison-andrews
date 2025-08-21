import { db } from '$lib/db/connection.js';
import { blogPosts, blogTags, blogPostTags } from '$lib/db/schema.js';
import { eq, desc, and } from 'drizzle-orm';
import type { BlogPost } from '$lib/db/schema.js';

// Database-powered blog utilities
export async function getAllPostsFromDB(): Promise<BlogPost[]> {
	try {
		const posts = await db
			.select()
			.from(blogPosts)
			.where(eq(blogPosts.published, true))
			.orderBy(desc(blogPosts.createdAt));

		return posts;
	} catch (error) {
		console.error('Error fetching posts from database:', error);
		return [];
	}
}

export async function getPostBySlugFromDB(slug: string): Promise<BlogPost | null> {
	try {
		const posts = await db
			.select()
			.from(blogPosts)
			.where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)))
			.limit(1);

		return posts[0] || null;
	} catch (error) {
		console.error('Error fetching post from database:', error);
		return null;
	}
}

export async function getFeaturedPostsFromDB(): Promise<BlogPost[]> {
	try {
		const posts = await db
			.select()
			.from(blogPosts)
			.where(and(eq(blogPosts.published, true), eq(blogPosts.featured, true)))
			.orderBy(desc(blogPosts.createdAt))
			.limit(3);

		return posts;
	} catch (error) {
		console.error('Error fetching featured posts from database:', error);
		return [];
	}
}

export async function getPostsByTagFromDB(tagName: string): Promise<BlogPost[]> {
	try {
		const posts = await db
			.select({
				id: blogPosts.id,
				slug: blogPosts.slug,
				title: blogPosts.title,
				excerpt: blogPosts.excerpt,
				content: blogPosts.content,
				author: blogPosts.author,
				readTime: blogPosts.readTime,
				published: blogPosts.published,
				featured: blogPosts.featured,
				createdAt: blogPosts.createdAt,
				updatedAt: blogPosts.updatedAt
			})
			.from(blogPosts)
			.innerJoin(blogPostTags, eq(blogPosts.id, blogPostTags.postId))
			.innerJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
			.where(and(eq(blogPosts.published, true), eq(blogTags.name, tagName)))
			.orderBy(desc(blogPosts.createdAt));

		return posts;
	} catch (error) {
		console.error('Error fetching posts by tag from database:', error);
		return [];
	}
}

// Migration utility to seed database with JSON data
export async function seedDatabaseFromJSON() {
	try {
		// Import JSON data
		const { getAllPosts } = await import('./blog.js');
		const jsonPosts = getAllPosts();

		for (const post of jsonPosts) {
			// Check if post already exists
			const existingPost = await db
				.select()
				.from(blogPosts)
				.where(eq(blogPosts.slug, post.slug))
				.limit(1);

			if (existingPost.length === 0) {
				// Insert new post
				await db.insert(blogPosts).values({
					slug: post.slug,
					title: post.title,
					excerpt: post.excerpt,
					content: post.content,
					author: post.author,
					readTime: post.readTime,
					published: post.published,
					featured: post.featured
				});

				console.log(`Seeded post: ${post.title}`);
			}
		}

		console.log('Database seeding completed');
	} catch (error) {
		console.error('Error seeding database:', error);
	}
}
