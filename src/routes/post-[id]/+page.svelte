<script>

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { supabase } from '$lib/supabaseClient';
	import Comment from './_comment.svelte';
	import PostListing from '../../components/postListing.svelte';
	const id = $page.params.id;

	let postArray = [];
	async function getPost() {
		try {
			let { data, error, status } = await supabase.from('postview').select('*').eq('po_id', id);

			if (error) throw error;
			if (data) {
				postArray = data;
			}
		} catch (error) {
			console.log(error);
		}
	}

	const goSomeWhereBack = () => {
    goto($page.url.pathname.substring(0, $page.url.pathname.lastIndexOf('/')));
}
</script>

		<main class="min-h-screen" use:getPost>
			<div class="flex w-full">
				<section class="sm:w-[200px] md:w-[600px] border border-y-0 border-gray-800">
					<div class="flex">
						<div class="flex-1 mx-2">
							
							<h2 class="px-4 py-2 text-xl font-semibold text-white font-roboto">
							<a  on:click={goSomeWhereBack} href="./"><ion-icon name="arrow-back-outline" class="mr-2 h-4 w-6" /></a>
								Comment</h2>
						</div>
					</div>

					<PostListing bind:postsArray={postArray} />
					<Comment />
				</section>
			</div>
		</main>

		