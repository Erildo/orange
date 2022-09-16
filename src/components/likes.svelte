<script>
	import { supabase } from '$lib/supabaseClient';
	const user = supabase.auth.user();

	export let item;
	let likedByMe;
	let numberOfLikes = 0;
	async function like() {
		try {
			let { data, error, status } = await supabase.from('likes').select('*').eq('l_pid', item);

			if (error) throw error;
			if (data) {
				
				numberOfLikes = data.length;
                if(numberOfLikes > 0){
                if(data[0].l_uid === user.id && data[0].l_pid === item ){
                    likedByMe = true
                }
            }
			}
		} catch (error) {
			console.log(error);
		}
	}
	async function insertLike() {
		try {
			const { data, error } = await supabase.from('likes').insert([
				{
					l_uid: user.id,
					l_pid: item
				}
			]);
			if (error) throw error;
			likedByMe = true;
            await like()
		} catch (error) {
			console.log(error)
		}
	}
	async function deleteLike() {
		try {
			const { data, error } = await supabase
				.from('likes')
				.delete()
				.match({ l_pid: item, l_uid: user.id });

			if (error) throw error;
			likedByMe = false;
            await like()

		} catch (error) {
            console.log(error)

		}
	}
</script>

<div
	use:like
	class="flex-1 flex items-center {likedByMe === true ? 'text-red-400' : 'text-white' } text-xs text-gray-400 hover:text-red-600 transition duration-350 ease-in-out"
>
	<ion-icon
		on:click={likedByMe === true ? deleteLike : insertLike}
		class="h-5 w-5 mr-2"
		name="heart-outline"
	/>
	{numberOfLikes}
</div>
