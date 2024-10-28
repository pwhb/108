import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { formatDate, getBeadMap } from '$lib/utils';

export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
	let deviceId = localStorage.getItem('deviceId');
	if (!deviceId) {
		deviceId = crypto.randomUUID();
		localStorage.setItem('deviceId', deviceId);
	}

	const userRes = await fetch('api/users/getUserInfo', {
		method: 'POST',
		body: JSON.stringify({ deviceId })
	});
	const userData = await userRes.json();
	if (!userData.ok) {
		throw redirect(302, '/init');
	}

	// const beadRes = await fetch('api/beads/getBeadsData', {
	//     method: 'POST',
	//     body: JSON.stringify({ userId: userData.data._id })
	// });

	// const beadData = await beadRes.json();

	const beadRes = await fetch(
		`api/beads?userId=${userData.data._id}&date=${formatDate(new Date())}`
	);
	const beadData = await beadRes.json();

	const typesRes = await fetch('api/configs/ROSARY_TYPES');
	const typesData = await typesRes.json();

	return {
		deviceId,
		user: userData.data,
		beads: beadData.data,
		types: typesData.data
	};
};
