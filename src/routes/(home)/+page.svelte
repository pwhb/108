<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { formatDate } from '$lib/utils';
	let type = '';
	let session: any = null;
	let isGreen = false;
	let isLoading = false;

	if ($page.data.rosary.activeSession) {
		session = $page.data.rosary.sessions[$page.data.rosary.activeSession];
	}

	$: {
		if (session && session.at === session.count) {
			isGreen = true;
		}
	}

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		const rosary = $page.data.types.value.find((t: any) => t.code === type);
		const res = await fetch('api/rosary/createSession', {
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
		isLoading = true;
		if (session.at < session.count) {
			const res = await fetch('api/rosary/updateSession', {
				method: 'PATCH',
				body: JSON.stringify({
					userId: $page.data.user._id,
					date: formatDate(new Date()),
					diff: 1,
					uuid: session.uuid
				})
			});
			const data = await res.json();
			session = data.data.sessions[data.data.activeSession];
		}
		isLoading = false;
	}
</script>

<!-- <p>{JSON.stringify($page.data)}</p> -->
<div class="hero min-h-screen bg-base-200">
	{#if session}
		<div class="flex flex-col items-center gap-10">
			{#if isGreen}
				<div
					class="radial-progress-primary radial-progress text-green-400"
					style={`--value:${100 * (session.at / session.count)};--size:18rem;--thickness:${session.at === session.count ? '0.75rem' : '0.5rem'};--`}
					role="progressbar"
				>
					<p class="font-digit">
						<span class="text-5xl">
							{session.at}
						</span>
						<span>/{session.count}</span>
					</p>
				</div>
			{:else}
				<button on:click={onClick}>
					{#if isLoading}
						<span class="loading loading-spinner"></span>
					{:else}
						<div
							class="radial-progress-primary radial-progress"
							style={`--value:${100 * (session.at / session.count)};--size:18rem;--thickness:${session.at === session.count ? '0.75rem' : '0.5rem'};--`}
							role="progressbar"
						>
							<p class="font-digit text-content">
								<span class="text-5xl">
									{session.at}
								</span>
								<span>/{session.count}</span>
							</p>
						</div>
					{/if}
				</button>
				<!-- {#if isLoading}
				<button class="btn btn-circle btn-neutral btn-lg" aria-label="loading" disabled>
					<span class="loading loading-spinner"></span>
				</button>
			{:else}
				<button class="btn btn-circle btn-neutral btn-lg" on:click={onClick}> +1 </button>
			{/if} -->
			{/if}
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
