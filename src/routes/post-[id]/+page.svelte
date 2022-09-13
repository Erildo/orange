<script>
	import Sidebar from '../sidebar.svelte';
	import { page } from '$app/stores';
	import Trends from '../trends.svelte';
	import Image from '../image.svelte';
	import { supabase } from '$lib/supabaseClient';
	import {getUser} from '../user'
import CreatePost from '../createPost.svelte';
	const id = $page.params.id;
	let thisPage;
	let postArray = [];
	async function getPost() {
		try {
			let { data, error, status } = await supabase.from('postview').select('*').eq('po_id', id);

			if (error) throw error;
			if (data) {
				postArray = data;
				console.log(data);
			}
		} catch (error) {
			console.log(error);
		}
	}
	let tweet = '';
	
</script>

<div class="p-relative  bg-black">
	<div class="flex justify-center">
		<header class="text-white  h-12 py-4 h-auto">
			<Sidebar bind:mainPage={thisPage} />
		</header>

		<main class="min-h-screen" use:getPost>
			<div class="flex w-full">
				<section class="sm:w-[200px] md:w-[600px] border border-y-0 border-gray-800">
					<div class="flex">
						<div class="flex-1 mx-2">
							
							<h2 class="px-4 py-2 text-xl font-semibold text-white font-roboto">
								<ion-icon name="arrow-back-outline" class="mr-2 h-4 w-6" />
								Comment</h2>
						</div>
					</div>

					{#each postArray as post}
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
										class="font-roboto flex-1 flex items-center  text-gray-400 hover:text-blue-400 transition duration-350 ease-in-out"
									>
										<a href="./post-{post.po_uid}"
											><ion-icon class="h-7 w-7 mr-2" name="chatbubble-outline" />
										</a>
										12.3 k
									</div>
									<div
										class="flex-1 flex items-center text-white  text-gray-400 hover:text-green-400 transition duration-350 ease-in-out"
									>
										<ion-icon class="h-7 w-7 mr-2" name="repeat-outline" />
										14 k
									</div>
									<div
										class="flex-1 flex items-center text-white text-gray-400 hover:text-red-600 transition duration-350 ease-in-out"
									>
										<ion-icon class="h-7 w-7 mr-2" name="heart-outline" />
										15 k
									</div>
									<div
										class="flex-1 flex items-center text-white text-gray-400 hover:text-blue-400 transition duration-350 ease-in-out"
									>
										<ion-icon class="h-7 w-7" name="headset-outline" />
									</div>
								</div>
							</div>
							<hr class="border-gray-800" />
						</article>
					{/each}
					<CreatePost />
				</section>
			</div>
		</main>

		<div class="hidden md:block flex w-[300px]">
			<Trends />
		</div>
	</div>
</div>
