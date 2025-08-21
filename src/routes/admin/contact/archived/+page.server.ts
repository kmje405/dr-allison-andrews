import { getArchivedContactSubmissions } from '$lib/utils/contact-db.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Get all archived contact submissions
		const archivedSubmissions = await getArchivedContactSubmissions();

		return {
			archivedSubmissions
		};
	} catch (error) {
		console.error('Error loading archived contact submissions:', error);
		return {
			archivedSubmissions: []
		};
	}
};
