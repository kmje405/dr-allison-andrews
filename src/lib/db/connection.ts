import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';
import * as schema from './schema.js';

// Create connection pool
const pool = new Pool({ connectionString: env.DATABASE_URL });

// Create Drizzle instance
export const db = drizzle(pool, { schema });

// Helper function to test database connection
export async function testConnection() {
	try {
		const result = await pool.query('SELECT NOW()');
		console.log('Database connected successfully:', result.rows[0]);
		return true;
	} catch (error) {
		console.error('Database connection failed:', error);
		return false;
	}
}
