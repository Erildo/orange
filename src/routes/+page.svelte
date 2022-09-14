<script>
	// @ts-nocheck
	import { user } from '$lib/sessionStore';
	import Welcome from './welcome/+page.svelte';
	import { supabase } from '$lib/supabaseClient';
	import Main from './main.svelte';

	user.set(supabase.auth.user());

	supabase.auth.onAuthStateChange((state, session) => {
		if (state == 'SIGNED_IN') {
			user.set(session.user);
			
		} else {
			user.set(false);
		}
	});
	
</script>

	{#if $user}
	<Main/>
	{:else}
		<Welcome/>
	{/if}

