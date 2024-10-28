<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { formatDate } from '$lib/utils';
	let type = '';
	let session: any = null;

	if ($page.data.beads.activeSession) {
		session = $page.data.beads.sessions[$page.data.beads.activeSession];
	}

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		const rosary = $page.data.types.value.find((t: any) => t.code === type);
		const res = await fetch('api/beads/createSession', {
			method: 'POST',
			body: JSON.stringify({
				userId: $page.data.user._id,
				date: formatDate(new Date()),
				rosary
			})
		});
		const data = await res.json();
		session = data.data.sessions[data.data.activeSession];
	}

	async function onClick(e: Event) {
		e.preventDefault();
		const rosary = $page.data.types.value.find((t: any) => t.code === type);
		console.log(rosary);
		const res = await fetch('api/beads/updateSession', {
			method: 'PATCH',
			body: JSON.stringify({
				userId: $page.data.user._id,
				date: formatDate(new Date()),
				at: session.at + 1,
				uuid: session.uuid
			})
		});
		const data = await res.json();
		session = data.data.sessions[data.data.activeSession];
	}
</script>

<!-- <p>{JSON.stringify($page.data)}</p> -->
<div class="hero min-h-screen bg-base-200">
	{#if session}
		<div class="flex flex-col items-center gap-10">
			<p class="text-6xl">{session.at}/{session.count}</p>
			<button class="btn btn-circle btn-neutral" on:click={onClick}> Bead </button>
		</div>
	{:else}
		<form on:submit={onSubmit} class="flex flex-col items-center gap-10">
			<select class="select select-bordered w-full max-w-xs" bind:value={type}>
				<option disabled selected>Choose Rosary</option>
				{#each $page.data.types.value as type}
					<option value={type.code}>{type.name}</option>
				{/each}
			</select>
			<button class="btn btn-primary w-full" type="submit">Choose</button>
		</form>
	{/if}
</div>
