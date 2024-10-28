import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import clientPromise from '$lib/db';
import { DB_KEYS } from '$lib/consts';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const client = await clientPromise;
		const user = await client.db(DB_KEYS.DB_NAME).collection(DB_KEYS.USERS).findOne({
			deviceId: body.deviceId
		});
		if (!user) {
			return json({ ok: false, error: 'User not found' });
		}
		return json({ ok: true, data: user });
	} catch (error) {
		return json({ ok: false, error });
	}
};
