<script>
	import jQuery from 'jquery';
	import { tick } from 'svelte';

	export let text;
	let div, html;

		$: (async () => {

			// if (!window.rangy) return;
			// let sel = rangy.getSelection();
			// let savedSel = sel.saveCharacterRanges(div);
			// html = text.replace(/(^|\s)(#\w+)/g, " <span class='text-blue-300'>$2</span>");
			// await tick();
			// sel.restoreCharacterRanges(div, savedSel);
            

		})();

</script>
<div
 id="test" 
	bind:this={div}
	bind:innerHTML={html}
	bind:textContent={text}
    
	contenteditable="true"
	class="post-input-field  block p-2.5 w-full h-24
            rounded-lg border text-white focus:outline-none focus:ring
            bg-gray-700 border-gray-600 placeholder-gray-400
            hover:border-blue-600"
	style="display: flex;
    "
> Whats up
</div>
