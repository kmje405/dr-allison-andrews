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

// Get posts with their tags
export async function getPostsWithTags(): Promise<(BlogPost & { tags: string[] })[]> {
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
				updatedAt: blogPosts.updatedAt,
				tagName: blogTags.name
			})
			.from(blogPosts)
			.leftJoin(blogPostTags, eq(blogPosts.id, blogPostTags.postId))
			.leftJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
			.where(eq(blogPosts.published, true))
			.orderBy(desc(blogPosts.createdAt));

		// Group posts and their tags
		const postsMap = new Map<number, BlogPost & { tags: string[] }>();

		for (const row of posts) {
			if (!postsMap.has(row.id)) {
				postsMap.set(row.id, {
					id: row.id,
					slug: row.slug,
					title: row.title,
					excerpt: row.excerpt,
					content: row.content,
					author: row.author,
					readTime: row.readTime,
					published: row.published,
					featured: row.featured,
					createdAt: row.createdAt,
					updatedAt: row.updatedAt,
					tags: []
				});
			}

			const post = postsMap.get(row.id)!;
			if (row.tagName && !post.tags.includes(row.tagName)) {
				post.tags.push(row.tagName);
			}
		}

		return Array.from(postsMap.values());
	} catch (error) {
		console.error('Error fetching posts with tags from database:', error);
		return [];
	}
}

// Get all posts with tags for admin (includes unpublished posts)
export async function getAllPostsWithTagsForAdmin(): Promise<(BlogPost & { tags: string[] })[]> {
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
				updatedAt: blogPosts.updatedAt,
				tagName: blogTags.name
			})
			.from(blogPosts)
			.leftJoin(blogPostTags, eq(blogPosts.id, blogPostTags.postId))
			.leftJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
			.orderBy(desc(blogPosts.createdAt));

		// Group posts and their tags
		const postsMap = new Map<number, BlogPost & { tags: string[] }>();

		for (const row of posts) {
			if (!postsMap.has(row.id)) {
				postsMap.set(row.id, {
					id: row.id,
					slug: row.slug,
					title: row.title,
					excerpt: row.excerpt,
					content: row.content,
					author: row.author,
					readTime: row.readTime,
					published: row.published,
					featured: row.featured,
					createdAt: row.createdAt,
					updatedAt: row.updatedAt,
					tags: []
				});
			}

			const post = postsMap.get(row.id)!;
			if (row.tagName && !post.tags.includes(row.tagName)) {
				post.tags.push(row.tagName);
			}
		}

		return Array.from(postsMap.values());
	} catch (error) {
		console.error('Error fetching all posts with tags for admin:', error);
		return [];
	}
}

// Get single post with tags by slug
export async function getPostWithTagsBySlug(
	slug: string
): Promise<(BlogPost & { tags: string[] }) | null> {
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
				updatedAt: blogPosts.updatedAt,
				tagName: blogTags.name
			})
			.from(blogPosts)
			.leftJoin(blogPostTags, eq(blogPosts.id, blogPostTags.postId))
			.leftJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
			.where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)));

		if (posts.length === 0) {
			return null;
		}

		const post = {
			id: posts[0].id,
			slug: posts[0].slug,
			title: posts[0].title,
			excerpt: posts[0].excerpt,
			content: posts[0].content,
			author: posts[0].author,
			readTime: posts[0].readTime,
			published: posts[0].published,
			featured: posts[0].featured,
			createdAt: posts[0].createdAt,
			updatedAt: posts[0].updatedAt,
			tags: posts.filter((p) => p.tagName).map((p) => p.tagName!)
		};

		return post;
	} catch (error) {
		console.error('Error fetching post with tags from database:', error);
		return null;
	}
}

// Get a single post by ID with its tags (for admin use)
export async function getPostById(id: number): Promise<(BlogPost & { tags: string[] }) | null> {
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
				updatedAt: blogPosts.updatedAt,
				tagName: blogTags.name
			})
			.from(blogPosts)
			.leftJoin(blogPostTags, eq(blogPosts.id, blogPostTags.postId))
			.leftJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
			.where(eq(blogPosts.id, id));

		if (posts.length === 0) {
			return null;
		}

		const post = {
			id: posts[0].id,
			slug: posts[0].slug,
			title: posts[0].title,
			excerpt: posts[0].excerpt,
			content: posts[0].content,
			author: posts[0].author,
			readTime: posts[0].readTime,
			published: posts[0].published,
			featured: posts[0].featured,
			createdAt: posts[0].createdAt,
			updatedAt: posts[0].updatedAt,
			tags: posts.filter((p) => p.tagName).map((p) => p.tagName!)
		};

		return post;
	} catch (error) {
		console.error('Error fetching post by ID from database:', error);
		return null;
	}
}

