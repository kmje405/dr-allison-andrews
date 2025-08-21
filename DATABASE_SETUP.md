# Database Setup Guide

## 1. Create Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string from the dashboard

## 2. Local Development Setup

1. Copy the environment file:

   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Neon connection string:
   ```
   DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
   ```

## 3. Generate and Run Migrations

1. Generate migration files:

   ```bash
   npm run db:generate
   ```

2. Push schema to database:
   ```bash
   npm run db:push
   ```

## 4. Netlify Environment Variables

In your Netlify dashboard, add the environment variable:

- Key: `DATABASE_URL`
- Value: Your Neon connection string

## 5. Seed Database (Optional)

Run the seed script to populate with initial blog posts:

```bash
npm run db:seed
```

## Database Schema

The database includes these tables:

- `blog_posts` - Blog post content and metadata
- `blog_tags` - Tag definitions
- `blog_post_tags` - Many-to-many relationship between posts and tags
- `contact_submissions` - Contact form submissions
- `newsletter_subscriptions` - Email subscriptions

## Troubleshooting

- Ensure your Neon database allows connections from your IP
- Check that the connection string includes `?sslmode=require`
- Verify environment variables are set correctly in both local and production environments
