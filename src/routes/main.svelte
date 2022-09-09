<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';

	import { supabase } from '$lib/supabaseClient';
	import Sidebar from './sidebar.svelte';
	import Wave from './wave.svelte';
	import Toast, { showToast } from './toast.svelte';

	import Trends from './trends.svelte';
	import { createEventDispatcher } from 'svelte';
	import Audiolist from './audiolist.svelte';

	const dispatch = createEventDispatcher();

	const user = supabase.auth.user();
	const sessions = supabase.auth.session();
	const picture = sessions.user.identities[0].identity_data.picture;
	const user_name = sessions.user.identities[0].identity_data.user_name;
	let tweet = '';
	let toastMessage = '';
	let po_storage, image;
	function blueColor() {
		tweet = tweet.replace(/<a\b[^>]*>|\B(#[^\W_][\w-]*)/gi, function (m, p) {
			return p ? '<span class="hash_tag">' + m + '</span>' : m;
		});
	}

	async function post() {
		if (avatar) {
			await uploadAvatar();
			po_storage = image.name;
		} else {
			po_storage = '';
		}
		if (clipName) {
			po_storage = clipName;

			await uploadAudio();
		}
		// try {
		// 	const { data, error } = await supabase.from('posts').insert([
		// 		{
		// 			po_uid: user.id,
		// 			po_storage: po_storage,
		// 			po_content: tweet
		// 		}
		// 	]);
		// 	if (error) throw error;
		// 	toastMessage = 'Congrats, its posted!';
		// 	showToast();
		// } catch (error) {
		// 	showToast();
		// 	toastMessage = error.message;
		// }
		tweet = '';
		avatar = null;
		image = null;
		recordings = [];
	}

	let avatar, fileinput;

	const onFileSelected = (e) => {
		image = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			avatar = e.target.result;
		};
	};
	function removeImage() {
		avatar = null;
		image = null;
		// bug when you select the same image!!!
	}

	async function uploadAvatar() {
		try {
			const fileName = `posts/${user_name}/${image.name}`;
			const filePath = `${fileName}`;

			let { error: uploadError } = await supabase.storage.from('files').upload(filePath, image);

			if (uploadError) throw uploadError;
			dispatch('upload');
		} catch (error) {
			alert(error.message);
		}
	}

	async function uploadAudio() {
		try {
			let { error: uploadError } = await supabase.storage.from('files').upload(clipName, blob);

			if (uploadError) throw uploadError;
			dispatch('upload');
		} catch (error) {
			alert(error.message);
		}
	}

	let randomNumber, audioURL, clipName, blob;
	function getRandomNumbers() {
		const typedArray = new Uint8Array(10);
		const randomValues = window.crypto.getRandomValues(typedArray);
		randomNumber = randomValues.join('');
	}
	const constrains = { audio: true };
	let mediaRecorder = null;
	let chunks = [];
	let status = false;
	let recordings = [];

	if (navigator.mediaDevices) {
		navigator.mediaDevices
			.getUserMedia(constrains)
			.then((stream) => {
				mediaRecorder = new MediaRecorder(stream);

				mediaRecorder.ondataavailable = (e) => {
					chunks.push(e.data);
				};

				mediaRecorder.onstop = (e) => {
					getRandomNumbers();
					clipName = `posts/${user_name}/${randomNumber}`;

					blob = new Blob(chunks, { type: 'audio/ogg; codecs-opus' });
					audioURL = URL.createObjectURL(blob);
					chunks = [];

					recordings = [
						...recordings,
						{
							title: clipName,
							audio: audioURL
						}
					];
				};
			})
			.catch((err) => {
				alert(
					'Permission denied. To use the recorder you will have to allow access to the microphone.'
				);
				console.log('The fallowing error occurred: ' + err);
			});
	}

	function record() {
		mediaRecorder.start();
		status = true;
	}

	function stop() {
		mediaRecorder.stop();
		status = false;
	}

	function deleteRecording(item) {
		recordings = recordings.filter((i) => i !== item);
	}
</script>

