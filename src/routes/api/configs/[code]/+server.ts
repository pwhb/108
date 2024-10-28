import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DB_KEYS } from '$lib/consts';
import clientPromise from '$lib/db';

export const GET: RequestHandler = async ({ request, params }) => {
	try {
		const client = await clientPromise;
		const col = client.db(DB_KEYS.DB_NAME).collection(DB_KEYS.CONFIGS);
		const data = await col.findOne({ code: params.code });
		if (!data) {
			return json({ ok: false, error: 'Config not found' });
		}
		return json({ ok: true, data });
	} catch (error) {
		return json({ ok: false, error });
	}
};

export const PUT: RequestHandler = async ({ request, params }) => {
	try {
		const body = await request.json();
		const client = await clientPromise;
		const col = client.db(DB_KEYS.DB_NAME).collection(DB_KEYS.CONFIGS);

		const doesExist = await col.findOne({ code: params.code });
		if (!doesExist) {
			return json({ ok: false, error: 'Config does not exist' });
		}
		await col.updateOne(
			{ code: params.code },
			{
				$set: {
					code: body.code,
					value: body.value,
					updatedAt: new Date()
				}
			}
		);
		return json({ ok: true });
	} catch (error) {
		console.error(error);
		return json({ ok: false, error });
	}
};
