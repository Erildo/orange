<script>
	import { supabase } from '$lib/supabaseClient';
	import Toasting, { showToast } from './toast.svelte';
	import { createEventDispatcher } from 'svelte';
	// import Audiolist from './audiolist.svelte';
	import TextStylingDiv from './textStylingDiv.svelte';
	import { getUser } from './user';
	import EmojiPicker from 'svelte-emoji-picker';
	import Modal from './modal.svelte';
	import { onMount } from 'svelte';

	export let table, postID;
	const dispatch = createEventDispatcher();

	 function generateUID() {
		return window
			.btoa(
				Array.from(window.crypto.getRandomValues(new Uint8Array(6 * 2)))
					.map((c) => String.fromCharCode(c))
					.join('')
			)
			.replace(/[+/]/g, '')
			.substring(0, 6);
	}
	let id = generateUID();
	
	let promise = Promise.resolve([]);
	let user_name, picture;
	const user = supabase.auth.user();
	promise = getUser(user.id);
	promise.then((value) => {
		user_name = value[0].user_name;
		picture = value[0].picture;
	});

	let showModal = false;
	let tweet;
	let toastMessage = '';
	let po_storage, image;

	async function CreatePost() {
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
	}

	async function insertComment(thisID) {
		try {
			const { data, error } = await supabase.from('comments').insert([
				{
					c_uid: user.id,
					c_storage: po_storage,
					c_text: tweet,
					cp_id: thisID
				}
			]);
			if (error) throw error;
			toastMessage = 'Congrats, its posted!';
			showToast(id);
		} catch (error) {
			toastMessage = error.message;
			showToast(id);
		}
	}

	async function post() {
		if (tweet) {
			if (avatar) {
				await uploadAvatar();
				po_storage = image.name;
			} else {
				po_storage = '';
			}
			if (table === 'posts') {
				await CreatePost();
			}
			if (table === 'comments') {
				await insertComment(postID);
			}
		} else {
			toastMessage = 'Please dont leave text blank!';

			showToast(id);
		}
		tweet = '';
		avatar = null;
		image = null;
		// recordings = [];
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

	// async function uploadAudio() {
	// 	try {
	// 		let { error: uploadError } = await supabase.storage.from('files').upload(clipName, blob);

	// 		if (uploadError) throw uploadError;
	// 		dispatch('upload');
	// 	} catch (error) {
	// 		alert(error.message);
	// 	}
	// }

	// let randomNumber, audioURL, clipName, blob;
	// function getRandomNumbers() {
	// 	const typedArray = new Uint8Array(10);
	// 	const randomValues = window.crypto.getRandomValues(typedArray);
	// 	randomNumber = randomValues.join('');
	// }
	// const constrains = { audio: true };
	// let mediaRecorder = null;
	// let chunks = [];
	// let status = false;
	// let recordings = [];

	// if (navigator.mediaDevices) {
	// 	navigator.mediaDevices
	// 		.getUserMedia(constrains)
	// 		.then((stream) => {
	// 			mediaRecorder = new MediaRecorder(stream);

	// 			mediaRecorder.ondataavailable = (e) => {
	// 				chunks.push(e.data);
	// 			};

	// 			mediaRecorder.onstop = (e) => {
	// 				getRandomNumbers();
	// 				clipName = `posts/${user_name}/${randomNumber}`;

	// 				blob = new Blob(chunks, { type: 'audio/ogg; codecs-opus' });
	// 				audioURL = URL.createObjectURL(blob);
	// 				chunks = [];
	// 				if (recordings.length < 1) {
	// 					recordings = [
	// 						...recordings,
	// 						{
	// 							title: clipName,
	// 							audio: audioURL
	// 						}
	// 					];
	// 				}
	// 			};
	// 		})
	// 		.catch((err) => {
	// 			alert(
	// 				'Permission denied. To use the recorder you will have to allow access to the microphone.'
	// 			);
	// 			console.log('The fallowing error occurred: ' + err);
	// 		});
	// }

	// function record() {
	// 	mediaRecorder.start();
	// 	status = true;
	// }

	// function stop() {
	// 	mediaRecorder.stop();
	// 	status = false;
	// }

	// function deleteRecording(item) {
	// 	recordings = recordings.filter((i) => i !== item);
	// }
	// function blueColor() {
	// 	tweet = tweet.replace(/(^|\s)(#\w+)/g, ' <a href=#>$2</a>').replace('<br>', '');

	// 	var savedSel = sel.saveCharacterRanges(tweet);
	// 	tweet = sel.restoreCharacterRanges(this, savedSel);
	// }
</script>

<Toasting bind:id={id} bind:text={toastMessage} />

<div class="flex" >
	<div class="m-2 w-10 py-1">
		<img class="inline-block h-10 w-10 rounded-full" src={picture} alt="avatar" />
	</div>
	<div class="flex-1 px-2 pt-2 mt-2 dark">
		<!-- {#if status === true}
			<span class="text-blue-300">Recording...</span>
		{/if} -->
		<TextStylingDiv bind:id={id} text={tweet} />

		{#if avatar}
			<div class="relative">
				<img class="w-full" src={avatar} alt="uploaded" />
				<button
					on:click={removeImage}
					class="absolute text-xs  top-0 bg-black text-white p-2 rounded  m-2">X</button
				>
			</div>
		{/if}
	</div>
</div>
<!--middle creat tweet below icons-->
<div class="flex">
	<div class="w-10" />

	<div class="w-64 px-2">
		<div class="flex items-center">
			<div class="flex-1 text-center px-1 py-1 m-2">
				<p
					on:click={() => {
						fileinput.click();
					}}
					class="mt-1 group flex items-center text-blue-400 px-2 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-blue-300"
				>
					<ion-icon class="h-7 w-7" name="image-outline" />
				</p>
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
				<p
					on:click={() => (showModal = !showModal)}
					class="mt-1 group flex items-center text-blue-400 px-2 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-blue-300"
				>
					<ion-icon class="h-7 w-7" name="happy-outline" />
				</p>
			</div>

			<!-- <div class="flex-1 text-center mt-4 m-2">
				<a
					class="btn hover:text-red-300 {status === false ? 'text-blue-400 ' : 'text-red-300 animate-pulse'} "
					href="./"
					on:click={status === false ? record : stop}
				>
					<ion-icon class="h-7 w-7 " name="mic" />
				</a>
			</div>

			<div class="flex-1 text-center mt-4 m-2">
				{#if recordings.length > 0}
					{#each recordings as recording, i}
						<Audiolist
							title={i + 1 + ': ' + recording.title}
							audio={recording.audio}
							on:deleterecording={() => deleteRecording(recording)}
						/>
					{/each}
				{/if}
			</div> -->
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
