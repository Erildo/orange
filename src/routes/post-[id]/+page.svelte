<script>
    import Sidebar from '../sidebar.svelte';
	import { page, session,user } from '$app/stores';

    const id = $page.params.id
    let thisPage;
</script>
<div class="p-relative  bg-black">
	<div class="flex justify-center">
		<header class="text-white  h-12 py-4 h-auto">
			<Sidebar bind:mainPage = {thisPage} />
		</header>
		<svelte:component this={thisPage}/>
		<div class="hidden md:block flex w-[300px]">
			{id}
		</div>
	</div>
</div>