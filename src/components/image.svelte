<script>
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	export let path;
	export let user_name;
	let src;

	async function downloadImage() {
		const img = `posts/${user_name}/${path}`;
		const filePath = `${img}`;

		await supabase.storage
			.from('files')
			.download(filePath)
			.then(({ data, error }) => {
				if (error) throw error;
				src = URL.createObjectURL(data);
			})
			.catch((error) => console.error('Error downloading image: ', error.message));
	}
</script>

<div class="rounded-lg w-full h-64 " style=" height: 200px;">
	<img use:downloadImage {src} class="opacity-100 w-full h-full" alt={src} />
</div>
