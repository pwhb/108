<script lang="ts">
	import { page } from '$app/stores';
	import '../../../app.css';
	let username = '';

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();

		const res = await fetch('api/users/upsertUser', {
			method: 'POST',
			body: JSON.stringify({
				username: username
			})
		});
		const data = await res.json();
		console.log(data);

		if (data.ok) {
			localStorage.setItem('username', username);
			window.location.href = '/';
		}
	}
</script>

<div class="hero min-h-screen bg-base-200">
	<form on:submit={onSubmit}>
		<label class="input input-bordered flex items-center gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				fill="currentColor"
				class="h-4 w-4 opacity-70"
			>
				<path
					d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
				/>
			</svg>
			<input
				type="text"
				class="grow"
				placeholder="Username"
				name="username"
				bind:value={username}
			/>
		</label>
		<!-- <input type="hidden" name="deviceId" value={$page.data.deviceId} /> -->
		<button class="btn btn-primary mt-6 w-full" type="submit">Submit</button>
	</form>
</div>
