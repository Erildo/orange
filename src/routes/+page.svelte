<script>
	// @ts-nocheck
	import { user } from '$lib/sessionStore';
	import Home from './home/+page.svelte';
	import Welcome from './welcome/+page.svelte';
	import { supabase } from '$lib/supabaseClient';

	user.set(supabase.auth.user());

	supabase.auth.onAuthStateChange((state, session) => {
		if (state == 'SIGNED_IN') {
			user.set(session.user);
			
		} else {
			user.set(false);
		}
	});
	
</script>

<div class="md:w-full md:h-screen absolute inset-0">
	{#if $user}
	<Home/>
	{:else}
		<Welcome/>
	{/if}
</div>
