<script>
	import '../app.css';
	import Trends from '../components/trends.svelte';
	import { user } from '$lib/sessionStore';
	import Sidebar from '../components/sidebar.svelte';

</script>
{#if $user}
<div class="p-relative  bg-black">
	<div class="flex justify-center">
		<header class="text-white  h-12 py-4 h-auto">
			<Sidebar/>
		</header>
        
		<slot/>
		<div class="hidden md:block flex w-[300px]">
			<Trends />
		</div>
	</div>
</div>
{:else}
<slot/>
{/if}
