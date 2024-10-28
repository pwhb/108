import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { formatDate, getBeadMap } from '$lib/utils';

export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
	const username = localStorage.getItem('username');
	if (!username) {
		throw redirect(302, '/init');
	}
	const userRes = await fetch('api/users/getUserInfo', {
		method: 'POST',
		body: JSON.stringify({ username })
	});

	const userData = await userRes.json();
	if (!userData.ok) {
		throw redirect(302, '/init');
	}

	const beadRes = await fetch(
		`api/beads?userId=${userData.data._id}&date=${formatDate(new Date())}`
	);
	const beadData = await beadRes.json();

	const typesRes = await fetch('api/configs/ROSARY_TYPES');
	const typesData = await typesRes.json();

	return {
		user: userData.data,
		beads: beadData.data,
		types: typesData.data
	};
};
