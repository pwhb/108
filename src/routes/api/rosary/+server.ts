import { DB_KEYS } from '$lib/consts';
import clientPromise from '$lib/db';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
	try {
		const url = new URL(request.url);
		const query = Object.fromEntries(url.searchParams);
		const client = await clientPromise;
		const col = client.db(DB_KEYS.DB_NAME).collection(DB_KEYS.ROSARY);
		const data = await col.findOne({
			userId: query.userId,
			date: query.date
		});

		return json({ ok: true, data });
	} catch (error) {
		return json({ ok: false, error });
	}
};
