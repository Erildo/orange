<script>
	import { supabase } from '$lib/supabaseClient';

	import Wave from './wave.svelte';
	import Toasting, { showToast } from './toast.svelte';

	import { createEventDispatcher } from 'svelte';
	import Audiolist from './audiolist.svelte';
	import Image from './image.svelte';
	const dispatch = createEventDispatcher();

	const user = supabase.auth.user();
	const sessions = supabase.auth.session();
	const picture = sessions.user.identities[0].identity_data.picture;
	const user_name = sessions.user.identities[0].identity_data.user_name;
	import EmojiPicker from 'svelte-emoji-picker';
	import Modal from './modal.svelte';
import Testing from './testing.svelte';
	let showModal = false;

	let tweet = '';
	let toastMessage = '';
	let po_storage, image;

	function blueColor() {
		tweet = tweet.replace(/<a\b[^>]*>|\B(#[^\W_][\w-]*)/gi, function (m, p) {
			return p ? '<span class="hash_tag">' + m + '</span>' : m;
		});
	}
	let id = 'second';
	async function post() {
		if (tweet) {
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
			try {
				const { data, error } = await supabase.from('posts').insert([
					{
						po_uid: user.id,
						po_storage: po_storage,
						po_content: tweet
					}
				]);
				if (error) throw error;
				toastMessage = 'Congrats, its posted!';
				showToast(id);
			} catch (error) {
				toastMessage = error.message;
				showToast(id);
			}
		} else {
			toastMessage = 'Please dont leave text blank!';

			showToast(id);
		}
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
<Toasting bind:id bind:text={toastMessage} />

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
				<div class="flex">
					<div class="m-2 w-10 py-1">
						<img class="inline-block h-10 w-10 rounded-full" src={picture} alt="avatar" />
					</div>
					<div class="flex-1 px-2 pt-2 mt-2 dark">
						{#if status === true}
							<span class="text-blue-300">Recording...</span>
							<!-- <Wave /> -->
						{/if}
						<textarea
							rows="3"
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
							{#if showModal}
								<Modal on:close={() => (showModal = false)}>
									<EmojiPicker bind:value={tweet} />
								</Modal>
							{/if}
							<div class="flex-1 text-center py-2 m-2">
								<a
									on:click={() => (showModal = !showModal)}
									href="./"
									class="mt-1 group flex items-center text-blue-400 px-2 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-blue-300"
								>
									<ion-icon class="h-7 w-7" name="happy-outline" />
								</a>
							</div>

							<div class="flex-1 text-center mt-4 m-2">
								<div class="wrapper">
									{#if status === true}
										<div class="circle-wrapper">
											<div class="circle2" />
										</div>

										<div class="circle-wrapper">
											<div class="circle1" />
										</div>
									{/if}
									<a
										class="btn hover:text-blue-300 {status === false
											? 'text-blue-400 '
											: 'text-blue-300'} "
										href="./"
										on:click={status === false ? record : stop}
									>
										<ion-icon class="h-7 w-7" name="mic-outline" />
									</a>
								</div>
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
									<a href="./post-{post.po_uid}"><ion-icon  class="h-5 w-5 mr-2" name="chatbubble-outline" /> </a>
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

<style>
	.wrapper {
		position: relative;

		/*   background-color:red; */
	}

	.circle-wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.circle1 {
		z-index: 0;
		width: 100px;
		height: 100px;
		background: #bbadef;
		border-radius: 100px;
		animation: pulse 2s ease both infinite;
	}

	.circle2 {
		z-index: 0;
		width: 120px;
		height: 120px;
		background: #a596d8;
		border-radius: 140px;
		opacity: 0.6;
		animation: pulse 2s ease both infinite;
		animation-delay: 200ms;
	}

	@keyframes pulse {
		0% {
			transform: scale(0.5);
			opacity: 0;
		}
		20% {
			transform: scale(1);
			opacity: 0.3;
		}

		50% {
			transform: scale(0.5);
			opacity: 0;
		}

		70% {
			transform: scale(1);
			opacity: 0.3;
		}

		100% {
			transform: scale(0.5);
			opacity: 0;
		}
	}
</style>
