<script>
    import { createEventDispatcher } from "svelte";
  
    const dispatch = createEventDispatcher();
  
    export let title;
    export let audio;
    
  </script>
  
  <div class="flex flex-row">
    <span class="hidden">{title}</span>
    <div class="player">

    <audio controls src={audio} class="bg-black"/>
    </div>
    <button class="text-red-500" on:click={() => dispatch("deleterecording")}
      ><ion-icon class="h-5 w-5 " name="close-circle-outline"></ion-icon></button
    >
  </div>
  
 <style>
  .player{
    background-color: #222;

  }
 </style>