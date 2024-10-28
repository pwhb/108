import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import clientPromise from '$lib/db';
import { DB_KEYS } from '$lib/consts';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const client = await clientPromise;
		const col = client.db(DB_KEYS.DB_NAME).collection(DB_KEYS.USERS);
		let user = await col.findOne({
			username: body.username
		});
		if (!user) {
			const dbRes = await col.insertOne({
				username: body.username
			});
			user = await col.findOne({ _id: dbRes.insertedId });
		}
		return json({ ok: true, data: user });
	} catch (error) {
		return json({ ok: false, error });
	}
};
