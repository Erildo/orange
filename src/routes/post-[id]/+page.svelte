<script>

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { supabase } from '$lib/supabaseClient';
	import PostListing from '../../components/postListing.svelte';
	import CreatePost from '../../components/createPost.svelte';
	const id = $page.params.id;

	let postArray = [];
	let commentsArray = [];
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
	async function getComments() {
		try {
			let { data, error, status } = await supabase.from('commentsview').select('*').eq('cp_id', id);

			if (error) throw error;
			if (data) {
				commentsArray = data;
			}
		} catch (error) {
			console.log(error);
		}
	}

	const goSomeWhereBack = () => {
    goto($page.url.pathname.substring(0, $page.url.pathname.lastIndexOf('/')));
}
</script>

		<main class="min-h-screen" >
			<div class="flex w-full">
				<section class="sm:w-[200px] md:w-[600px] border border-y-0 border-gray-800">
					<div class="flex">
						<div class="flex-1 mx-2">
							
							<h2 class="px-4 py-2 text-xl font-semibold text-white font-roboto">
							<a  on:click={goSomeWhereBack} href="./"><ion-icon name="arrow-back-outline" class="mr-2 h-4 w-6" /></a>
								Comment</h2>
						</div>
					</div>
					<div use:getPost>
						<PostListing bind:postsArray={postArray} table="posts" />
					</div>
					
					
					<CreatePost table="comments" postID={id}/>
					<div use:getComments>
					<PostListing bind:postsArray={commentsArray} table="comments" />
					</div>
				</section>
			</div>
		</main>

		