// Admin CRUD operations
export async function createBlogPost(postData: {
	slug: string;
	title: string;
	excerpt: string;
	content: string;
	author: string;
	readTime: string;
	published: boolean;
	featured: boolean;
	tags: string[];
}) {
	try {
		// Insert new post
		const [insertedPost] = await db
			.insert(blogPosts)
			.values({
				slug: postData.slug,
				title: postData.title,
				excerpt: postData.excerpt,
				content: postData.content,
				author: postData.author,
				readTime: postData.readTime,
				published: postData.published,
				featured: postData.featured
			})
			.returning();

		// Handle tags
		for (const tagName of postData.tags) {
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
			} else {
				tagId = existingTag[0].id;
			}

			// Create post-tag relationship
			await db.insert(blogPostTags).values({
				postId: insertedPost.id,
				tagId: tagId
			});
		}

		return insertedPost;
	} catch (error) {
		console.error('Error creating blog post:', error);
		throw error;
	}
}

export async function updateBlogPost(
	id: number,
	postData: {
		slug?: string;
		title?: string;
		excerpt?: string;
		content?: string;
		author?: string;
		readTime?: string;
		published?: boolean;
		featured?: boolean;
		tags?: string[];
	}
) {
	try {
		// Update post
		const updatedPosts = await db
			.update(blogPosts)
			.set({
				...postData,
				updatedAt: new Date()
			})
			.where(eq(blogPosts.id, id))
			.returning();

		if (updatedPosts.length === 0) {
			return null; // Post not found
		}

		const updatedPost = updatedPosts[0];

		// Handle tags if provided
		if (postData.tags) {
			// Remove existing post-tag relationships
			await db.delete(blogPostTags).where(eq(blogPostTags.postId, id));

			// Add new tags
			for (const tagName of postData.tags) {
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
				} else {
					tagId = existingTag[0].id;
				}

				// Create post-tag relationship
				await db.insert(blogPostTags).values({
					postId: id,
					tagId: tagId
				});
			}
		}

		return updatedPost;
	} catch (error) {
		console.error('Error updating blog post:', error);
		throw error;
	}
}

export async function deleteBlogPost(id: number) {
	try {
		// Delete post (cascade will handle post-tag relationships)
		const deletedPosts = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();

		// Return true if a post was deleted, false if no post was found
		return deletedPosts.length > 0;
	} catch (error) {
		console.error('Error deleting blog post:', error);
		throw error;
	}
}

export async function togglePostPublished(id: number) {
	try {
		// Get current status
		const currentPosts = await db
			.select({ published: blogPosts.published })
			.from(blogPosts)
			.where(eq(blogPosts.id, id))
			.limit(1);

		if (currentPosts.length === 0) {
			return null; // Post not found
		}

		const currentPost = currentPosts[0];

		// Toggle published status
		const updatedPosts = await db
			.update(blogPosts)
			.set({
				published: !currentPost.published,
				updatedAt: new Date()
			})
			.where(eq(blogPosts.id, id))
			.returning();

		return updatedPosts[0] || null;
	} catch (error) {
		console.error('Error toggling post published status:', error);
		throw error;
	}
}

export async function togglePostFeatured(id: number) {
	try {
		// Get current status
		const currentPosts = await db
			.select({ featured: blogPosts.featured })
			.from(blogPosts)
			.where(eq(blogPosts.id, id))
			.limit(1);

		if (currentPosts.length === 0) {
			return null; // Post not found
		}

		const currentPost = currentPosts[0];

		// Toggle featured status
		const updatedPosts = await db
			.update(blogPosts)
			.set({
				featured: !currentPost.featured,
				updatedAt: new Date()
			})
			.where(eq(blogPosts.id, id))
			.returning();

		return updatedPosts[0] || null;
	} catch (error) {
		console.error('Error toggling post featured status:', error);
		throw error;
	}
}

// Migration utility to seed database with JSON data
export async function seedDatabaseFromJSON() {
	try {
		// Import JSON data directly from the JSON file
		const blogData = await import('$lib/data/blog-posts.json');
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
