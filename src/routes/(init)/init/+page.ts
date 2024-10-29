import { redirect } from '@sveltejs/kit';
import type { PageData, PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
	const username = localStorage.getItem('username');
	const userRes = await fetch('api/users/getUserInfo', {
		method: 'POST',
		body: JSON.stringify({ username })
	});

	const userData = await userRes.json();
	if (userData.ok) {
		throw redirect(302, '/');
	}

	return {};
};
