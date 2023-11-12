<script>
    import { onMount } from "svelte";
    import Header from "$lib/component/Header.svelte";
    import Icon from "@iconify/svelte";
    import Description from "$lib/component/Description.svelte";
    import Carrousel from "$lib/component/Carousel.svelte";
    
    onMount(() => {
        description = document.getElementById("description");
    });

    let isScrolled = false;

    function scroll() {
        if (isScrolled)
        {
            const el = document.getElementById("picture");
            if (!el) return ;
            el.scrollIntoView({behavior: "smooth"});
            isScrolled = false;
        } else 
        {
            const el = document.getElementById("description");
            if (!el) return ;
            el.scrollIntoView({behavior: "smooth"});
            isScrolled = true;
        }
    }
</script>

<div class="h-screen flex flex-col">
    <Header />
    <div class="h-full overflow-y-scroll relative hideScroll">
        <div class="h-full">
            <Carrousel class="h-full w-full" context="profile" height="h-full" />
            <Description />
        </div>
        <div class="fixed bottom-0 w-full bg-black">
            <div class="flex flex-row justify-around">
                <button>
                    <Icon icon="ph:x-bold" class="text-[40px]" />
                </button>
                <button class={isScrolled ? "rotate-180": ""} on:click={scroll}>
                    <Icon icon="bi:arrow-up" class="text-[40px]" />
                </button>
                <button>
                    <Icon icon="ri:heart-line" class="text-[40px]" />
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    .hideScroll::-webkit-scrollbar { display: none; }
	.hidescroll {
  	-ms-overflow-style: none;  /* IE and Edge */
  	scrollbar-width: none;     /* Firefox */
	}
</style>