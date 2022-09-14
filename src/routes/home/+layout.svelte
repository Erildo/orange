<script>
	// @ts-nocheck

	import Sidebar from '../sidebar.svelte';
	import Trends from '../trends.svelte';
	
</script>

<div class="p-relative  bg-black">
	<div class="flex justify-center">
		<header class="text-white  h-12 py-4 h-auto">
			<Sidebar />
		</header>
        
		<slot></slot>
		<div class="hidden md:block flex w-[300px]">
			<Trends />
		</div>
	</div>
</div>