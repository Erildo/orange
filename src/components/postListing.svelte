<script>
	import { supabase } from '$lib/supabaseClient';
	import Image from '../components/image.svelte';
	import Time, { svelteTime } from 'svelte-time';
	import ColorHash from './colorHash.svelte';
	import Likes from './likes.svelte';
	import { inview } from 'svelte-inview';
	import { onMount } from 'svelte';

	export let postsArray = [];
	export let table;

	// async function getPosts() {
	// 	try {
	// 		let { data, error, status } = await supabase.from('postview').select('*');
	// 		if (error) throw error;
	// 		if (data) {
	// 			postsArray = data;
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }

	let deletePop = 0;
	async function toggleFunctions(number) {
		if (number === deletePop) {
			deletePop = 0;
		} else {
			deletePop = number;
		}
	}

	let page = 0;
	const PAGE_SIZE = 5;
	let hasMore = true;
	let posts = [];
	let current = 0,
		next;

	async function fetchData() {
		if (postsArray.length > 0 && postsArray.length <= next) {
			next = current + PAGE_SIZE;

			posts = [...posts, ...postsArray.slice(current, next)];
			console.log(posts);
			current = next;
		} else hasMore = false;
	}

	const handleChange = (e) => {
		page++;
		if (e.detail.inView && hasMore) fetchData(page);
	};

	let promise = fetchData();
</script>

<div use:fetchData>
	<ul class="list-none">
		<li>
			{#if table === 'posts'}
				<!-- {#await promise}
				<p class="color-white">...waiting</p>
			{:then response} -->
				{#each posts as post, i}
					<article class="hover:bg-gray-800 transition duration-350 ease-in-out">
						<div class="flex flex-shrink-0 p-4 pb-0">
							<div class="flex  justify-between">
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
											@{post.user_name}

											<time
												use:svelteTime={{
													relative: true,
													timestamp: new Date(post.po_created_at).toDateString()
												}}
											/>
										</span>
									</p>
								</div>
								<div class="w-[200px]" />
								<div class=" order-last text-white  opacity-70 hover:opacity-100">
									<a href="./" on:click={toggleFunctions(post.po_id)}>
										<ion-icon name="ellipsis-horizontal-outline" />
									</a>
									<div
										id={i}
										class=" {post.po_id === deletePop
											? ''
											: 'hidden'} z-10  bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"
									>
										<ul
											class="py-1 text-sm text-gray-700 dark:text-gray-200"
											aria-labelledby="dropdownDefault"
										>
											<li>
												<a
													href="./"
													class="block hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
													>Delete</a
												>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>

						<div class="pl-16">
							<ColorHash bind:text={post.po_content} />

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
									<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mr-2">
										<g>
											<path
												d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"
											/>
										</g>
									</svg>
									14 k
								</div>
								<Likes bind:item={post.po_id} />
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
				<!-- {:catch error}
				<p style="color: red">{error.message}</p>
			{/await} -->
				<div use:inview={{}} on:change={handleChange} />
			{:else}
				{#each postsArray as post, i}
					<article class="hover:bg-gray-800 transition duration-350 ease-in-out">
						<div class="flex flex-shrink-0 p-4 pb-0">
							<div class="flex  justify-between">
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
											@{post.user_name}

											<time
												use:svelteTime={{
													relative: true,
													timestamp: new Date(post.c_created_at).toDateString()
												}}
											/>
										</span>
									</p>
								</div>
								<div class="w-[200px]" />
								<div class=" order-last text-white  opacity-70 hover:opacity-100">
									<a href="./" on:click={toggleFunctions(post.c_id)}>
										<ion-icon name="ellipsis-horizontal-outline" />
									</a>
									<div
										id={i}
										class=" {post.c_id === deletePop
											? ''
											: 'hidden'} z-10  bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"
									>
										<ul
											class="py-1 text-sm text-gray-700 dark:text-gray-200"
											aria-labelledby="dropdownDefault"
										>
											<li>
												<a
													href="./"
													class="block hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
													>Delete</a
												>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>

						<div class="pl-16">
							<ColorHash bind:text={post.c_text} />

							{#if post.po_storage}
								<div class="md:flex-shrink pr-6 pt-3">
									<Image path={post.c_storage} user_name={post.user_name} />
								</div>
							{/if}
							<div class="flex items-center py-4">
								<div
									class="font-roboto flex-1 flex items-center text-xs text-gray-400 hover:text-blue-400 transition duration-350 ease-in-out"
								>
									<a href="./post-{post.c_id}"
										><ion-icon class="h-5 w-5 mr-2" name="chatbubble-outline" />
									</a>
									12.3 k
								</div>
								<div
									class="flex-1 flex items-center text-white text-xs text-gray-400 hover:text-green-400 transition duration-350 ease-in-out"
								>
									<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mr-2">
										<g>
											<path
												d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"
											/>
										</g>
									</svg>
									14 k
								</div>
								<Likes bind:item={post.c_id} />
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
			{/if}
		</li>
		<li />
	</ul>
</div>
