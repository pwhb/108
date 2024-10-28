import { DB_KEYS } from '$lib/consts';
import clientPromise from '$lib/db';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const { username, deviceId } = Object.fromEntries(form);

		const client = await clientPromise;
		const col = client.db(DB_KEYS.DB_NAME).collection(DB_KEYS.USERS);
		const doesExist = await col.countDocuments({
			username
		});
		if (doesExist) {
			return fail(400, { username: 'Username already exists' });
		}
		await col.insertOne({
			username,
			deviceId,
			createdAt: new Date(),
			updatedAt: new Date()
		});
		throw redirect(302, '/');
	}
};