<Toast text={toastMessage} />
<div class="p-relative  bg-black">
	<div class="flex justify-center">
		<header class="text-white h-12 py-4 h-auto">
			<!-- Navbar (left side) -->
			<Sidebar />
		</header>

		<main class="min-h-screen">
			<div class="flex" style="width: 990px;">
				<section class="w-3/5 border border-y-0 border-gray-800" style="max-width:600px;">
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
						<div class="flex">
							<div class="m-2 w-10 py-1">
								<img class="inline-block h-10 w-10 rounded-full" src={picture} alt="avatar" />
							</div>
							<div class="flex-1 px-2 pt-2 mt-2 dark">
								{#if status === true}
									<span class="text-blue-300">Recording...</span>
									<Wave/>
								{/if}
								<input
									bind:value={tweet}
									class="block p-2.5 w-full 
									rounded-lg border text-white focus:outline-none focus:ring
									bg-gray-700 border-gray-600 placeholder-gray-400
									hover:border-blue-600"
									placeholder="What's happening..."
									maxlength="200"
								/>
								{#if avatar}
									<div class="relative">
										<img class="w-full" src={avatar} alt="uploaded" />
										<button
											on:click={removeImage}
											class="absolute text-xs  top-0 bg-black text-white p-2 rounded  m-2">X</button
										>
									</div>
								{/if}
								{#if recordings.length > 0}
									{#each recordings as recording, i}
										<Audiolist
											title={i + 1 + ': ' + recording.title}
											audio={recording.audio}
											on:deleterecording={() => deleteRecording(recording)}
										/>
									{/each}
								{:else}
									<div>Doesn't have any audio stored.</div>
								{/if}
							</div>
						</div>
						<!--middle creat tweet below icons-->
						<div class="flex">
							<div class="w-10" />

							<div class="w-64 px-2">
								<div class="flex items-center">
									<div class="flex-1 text-center px-1 py-1 m-2">
										<a
											href="./"
											on:click={() => {
												fileinput.click();
											}}
											class="mt-1 group flex items-center text-blue-400 px-2 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-blue-300"
										>
											<ion-icon class="h-7 w-7" name="image-outline" />
										</a>
										<input
											style="display:none"
											type="file"
											accept=".jpg, .jpeg, .png"
											on:change={(e) => onFileSelected(e)}
											bind:this={fileinput}
										/>
									</div>

									<div class="flex-1 text-center py-2 m-2">
										<a
											href="./"
											class="mt-1 group flex items-center text-blue-400 px-2 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-blue-300"
										>
											<ion-icon class="h-7 w-7" name="happy-outline" />
										</a>
									</div>

									<div class="flex-1 text-center py-2 m-2">
										{#if status === false}
											<a
												href="./"
												on:click={record}
												class="mt-1 group flex items-center text-blue-400 px-2 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-blue-300"
											>
												<ion-icon class="h-7 w-7" name="mic-outline" />
											</a>
										{:else}
											<a
												href="./"
												on:click={stop}
												class="mt-1 group flex items-center text-blue-400 px-2 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-blue-300"
											>
												<ion-icon class="h-7 w-7" name="stop-circle-outline" />
											</a>
										{/if}
									</div>
									<div class="flex-1 text-center py-2 m-2" />
								</div>
							</div>

							<div class="flex-1">
								<button
									type="button"
									on:click={post}
									class="float-right text-white mt-5 mr-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
									>Tweet</button
								>
							</div>
						</div>

						<hr class="border-gray-800 border-4" />
					</aside>

					<ul class="list-none">
						<li>
							<!--second tweet-->
							<article class="hover:bg-gray-800 transition duration-350 ease-in-out">
								<div class="flex flex-shrink-0 p-4 pb-0">
									<a href="./" class="flex-shrink-0 group block">
										<div class="flex items-center">
											<div>
												<img
													class="inline-block h-10 w-10 rounded-full"
													src="https://pbs.twimg.com/profile_images/1121328878142853120/e-rpjoJi_bigger.png"
													alt=""
												/>
											</div>
											<div class="ml-3">
												<p class="text-base leading-6 font-medium text-white">
													Sonali Hirave
													<span
														class="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150"
													>
														@ShonaDesign . 16 April
													</span>
												</p>
											</div>
										</div>
									</a>
								</div>

								<div class="pl-16">
									<p class="text-base width-auto  text-white flex-shrink font-helvetica">
										Day 07 of the challenge <a href="./" class="text-blue-400">#changed</a>
										I was wondering what I can do with
										<a href="./" class="text-blue-400">#tailwindcss</a>, so just started building
										Twitter UI using Tailwind and so far it looks so promising. I will post my code
										after completion. [07/100]
										<a href="./" class="text-blue-400"> #WomenWhoCode #CodeNewbie</a>
									</p>

									<div class="md:flex-shrink pr-6 pt-3">
										<div
											class="bg-cover bg-no-repeat bg-center rounded-lg w-full h-64"
											style=" height: 200px; background-image: url(https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=448&amp;q=80);"
										>
											<img
												class="opacity-0 w-full h-full"
												src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=448&amp;q=80"
												alt=""
											/>
										</div>
									</div>

									<div class="flex items-center py-4">
										<div
											class="font-roboto flex-1 flex items-center text-xs text-gray-400 hover:text-blue-400 transition duration-350 ease-in-out"
										>
											<ion-icon class="h-5 w-5 mr-2" name="chatbubble-outline" />
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
						</li>
					</ul>
				</section>

				<Trends />
			</div>
		</main>
	</div>
</div>
<!-- 
<style>
	.overflow-y-auto::-webkit-scrollbar,
	.overflow-y-scroll::-webkit-scrollbar,
	.overflow-x-auto::-webkit-scrollbar,
	.overflow-x::-webkit-scrollbar,
	.overflow-x-scroll::-webkit-scrollbar,
	.overflow-y::-webkit-scrollbar,
	body::-webkit-scrollbar {
		display: none;
	}

	.overflow-y-auto,
	.overflow-y-scroll,
	.overflow-x-auto,
	.overflow-x,
	.overflow-x-scroll,
	.overflow-y,
	body {
		-ms-overflow-style: none;
		/* IE and Edge */
		scrollbar-width: none;
		/* Firefox */
	}
</style> -->
