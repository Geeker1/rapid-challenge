import { json } from '@sveltejs/kit';
import { deleteTeeTime } from '../../../db/client';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({request}) => {
    try {
       const data = await request.json();
       await deleteTeeTime(data.id); 
    } catch (error) {
        return json({error: "An error occured deleting tee time!"}, {status: 400})
    }

    return json({message: "Tee Time successfully deleted!"})
};
