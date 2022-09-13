<script>
	import { supabase } from '$lib/supabaseClient';

	
	import Toasting, { showToast } from './toast.svelte';

	import { createEventDispatcher } from 'svelte';
	import Audiolist from './audiolist.svelte';
	import Image from './image.svelte';
	import CreatePost from './createPost.svelte';
	const dispatch = createEventDispatcher();

	let postsArray = [];
	// const mySubscription = supabase
	// 	.from('postview')
	// 	.on('INSERT', handleRecordInserted)
	// 	.on('DELETE', handleRecordDeleted)
	// 	.subscribe();
	// console.log(mySubscription)
	async function getPosts() {
		try {
			let { data, error, status } = await supabase.from('postview').select('*');
			if (error) throw error;
			if (data) {
				postsArray = data;
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
				<!--middle creat tweet-->
				<CreatePost />
			</aside>

			<ul class="list-none" use:getPosts>
				<li>
					{#each postsArray as post}
						<article class="hover:bg-gray-800 transition duration-350 ease-in-out">
							<div class="flex flex-shrink-0 p-4 pb-0">
								<a href="./" class="flex-shrink-0 group block">
									<div class="flex items-center">
										<div>
											<img
												class="inline-block h-10 w-10 rounded-full"
												src={post.picture}
												alt={post.picture}
											/>
										</div>
										<div class="ml-3">
											<p class="text-base leading-6 font-medium text-white">
												{post.name}
												<span
													class="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150"
												>
													@{post.user_name} . {new Date(post.po_created_at).toDateString()}
												</span>
											</p>
										</div>
									</div>
								</a>
							</div>

							<div class="pl-16">
								<p class="text-base width-auto  text-white flex-shrink font-helvetica">
									{post.po_content}
								</p>
								{#if post.po_storage}
									<div class="md:flex-shrink pr-6 pt-3">
										<Image path={post.po_storage} user_name={post.user_name} />
									</div>
								{/if}
								<div class="flex items-center py-4">
									<div
										class="font-roboto flex-1 flex items-center text-xs text-gray-400 hover:text-blue-400 transition duration-350 ease-in-out"
									>
										<a href="./post-{post.po_id}"
											><ion-icon class="h-5 w-5 mr-2" name="chatbubble-outline" />
										</a>
										12.3 k
									</div>
									<div
										class="flex-1 flex items-center text-white text-xs text-gray-400 hover:text-green-400 transition duration-350 ease-in-out"
									>
										<ion-icon class="h-5 w-5 mr-2" name="git-compare-outline" />
										14 k
									</div>
									<div
										class="flex-1 flex items-center text-white text-xs text-gray-400 hover:text-red-600 transition duration-350 ease-in-out"
									>
										<ion-icon class="h-5 w-5 mr-2" name="heart-outline" />
										15 k
									</div>
									<div
										class="flex-1 flex items-center text-white text-xs text-gray-400 hover:text-blue-400 transition duration-350 ease-in-out"
									>
										<ion-icon class="h-5 w-5" name="headset-outline" />
									</div>
								</div>
							</div>
							<hr class="border-gray-800" />
						</article>
					{/each}
				</li>
				<li>
					<article>
						<!-- <Testing/> -->
					</article>
				</li>
			</ul>
		</section>
	</div>
</main>
