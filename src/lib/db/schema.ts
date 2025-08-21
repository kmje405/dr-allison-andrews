import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

// Blog posts table
export const blogPosts = pgTable('blog_posts', {
	id: serial('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	excerpt: text('excerpt').notNull(),
	content: text('content').notNull(),
	author: text('author').notNull().default('Dr. Allison Andrews'),
	readTime: text('read_time').notNull(),
	published: boolean('published').notNull().default(false),
	featured: boolean('featured').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Blog post tags table
export const blogTags = pgTable('blog_tags', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Blog post to tags junction table
export const blogPostTags = pgTable('blog_post_tags', {
	id: serial('id').primaryKey(),
	postId: integer('post_id')
		.notNull()
		.references(() => blogPosts.id, { onDelete: 'cascade' }),
	tagId: integer('tag_id')
		.notNull()
		.references(() => blogTags.id, { onDelete: 'cascade' })
});

// Contact form submissions table
export const contactSubmissions = pgTable('contact_submissions', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	subject: text('subject'),
	message: text('message').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Newsletter subscriptions table
export const newsletterSubscriptions = pgTable('newsletter_subscriptions', {
	id: serial('id').primaryKey(),
	email: text('email').notNull().unique(),
	isActive: boolean('is_active').notNull().default(true),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Users table for authentication
export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	name: text('name').notNull(),
	role: text('role').notNull().default('user'), // 'admin', 'editor', 'user'
	isActive: boolean('is_active').notNull().default(true),
	emailVerified: boolean('email_verified').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// User sessions table for JWT token management
export const userSessions = pgTable('user_sessions', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	token: text('token').notNull().unique(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Site settings table for registration control
export const siteSettings = pgTable('site_settings', {
	id: serial('id').primaryKey(),
	key: text('key').notNull().unique(),
	value: text('value').notNull(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Types for TypeScript
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type BlogTag = typeof blogTags.$inferSelect;
export type NewBlogTag = typeof blogTags.$inferInsert;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type NewNewsletterSubscription = typeof newsletterSubscriptions.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;
