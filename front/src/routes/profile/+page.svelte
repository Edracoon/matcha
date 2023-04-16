<script>
	import { onMount } from "svelte";
	import Header from "$lib/component/Header.svelte";
	import Account from "$lib/component/Account.svelte";
	import Carousel from "$lib/component/Carousel.svelte";

	onMount(() => {});
</script>

<div class="h-screen flex flex-col">
    <div>
        <Header />
    </div>
    <div class="flex flex-col justify-center items-center h-full bg-dark border">
		<div class="flex flex-col bg-pink w-full sm:w-[500px] h-full">
			<Carousel height="h-1/2" context="account"/>
			<div class="w-full h-0 border" />
			<div class="h-1/2 bg-dark border overflow-scroll">
				<Account />
			</div>
		</div>	
    </div>
</div> 