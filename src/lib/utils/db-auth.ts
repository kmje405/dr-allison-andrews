import { db } from '$lib/db/connection';
import { users, userSessions, siteSettings } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

// Types
export interface AuthUser {
	id: number;
	email: string;
	name: string;
	role: string;
	isActive: boolean;
	emailVerified: boolean;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterData {
	email: string;
	password: string;
	name: string;
}

// Auth utilities
export class DatabaseAuth {
	private static get JWT_SECRET(): string {
		return env.JWT_SECRET || 'fallback-secret-key';
	}
	private static TOKEN_EXPIRY = '7d'; // 7 days

	// Hash password
	static async hashPassword(password: string): Promise<string> {
		const saltRounds = 12;
		return bcrypt.hash(password, saltRounds);
	}

	// Verify password
	static async verifyPassword(password: string, hash: string): Promise<boolean> {
		return bcrypt.compare(password, hash);
	}

	// Generate JWT token
	static generateToken(userId: number): string {
		const secret = this.JWT_SECRET;
		if (!secret) throw new Error('JWT_SECRET is not configured');
		// @ts-expect-error - TypeScript issue with JWT types
		return jwt.sign({ userId }, secret, { expiresIn: this.TOKEN_EXPIRY });
	}

	// Verify JWT token
	static verifyToken(token: string): { userId: number } | null {
		try {
			const secret = this.JWT_SECRET;
			if (!secret) return null;
			const decoded = jwt.verify(token, secret) as JwtPayload & { userId: number };
			return { userId: decoded.userId };
		} catch {
			return null;
		}
	}

	// Register new user
	static async register(
		data: RegisterData
	): Promise<{ success: boolean; message: string; user?: AuthUser }> {
		try {
			// Check if registration is allowed
			const registrationSetting = await db
				.select()
				.from(siteSettings)
				.where(eq(siteSettings.key, 'allow_registration'))
				.limit(1);

			const allowRegistration = registrationSetting[0]?.value === 'true';
			if (!allowRegistration) {
				return { success: false, message: 'Registration is currently disabled' };
			}

			// Check if user already exists
			const existingUser = await db
				.select()
				.from(users)
				.where(eq(users.email, data.email))
				.limit(1);

			if (existingUser.length > 0) {
				return { success: false, message: 'User with this email already exists' };
			}

			// Hash password
			const passwordHash = await this.hashPassword(data.password);

			// Create user
			const [newUser] = await db
				.insert(users)
				.values({
					email: data.email,
					passwordHash,
					name: data.name,
					role: 'user', // Default role
					isActive: true,
					emailVerified: false
				})
				.returning();

			const authUser: AuthUser = {
				id: newUser.id,
				email: newUser.email,
				name: newUser.name,
				role: newUser.role,
				isActive: newUser.isActive,
				emailVerified: newUser.emailVerified
			};

			return { success: true, message: 'User registered successfully', user: authUser };
		} catch (error) {
			console.error('Registration error:', error);
			return { success: false, message: 'Registration failed' };
		}
	}

	// Login user
	static async login(
		credentials: LoginCredentials
	): Promise<{ success: boolean; message: string; token?: string; user?: AuthUser }> {
		try {
			// Find user by email
			const [user] = await db
				.select()
				.from(users)
				.where(and(eq(users.email, credentials.email), eq(users.isActive, true)))
				.limit(1);

			if (!user) {
				return { success: false, message: 'Invalid email or password' };
			}

			// Verify password
			const isValidPassword = await this.verifyPassword(credentials.password, user.passwordHash);
			if (!isValidPassword) {
				return { success: false, message: 'Invalid email or password' };
			}

			// Generate token
			const token = this.generateToken(user.id);

			// Store session in database
			const expiresAt = new Date();
			expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

			await db.insert(userSessions).values({
				userId: user.id,
				token,
				expiresAt
			});

			const authUser: AuthUser = {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
				isActive: user.isActive,
				emailVerified: user.emailVerified
			};

			return { success: true, message: 'Login successful', token, user: authUser };
		} catch (error) {
			console.error('Login error:', error);
			return { success: false, message: 'Login failed' };
		}
	}

	// Verify session token
	static async verifySession(token: string): Promise<AuthUser | null> {
		try {
			// Verify JWT
			const decoded = this.verifyToken(token);
			if (!decoded) return null;

			// Check session in database
			const [session] = await db
				.select({
					userId: userSessions.userId,
					expiresAt: userSessions.expiresAt,
					user: {
						id: users.id,
						email: users.email,
						name: users.name,
						role: users.role,
						isActive: users.isActive,
						emailVerified: users.emailVerified
					}
				})
				.from(userSessions)
				.innerJoin(users, eq(userSessions.userId, users.id))
				.where(and(eq(userSessions.token, token), eq(users.isActive, true)))
				.limit(1);

			if (!session || session.expiresAt < new Date()) {
				// Clean up expired session
				if (session) {
					await db.delete(userSessions).where(eq(userSessions.token, token));
				}
				return null;
			}

			return {
				id: session.user.id,
				email: session.user.email,
				name: session.user.name,
				role: session.user.role,
				isActive: session.user.isActive,
				emailVerified: session.user.emailVerified
			};
		} catch (error) {
			console.error('Session verification error:', error);
			return null;
		}
	}

	// Logout user
	static async logout(token: string): Promise<void> {
		try {
			await db.delete(userSessions).where(eq(userSessions.token, token));
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	// Get or set registration setting
	static async getRegistrationSetting(): Promise<boolean> {
		try {
			const [setting] = await db
				.select()
				.from(siteSettings)
				.where(eq(siteSettings.key, 'allow_registration'))
				.limit(1);

			return setting?.value === 'true';
		} catch (error) {
			console.error('Error getting registration setting:', error);
			return false;
		}
	}

	static async setRegistrationSetting(allow: boolean): Promise<void> {
		try {
			await db
				.insert(siteSettings)
				.values({
					key: 'allow_registration',
					value: allow.toString()
				})
				.onConflictDoUpdate({
					target: siteSettings.key,
					set: {
						value: allow.toString(),
						updatedAt: new Date()
					}
				});
		} catch (error) {
			console.error('Error setting registration setting:', error);
		}
	}

	// Create admin user (for initial setup)
	static async createAdminUser(
		data: RegisterData
	): Promise<{ success: boolean; message: string; user?: AuthUser }> {
		try {
			// Check if admin already exists
			const existingAdmin = await db.select().from(users).where(eq(users.role, 'admin')).limit(1);

			if (existingAdmin.length > 0) {
				return { success: false, message: 'Admin user already exists' };
			}

			// Hash password
			const passwordHash = await this.hashPassword(data.password);

			// Create admin user
			const [newUser] = await db
				.insert(users)
				.values({
					email: data.email,
					passwordHash,
					name: data.name,
					role: 'admin',
					isActive: true,
					emailVerified: true // Admin is pre-verified
				})
				.returning();

			const authUser: AuthUser = {
				id: newUser.id,
				email: newUser.email,
				name: newUser.name,
				role: newUser.role,
				isActive: newUser.isActive,
				emailVerified: newUser.emailVerified
			};

			return { success: true, message: 'Admin user created successfully', user: authUser };
		} catch (error) {
			console.error('Admin creation error:', error);
			return { success: false, message: 'Failed to create admin user' };
		}
	}
}
