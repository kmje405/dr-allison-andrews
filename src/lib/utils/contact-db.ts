import { db } from '$lib/db/connection.js';
import { contactSubmissions } from '$lib/db/schema.js';
import { desc, eq } from 'drizzle-orm';
import type { ContactSubmission } from '$lib/db/schema.js';

// Create a new contact submission
export async function createContactSubmission(submissionData: {
	name: string;
	email: string;
	subject?: string;
	message: string;
}): Promise<ContactSubmission> {
	try {
		const [newSubmission] = await db
			.insert(contactSubmissions)
			.values({
				name: submissionData.name,
				email: submissionData.email,
				subject: submissionData.subject || null,
				message: submissionData.message
			})
			.returning();

		return newSubmission;
	} catch (error) {
		console.error('Error creating contact submission:', error);
		throw error;
	}
}

// Get all active (non-archived) contact submissions (for admin)
export async function getAllContactSubmissions(): Promise<ContactSubmission[]> {
	try {
		const submissions = await db
			.select()
			.from(contactSubmissions)
			.where(eq(contactSubmissions.archived, false))
			.orderBy(desc(contactSubmissions.createdAt));

		return submissions;
	} catch (error) {
		console.error('Error fetching contact submissions:', error);
		return [];
	}
}

// Get all archived contact submissions (for admin)
export async function getArchivedContactSubmissions(): Promise<ContactSubmission[]> {
	try {
		const submissions = await db
			.select()
			.from(contactSubmissions)
			.where(eq(contactSubmissions.archived, true))
			.orderBy(desc(contactSubmissions.archivedAt));

		return submissions;
	} catch (error) {
		console.error('Error fetching archived contact submissions:', error);
		return [];
	}
}

// Archive a contact submission
export async function archiveContactSubmission(id: number): Promise<ContactSubmission | null> {
	try {
		const archivedSubmissions = await db
			.update(contactSubmissions)
			.set({
				archived: true,
				archivedAt: new Date()
			})
			.where(eq(contactSubmissions.id, id))
			.returning();

		return archivedSubmissions[0] || null;
	} catch (error) {
		console.error('Error archiving contact submission:', error);
		throw error;
	}
}

// Permanently delete a contact submission (only for archived ones)
export async function deleteContactSubmission(id: number): Promise<boolean> {
	try {
		const deletedSubmissions = await db
			.delete(contactSubmissions)
			.where(eq(contactSubmissions.id, id))
			.returning();

		return deletedSubmissions.length > 0;
	} catch (error) {
		console.error('Error deleting contact submission:', error);
		throw error;
	}
}

// Get a single contact submission by ID
export async function getContactSubmissionById(id: number): Promise<ContactSubmission | null> {
	try {
		const submissions = await db
			.select()
			.from(contactSubmissions)
			.where(eq(contactSubmissions.id, id))
			.limit(1);

		return submissions[0] || null;
	} catch (error) {
		console.error('Error fetching contact submission:', error);
		return null;
	}
}
