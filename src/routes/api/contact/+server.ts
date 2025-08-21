import { json } from '@sveltejs/kit';
import { createContactSubmission } from '$lib/utils/contact-db.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();

		// Extract form fields
		const name = formData.get('name')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const subject = formData.get('subject')?.toString() || '';
		const message = formData.get('message')?.toString() || '';
		const botField = formData.get('bot-field')?.toString() || '';

		// Basic spam protection - if bot field is filled, reject
		if (botField) {
			return json({ success: false, message: 'Spam detected' }, { status: 400 });
		}

		// Basic validation
		if (!name || !email || !message) {
			return json({ success: false, message: 'Missing required fields' }, { status: 400 });
		}

		// Save to database
		const submission = await createContactSubmission({
			name,
			email,
			subject: subject || undefined,
			message
		});

		console.log('Contact form submission saved:', submission.id);

		// Return success response
		return json({
			success: true,
			message: 'Thank you for your message! We will get back to you soon.'
		});
	} catch (error) {
		console.error('Contact form error:', error);
		return json({ success: false, message: 'Failed to process form submission' }, { status: 500 });
	}
};
