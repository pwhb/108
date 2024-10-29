import { DB_KEYS } from '$lib/consts';
import clientPromise from '$lib/db';
import { formatDate, getLast7Days } from '$lib/utils';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const date = body.date || formatDate(new Date());
		const last7Days = getLast7Days(date);

		const client = await clientPromise;
		const col = client.db(DB_KEYS.DB_NAME).collection(DB_KEYS.ROSARY);
		let data = await col
			.find({
				userId: body.userId,
				date: { $in: last7Days }
			})
			.toArray();
		if (!data.length) {
			const dbRes = await col.insertOne({
				userId: body.userId,
				date: date
			});
			const created = await col.findOne({ _id: dbRes.insertedId });
			data.push(created!);
		}
		return json({ ok: true, data });
	} catch (error) {
		return json({ ok: false, error });
	}
};
