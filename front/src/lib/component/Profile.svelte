<script>
    import { onMount } from "svelte";
    import Header from "$lib/component/Header.svelte";
    import Icon from "@iconify/svelte";
	import Carousel from "$lib/component/Carousel.svelte";
    onMount(() => {});

    let height = 0;
    let popup = false;
    let current = {
        name: "Name",
        age: 21,
        distance: 5,
        description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        tags: [
            "Sports",
            "Travel",
            "Arts",
            "Food",
            "Books",
            "Video games",
            "Nature",
            "Technology",
            "History",
            "Fashion",
            "Pets",
            "Cars",
            "Film",
            "Business",
            "Spirituality",
            "Music",
            "Politics",
        ],
    };
    function toggleHeight() {
        height = height === 0 ? 400 : 0;
        popup = !popup;
    }

    function getEmoji(tag) {
        switch (tag) {
            case "Sports":
                return "🏀";
            case "Travel":
                return "🌍";
            case "Arts":
                return "🎨";
            case "Food":
                return "🍔";
            case "Books":
                return "📚";
            case "Video games":
                return "🎮";
            case "Nature":
                return "🌲";
            case "Technology":
                return "📱";
            case "History":
                return "📜";
            case "Fashion":
                return "👗";
            case "Pets":
                return "🐶";
            case "Cars":
                return "🚗";
            case "Film":
                return "🎬";
            case "Business":
                return "💼";
            case "Spirituality":
                return "🧘";
            case "Music":
                return "🎵";
            case "Politics":
                return "🗳️";
            default:
                return "❓"; 
        }
    }
</script>

<div class="w-[400px] bg-transparent h-full flex flex-col justify-between border">
    <div id="parent" class="flex-grow relative overflow-hidden">
        <!-- <div class="bg-purple-800 h-full relative flex flex-row"> -->
		<Carousel class="h-full relative flex flex-row" context="profile" height="h-full" />
		<div class="flex w-full gap-16 pb-4 bg-transparent absolute bottom-0 left-0 justify-center">
			<button class="text-center bg-red-500 flex justify-center rounded-full h-16 w-16 items-center">
				<Icon icon="ph:x-bold" class="text-[40px]" />
			</button>
			<button class="text-center bg-green-500 flex justify-center rounded-full h-16 w-16 items-center">
				<Icon icon="ri:heart-line" class="text-[40px]" />
			</button>
		</div>
        <div class="flex absolute bottom-0 h-20 w-full z-10 bg-transparent justify-end px-5">
            <button on:click={toggleHeight}>
                <Icon icon="ic:outline-bookmark-border" class="text-[40px]" />
            </button>
        </div>
        <div class="flex flex-col absolute bottom-0 bg-blue-800 w-full h-0 overflow-hidden overflow-y-scroll transition-all duration-500 scrollbar-hide" style="height: {height}px;">
            <div class="p-4">
                <div class="flex flex-col">
                    <div class="flex w-full gap-5">
                        <div class="text-[50px] font-bold">{current.name}</div>
                        <div class="text-[50px]">{current.age}</div>
                    </div>
                    <div class="text-[15px]">
                        {current.distance}
                        {#if current.distance == 1}
                            Kilometer
                        {:else}
                            Kilometers
                        {/if}
                    </div>
                </div>
            </div>
            <div class="border h-0 w-full" />
            <div class="p-4 w-full">
                <div class="text-[20px] font-bold">Tags</div>
                <div class="flex flex-wrap gap-3">
                    {#each current.tags as tag}
                        <div class="bg-gray-500 rounded-lg text-[20px] px-2">
                            {getEmoji(tag) + " "}{tag}
                        </div>
                    {/each}
                </div>
            </div>
            <div class="border h-0 w-full" />
            <div class="p-4 w-full">
                <div class="text-[20px] font-bold">Description</div>
                <div>{current.description}</div>
            </div>
            <div class="border h-0 w-full" />
        </div>
    </div>
</div>

<style>
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }

    /* For IE, Edge and Firefox */
    .scrollbar-hide {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }

	.parent .child {
		position: relative;
	}
</style>
