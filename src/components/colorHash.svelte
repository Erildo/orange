<script>
	import jQuery from 'jquery';

	export let text;
	import { onMount } from 'svelte';
	onMount(async () => {
		jQuery(document).ready(function () {
            jQuery('p').html(function (_, html) {
			return html.replace(/(\#\w+)/g, '<span class="text-blue-200">$1</span>');
		});
	});
	});
	
</script>

<p class="text-base width-auto text-white flex-shrink font-helvetica">
	{text}
</p>
