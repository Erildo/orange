<script>
	import { getAudioData, linearPath, polarPath } from './file.min.js';
	import { onMount } from 'svelte';

	// onMount(async () => {

	async function AudioPath(file) {
		const audioData = await getAudioData(file);

		const example18 = polarPath(audioData, {
			samples: 90,
			type: 'steps',
			left: 200,
			top: 200,
			distance: 100,
			length: 100,
			animation: true,
			paths: [
				{ d: 'L', sdeg: 0, sr: 0, edeg: 0, er: 90 },
				{ d: 'A', sdeg: 0, sr: 90, edeg: 100, er: 90, rx: 5, ry: 5, angle: 100, arc: 1, sweep: 1 },
				{ d: 'L', sdeg: 100, sr: 90, edeg: 100, er: 0 }
			]
		});
		document.querySelector('#example18 path animate').setAttribute('values', example18);
	}

	// });
	// async function start() {

	AudioPath('https://jerosoler.github.io/waveform-path/hello_world.ogg');
	// }
</script>

<!-- <button class="bg-white text-black" on:click={start}>Play</button> -->
<svg class="round" id="example18" height="100px" width="200px" rounded>
	<defs>
		<radialGradient id="rgrad" cx="50%" cy="50%" r="50%">
			<stop offset="0%" style="stop-color:rgb(0,255,10);stop-opacity:1.00" />
			<stop offset="25%" style="stop-color:rgb(0,188,212);stop-opacity:0.70" />
			<stop offset="50%" style="stop-color:rgb(238,130,238);stop-opacity:1.00" />
			<stop offset="75%" style="stop-color:rgb(103,58,183);stop-opacity:0.70" />
			<stop offset="100%" style="stop-color:rgb(233,30,99);stop-opacity:1.00" />
		</radialGradient>
	</defs>
	<path style=" stroke:url(#rgrad); stroke-width: 2px; fill: none; ">
		<animate attributeName="d" dur="2.54s" repeatCount="indefinite" calcMode="linear" values="" />
	</path>
</svg>

<style>
	svg {
		transform: scale(var(--scale));
	}

	svg.round {
		transform: scale(var(--scale-round));
		background-image: url('./src/images/cat.jpg');
  
	}
</style>
