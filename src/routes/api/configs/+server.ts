import { DB_KEYS } from '$lib/consts';
import clientPromise from '$lib/db';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
	try {
		const client = await clientPromise;
		const col = client.db(DB_KEYS.DB_NAME).collection(DB_KEYS.CONFIGS);
		const data = await col.find().toArray();

		return json({ ok: true, data });
	} catch (error) {
		return json({ ok: false, error });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const client = await clientPromise;
		const col = client.db(DB_KEYS.DB_NAME).collection(DB_KEYS.CONFIGS);

		const doesExist = await col.findOne({ code: body.code });
		if (doesExist) {
			return json({ ok: false, error: 'Config already exists' });
		}
		await col.insertOne({
			code: body.code,
			value: body.value,
			createdAt: new Date(),
			updatedAt: new Date()
		});
		return json({ ok: true });
	} catch (error) {
		return json({ ok: false, error });
	}
};
