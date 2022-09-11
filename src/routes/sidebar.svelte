<script>
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { supabase } from '$lib/supabaseClient';
	import Toast, { showToast } from './toast.svelte';
	import SmNav from './smNav.svelte';
	import Main from './main.svelte';
	import Profile from './profile.svelte';

	let showCreate;
	const sessions = supabase.auth.session();
	const user = supabase.auth.user();
	let msg = '';
	const user_name = sessions.user.identities[0].identity_data.user_name;
	const name = sessions.user.identities[0].identity_data.name;
	const picture = sessions.user.identities[0].identity_data.picture;
	let loading = false;
	let elements = [
		{ icon: 'planet-outline', name: 'Home', component: Main },
		{ icon: 'compass-outline', name: 'Explore', component: Main },
		{ icon: 'notifications-outline', name: 'Notifications', component: Main },
		{ icon: 'chatbubbles-outline', name: 'Messages', component: Main },
		{ icon: 'person-outline', name: 'Profile', component: Profile }
	];
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	async function getProfile() {
		try {
			let { data, error, status } = await supabase
				.from('profiles')
				.select('p_id')
				.eq('p_id', user.id);

			if (error) throw error;
			if (data.length === 0) {
				showCreate = false;
				await sleep(1000);
				loading = true;
				await createAccount();
				await sleep(2000);
				loading = false;
				showCreate = true;
			}
		} catch (error) {
			console.log(error);
		}
	}
	async function createAccount() {
		try {
			const { data, error } = await supabase.from('profiles').insert([
				{
					p_id: user.id,
					name: name,
					user_name: user_name,
					picture: picture
				}
			]);
			if (error) throw error;
		} catch (error) {
			// alert(error.message);
		}
	}
	let id = 'first';
	async function signout() {
		msg = 'Goodbey and see you soon!';
		showToast(id);

		await sleep(1000);

		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			goto('./');
		} catch (error) {
			// console.log(error);
		}
	}

	let screenWidth;

	export let mainPage = Main;
</script>

<Toast bind:id bind:text={msg} />

<div style="width: 300px; " class="hidden md:block ">
	<div class="overflow-y-auto fixed h-screen pr-3" style="width: 300px;">
		<!--Logo-->
		<svg viewBox="0 0 24 24" class="h-8 w-8 text-white ml-3" fill="currentColor">
			<g>
				<path
					d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"
				/>
			</g>
		</svg>

		<!-- Nav-->
		<nav class="mt-5 px-2">
			{#each elements as element, i}
				<a	value={element.component}
					on:click={() => {
						mainPage = element.component;
					}}
					href="./"
					class=" mt- 1 group flex items-center px-2 py-2 text-base leading-10  font-roboto rounded-full bg-gray-800 text-white hover:text-blue-300"
				>
					<ion-icon class="mr-2 h-6 w-6 " name={element.icon} />
					{element.name}
				</a>
			{/each}

			<button
				class="bg-blue-400 hover:bg-blue-500 w-full mt-5 text-white font-bold py-2 px-4 rounded-full"
			>
				Tweet
			</button>
		</nav>

		<!-- User Menu -->
		<div class="absolute" style="bottom: 2rem;" use:getProfile>
			{#if showCreate == false}
				<div
					id="toast-message-cta"
					class="p-2 w-full max-w-xs text-black bg-gray-100 rounded-lg shadow dark:bg-gray-800 dark:text-gray-400"
					role="alert"
				>
					<div class="flex ">
						<img
							class="w-10 h-10 rounded-full shadow-lg"
							src="/src/images/cat.jpg"
							alt="Lovely cat"
						/>

						<div class="ml-3 text-sm font-normal">
							<span class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Catsy</span>

							{#if loading == true}
								<div class="mb-2 text-sm font-normal">Thank you and enjoy it!</div>
							{:else}
								<div class="mb-2 text-sm font-normal">
									Hi {name},<br /> We are creating your account!
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}
			<div class="flex-shrink-0 flex hover:bg-gray-800 rounded-full px-4 py-3 mt-12 mr-2">
				<a href="./" class="flex-shrink-0 group block">
					<div class="flex items-center">
						<div>
							<img class="inline-block h-10 w-10 rounded-full" src={picture} alt="" />
						</div>
						<div class="ml-3">
							<div class="flex flex-row mb-1">
								<p class="text-base leading-6 font-medium text-white">{name}</p>
								<button class="text-white  ml-7">
									<ion-icon
										on:click={signout}
										class=" h-6 w-6 opacity-50 hover:opacity-100 "
										name="log-out-outline"
									/>
								</button>
							</div>
							<p
								class="text-sm leading-5 font-medium text-gray-400  transition ease-in-out duration-150"
							>
								@{user_name}
							</p>
						</div>
					</div>
				</a>
			</div>
		</div>
	</div>
</div>
<svelte:window bind:innerWidth={screenWidth} />
{#if screenWidth < 770}
	<SmNav />
{/if}
