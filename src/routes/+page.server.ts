import type { Actions } from './$types';
import { getAllTeeTimes, updateTeeTime } from '../db/client';
import type { PageServerLoad } from './$types';

export const actions = {
	update: async (event) => {
		// Update Tee Time from Database
        const formData = await event.request.formData();
        const data = Object.fromEntries(formData.entries());
        await updateTeeTime(data.id.toString(), data)
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ fetch }) => {
    // Call the DB library and fetch all tee times

	return {
		tees: await getAllTeeTimes()
	};
};
