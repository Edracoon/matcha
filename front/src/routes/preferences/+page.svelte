<script>
	import { onMount } from "svelte";
	import Header from "$lib/component/Header.svelte";
	import Question from "$lib/component/Question.svelte";
	import Icon from "@iconify/svelte";

	onMount(() => {});
</script>

<div class="h-screen flex flex-col">
    <div>
        <Header />
    </div>
    <div class="w-full flex flex-grow justify-center items-center h-full bg-pink">
        <Question />
    </div>
</div>