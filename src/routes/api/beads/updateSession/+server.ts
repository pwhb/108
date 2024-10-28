import { DB_KEYS } from '$lib/consts';
import clientPromise from '$lib/db';
import { json, type RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();

		const client = await clientPromise;
		const col = client.db(DB_KEYS.DB_NAME).collection(DB_KEYS.BEADS);

		const data = await col.findOneAndUpdate(
			{
				userId: body.userId,
				date: body.date
			},
			{
				$set: {
					[`sessions.${body.uuid}.at`]: body.at,
					[`sessions.${body.uuid}.updatedAt`]: new Date()
				}
			},
			{
				returnDocument: 'after'
			}
		);

		return json({ ok: true, data });
	} catch (error) {
		return json({ ok: false, error });
	}
};
