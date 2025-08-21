import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import WebSocket from 'ws';
import * as schema from '../src/lib/db/schema.js';

// Configure WebSocket for Node.js environment
neonConfig.webSocketConstructor = WebSocket;

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: Pool | null = null;

// Lazy initialization of database connection
export function getDb() {
	if (!_db) {
		if (!process.env.DATABASE_URL) {
			throw new Error('DATABASE_URL environment variable is not set');
		}

		console.log('Initializing database connection...');
		_pool = new Pool({ connectionString: process.env.DATABASE_URL });
		_db = drizzle(_pool, { schema });
	}
	return _db;
}

// Export db as a getter
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
	get(target, prop) {
		return getDb()[prop as keyof ReturnType<typeof drizzle>];
	}
});

// Helper function to test database connection
export async function testConnection() {
	try {
		if (!_pool) {
			getDb(); // Initialize if not already done
		}
		const result = await _pool!.query('SELECT NOW()');
		console.log('Database connected successfully:', result.rows[0]);
		return true;
	} catch (error) {
		console.error('Database connection failed:', error);
		return false;
	}
}
