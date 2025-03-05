import type { Actions } from './$types';
import { getAllTeeTimes } from '../db/client';
import type { PageServerLoad } from './$types';

export const actions = {
	change: async (event) => {
		// Update Tee Time from Database
	},
    delete: async (event) => {
        // Delete Tee Time from Database
    }
} satisfies Actions;



export const load: PageServerLoad = async ({ fetch }) => {
    
    // Call the DB library and fetch all tee times

	return {
		tees: await getAllTeeTimes()
	};
};
