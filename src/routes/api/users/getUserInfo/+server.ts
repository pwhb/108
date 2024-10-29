import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import clientPromise from '$lib/db';
import { DB_KEYS } from '$lib/consts';
import { formatDate } from '$lib/utils';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const client = await clientPromise;
		const user = await client.db(DB_KEYS.DB_NAME).collection(DB_KEYS.USERS).findOne({
			username: body.username
		});
		if (!user) {
			return json({ ok: false, error: 'User not found' });
		}

		const col = client.db(DB_KEYS.DB_NAME).collection(DB_KEYS.ROSARY);
		let rosary = await col.findOne({
			userId: user._id.toString(),
			date: formatDate(new Date())
		});
		if (!rosary) {
			const dbRes = await col.insertOne({
				userId: user._id.toString(),
				date: formatDate(new Date())
			});
			rosary = await col.findOne({ _id: dbRes.insertedId });
		}
		return json({ ok: true, data: { user, rosary } });
	} catch (error) {
		return json({ ok: false, error });
	}
};
