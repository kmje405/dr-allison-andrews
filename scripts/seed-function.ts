import { db } from './db-connection.js';
import { blogPosts, blogTags, blogPostTags } from '../src/lib/db/schema.js';
import { eq, and } from 'drizzle-orm';

// Standalone seed function that reads directly from JSON
export async function seedDatabaseFromJSON() {
	try {
		// Import JSON data directly
		const blogData = await import('../src/lib/data/blog-posts.json');
		const jsonPosts = blogData.default.posts;

		console.log('Starting database seeding...');
		console.log(`Found ${jsonPosts.length} posts in JSON file`);

		for (const post of jsonPosts) {
			// Check if post already exists
			const existingPost = await db
				.select()
				.from(blogPosts)
				.where(eq(blogPosts.slug, post.slug))
				.limit(1);

			if (existingPost.length === 0) {
				// Insert new post
				const [insertedPost] = await db
					.insert(blogPosts)
					.values({
						slug: post.slug,
						title: post.title,
						excerpt: post.excerpt,
						content: post.content,
						author: post.author,
						readTime: post.readTime,
						published: post.published,
						featured: post.featured
					})
					.returning();

				console.log(`Seeded post: ${post.title}`);

				// Handle tags if they exist
				if (post.tags && post.tags.length > 0) {
					for (const tagName of post.tags) {
						// Check if tag already exists
						const existingTag = await db
							.select()
							.from(blogTags)
							.where(eq(blogTags.name, tagName))
							.limit(1);

						let tagId: number;

						if (existingTag.length === 0) {
							// Create new tag
							const [newTag] = await db
								.insert(blogTags)
								.values({
									name: tagName
								})
								.returning();
							tagId = newTag.id;
							console.log(`  Created tag: ${tagName}`);
						} else {
							tagId = existingTag[0].id;
						}

						// Create post-tag relationship
						const existingRelation = await db
							.select()
							.from(blogPostTags)
							.where(and(eq(blogPostTags.postId, insertedPost.id), eq(blogPostTags.tagId, tagId)))
							.limit(1);

						if (existingRelation.length === 0) {
							await db.insert(blogPostTags).values({
								postId: insertedPost.id,
								tagId: tagId
							});
							console.log(`  Linked tag "${tagName}" to post "${post.title}"`);
						}
					}
				}
			} else {
				console.log(`Post already exists: ${post.title}`);
			}
		}

		console.log('Database seeding completed successfully!');
	} catch (error) {
		console.error('Error seeding database:', error);
		throw error;
	}
}
