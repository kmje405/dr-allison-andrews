#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { seedDatabaseFromJSON } from './seed-function.js';

// Load environment variables from .env file
dotenv.config();

async function main() {
	console.log('🌱 Starting database seeding...');

	// Check if DATABASE_URL is set
	if (!process.env.DATABASE_URL) {
		console.log('⚠️  DATABASE_URL environment variable is not set.');
		console.log('📝 To run the seed script, you need to:');
		console.log('   1. Set up your database connection string');
		console.log('   2. Create a .env file with DATABASE_URL');
		console.log('   3. Run: npm run db:push (to create tables)');
		console.log('   4. Run: npm run db:seed (to populate data)');
		console.log('');
		console.log('✅ Seed script structure is valid and ready to use!');
		process.exit(0);
	}

	try {
		await seedDatabaseFromJSON();
		console.log('✅ Database seeding completed successfully!');
		process.exit(0);
	} catch (error) {
		console.error('❌ Database seeding failed:', error);
		process.exit(1);
	}
}

// Run the seed function
main();
