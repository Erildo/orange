<script>
	import CreatePost from '../components/createPost.svelte';
	import PostListing from '../components/postListing.svelte';
	import { supabase } from '$lib/supabaseClient';
	let allPosts = [];

	async function getPosts() {
		try {
			let { data, error, status } = await supabase.from('postview').select('*');
			if (error) throw error;
			if (data) {
				allPosts = data;
			}
		} catch (error) {
			console.log(error);
		}
	}
</script>

<main class="min-h-screen">
	<div class="flex w-full">
		<section class="sm:w-[200px] md:w-[600px] border border-y-0 border-gray-800">
			<!--Content (Center)-->
			<aside>
				<div class="flex">
					<div class="flex-1 mx-2">
						<h2 class="px-4 py-2 text-xl font-semibold text-white font-roboto">Home</h2>
					</div>
					<div class="flex-1 px-4 py-2 mx-2">
						<a
							href="./"
							class=" text-2xl font-medium rounded-full text-white hover:bg-gray-800 hover:text-blue-300 float-right"
						>
							<ion-icon class="w-6 h-6" name="planet-sharp" />
						</a>
					</div>
				</div>

				<hr class="border-gray-800" />
				<CreatePost />
			</aside>
			<div use:getPosts>
				<PostListing bind:postsArray={allPosts} />
			</div>
		</section>
	</div>
</main>
