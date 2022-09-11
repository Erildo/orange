<script>
	// @ts-nocheck
	import { user } from '$lib/sessionStore';
	import { supabase } from '$lib/supabaseClient';
	import Welcome from './welcome.svelte';
	import HomePage from './homePage.svelte';

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
		<HomePage />
	{:else}
		<Welcome />
	{/if}

</div>
