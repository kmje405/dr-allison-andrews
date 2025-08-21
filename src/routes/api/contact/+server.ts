import { json } from '@sveltejs/kit';
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

		// In development, just log the form submission
		console.log('Contact form submission:', {
			name,
			email,
			subject,
			message,
			timestamp: new Date().toISOString()
		});

		// Return success response
		return json({
			success: true,
			message:
				'Thank you for your message! This is a development environment, so the message was logged to the console.'
		});
	} catch (error) {
		console.error('Contact form error:', error);
		return json({ success: false, message: 'Failed to process form submission' }, { status: 500 });
	}
};
