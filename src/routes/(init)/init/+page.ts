import { redirect } from '@sveltejs/kit';
import type { PageData } from './$types';

export const ssr = false;

export const load: PageData = async ({}) => {
	let deviceId = localStorage.getItem('deviceId');
	if (!deviceId) {
		deviceId = crypto.randomUUID();
		localStorage.setItem('deviceId', deviceId);
	}

	const userRes = await fetch('api/users/getUserInfo', {
		method: 'POST',
		body: JSON.stringify({ deviceId })
	});
	console.log(userRes);

	const userData = await userRes.json();
	if (userData.ok) {
		throw redirect(302, '/');
	}

	return {
		deviceId
	};
};
