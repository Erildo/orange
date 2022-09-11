<script>
	// @ts-nocheck

	import Sidebar from './sidebar.svelte';
	import Trends from './trends.svelte';
	import Main from './main.svelte';
	import Profile from './profile.svelte';
	let thisPage;
</script>

<div class="p-relative  bg-black">
	<div class="flex justify-center">
		<header class="text-white  h-12 py-4 h-auto">
			<Sidebar bind:mainPage = {thisPage} />
		</header>
		<svelte:component this={thisPage}/>
		<div class="hidden md:block flex w-[300px]">
			<Trends />
		</div>
	</div>
</div>
<!-- 
<style>
	.overflow-y-auto::-webkit-scrollbar,
	.overflow-y-scroll::-webkit-scrollbar,
	.overflow-x-auto::-webkit-scrollbar,
	.overflow-x::-webkit-scrollbar,
	.overflow-x-scroll::-webkit-scrollbar,
	.overflow-y::-webkit-scrollbar,
	body::-webkit-scrollbar {
		display: none;
	}

	.overflow-y-auto,
	.overflow-y-scroll,
	.overflow-x-auto,
	.overflow-x,
	.overflow-x-scroll,
	.overflow-y,
	body {
		-ms-overflow-style: none;
		/* IE and Edge */
		scrollbar-width: none;
		/* Firefox */
	}
</style> -->
