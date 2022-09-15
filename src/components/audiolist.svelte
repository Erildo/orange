<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let title;
	export let audio;
	let player;
	let status = 'play';
	let bool;

	async function play() {
		status = 'pause';
		player.play();
	}

	async function pause() {
		player.pause();
		status = 'play';
	}

	$: if (bool === true) {
		status = 'play';
	}
</script>

<audio bind:this={player} bind:ended={bool} controls src={audio} name={title} class="bg-black hidden" />

<div class="grid grid-cols-2">
	<ion-icon
		on:click={status === 'play' ? play : pause}
		class="text-blue-200 h-6 w-6"
		name={status === 'play' ? 'play-outline' : 'pause-outline'}
	/>
	<ion-icon
		on:click={() => dispatch('deleterecording')}
		class="ml-4 text-blue-200 h-5 w-5"
		name="remove-circle-outline"
	/>
</div>