import { DB_KEYS } from '$lib/consts';
import clientPromise from '$lib/db';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();

		const client = await clientPromise;
		const col = client.db(DB_KEYS.DB_NAME).collection(DB_KEYS.BEADS);
		const uuid = crypto.randomUUID();
		const data = await col.findOneAndUpdate(
			{
				userId: body.userId,
				date: body.date
			},
			{
				$set: {
					activeSession: uuid,
					sessions: {
						[uuid]: {
							uuid: uuid,
							name: body.rosary.name,
							code: body.rosary.code,
							count: body.rosary.count,
							at: 0,
							createdAt: new Date(),
							updatedAt: new Date()
						}
					}
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
