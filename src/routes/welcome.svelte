<script>
	// @ts-nocheck
	import { supabase } from '$lib/supabaseClient';
	let loading = false;
	let error;

	async function twitterAuth() {
		try {
			loading = true;
			const { user, session, error } = await supabase.auth.signIn({
				provider: 'twitter'
			});

			if (error) throw error;
		} catch (error) {
			alert(error.error_description || error.message);
		} finally {
			loading = false;
		}
	}

	let showMenu = false;
	function toggle() {
		showMenu = !showMenu;
	}
	let screenWidth;
</script>

<div class="grid md:grid-cols-2 sm:grid-clos-1 bg-black">
	<div name="left">
		<section class="bg-gray-100 dark:bg-gray-900">
			<div class="flex flex-col items-center px-2  md:h-screen lg:py-0">
				<div
					class="w-full bg-white rounded-lg shadow dark:border md:mt-24 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
				>
					<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1
							class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
						>
							Welcome 👋
						</h1>
						<button on:click={twitterAuth}
							class="w-full text-center py-3 my-3 border flex space-x-2 items-center 
							justify-center border-slate-200 rounded-lg text-blue-400 
							hover:border-orange-200 hover:text-orange-200 hover:shadow transition duration-150"
						>
							<svg
								class="mr-2 -ml-1 w-5 h-5 "
								aria-hidden="true"
								focusable="false"
								data-prefix="fab"
								data-icon="twitter"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 512 512"
								><path
									fill="currentColor"
									d="M459.4 151.7c.325 4.548 .325 9.097 .325 13.65 0 138.7-105.6 298.6-298.6 298.6-59.45 0-114.7-17.22-161.1-47.11 8.447 .974 16.57 1.299 25.34 1.299 49.06 0 94.21-16.57 130.3-44.83-46.13-.975-84.79-31.19-98.11-72.77 6.498 .974 12.99 1.624 19.82 1.624 9.421 0 18.84-1.3 27.61-3.573-48.08-9.747-84.14-51.98-84.14-102.1v-1.299c13.97 7.797 30.21 12.67 47.43 13.32-28.26-18.84-46.78-51.01-46.78-87.39 0-19.49 5.197-37.36 14.29-52.95 51.65 63.67 129.3 105.3 216.4 109.8-1.624-7.797-2.599-15.92-2.599-24.04 0-57.83 46.78-104.9 104.9-104.9 30.21 0 57.5 12.67 76.67 33.14 23.72-4.548 46.46-13.32 66.6-25.34-7.798 24.37-24.37 44.83-46.13 57.83 21.12-2.273 41.58-8.122 60.43-16.24-14.29 20.79-32.16 39.31-52.63 54.25z"
								/></svg
							>
							Get in with Twitter
						</button>
						<form class="space-y-4 md:space-y-6" action="#">
							<div>
								<label
									for="email"
									class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>Your email</label
								>
								<input
									type="email"
									name="email"
									id="email"
									class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="name@company.com"
									required=""
								/>
							</div>
							<div>
								<label
									for="password"
									class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>Password</label
								>
								<input
									type="password"
									name="password"
									id="password"
									placeholder="••••••••"
									class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required=""
								/>
							</div>
							<div>
								<label
									for="confirm-password"
									class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>Confirm password</label
								>
								<input
									type="confirm-password"
									name="confirm-password"
									id="confirm-password"
									placeholder="••••••••"
									class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required=""
								/>
							</div>

							<div class="flex items-start">
								<div class="flex items-center h-5">
									<input
										id="terms"
										aria-describedby="terms"
										type="checkbox"
										class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
										required=""
									/>
								</div>
								<div class="ml-3 text-sm">
									<label for="terms" class="font-light text-gray-500 dark:text-gray-300"
										>I accept the <a
											class="font-medium text-primary-600 hover:underline dark:text-primary-500"
											href="/">Terms and Conditions</a
										></label
									>
								</div>
							</div>
							<button
								type="submit"
								class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800"
								>Create an account</button
							>
							<p class="text-sm font-light text-gray-500 dark:text-gray-400">
								Already have an account? <a
									href="/"
									class="font-medium text-blue-600 hover:underline dark:text-primary-500"
									>Login here</a
								>
							</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	</div>
	<div name="right hidden visible md:invisible" >
	
		<img src="./src/images/sound.gif"  alt="sound" />
	</div>
</div>
