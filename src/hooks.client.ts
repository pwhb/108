export async function handleError({ error, event, status, message }) {
	const errorId = crypto.randomUUID();

	return {
		message: 'Whoops!'
	};
}
