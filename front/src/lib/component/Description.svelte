<script>
    import { onMount } from "svelte";
    import Header from "$lib/component/Header.svelte";
    import Icon from "@iconify/svelte";
	import Carousel from "$lib/component/Carousel.svelte";
    onMount(() => {});

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

<div id="description" class="bg-pink flex flex-col pb-10">
    <span class="my-3 text-2xl">Description</span>
    <div class="w-full h-0 border my-2" />
    <span class="text-lg">Name : {current.name}</span>
    <span class="text-lg">Age : {current.age}</span>
    <span class="text-lg">Distance : {current.distance}</span>
    <div class="w-full h-0 border my-2" />
    <div class="flex flex-col my-3">
        <span class="text-lg">About me :</span>
        <span class="text-lg">{current.description} </span>
    </div>
    <div class="flex flex-col">
        <span class="text-lg">Tags :</span>
        <div class="flex flex-wrap gap-2">
            {#each current.tags as tag}
                <div class="rounded-lg text-[20px] px-2 bg-orange-600">
                    {getEmoji(tag) + " "}{tag}
                </div>
            {/each}
        </div>
    </div>
</div>