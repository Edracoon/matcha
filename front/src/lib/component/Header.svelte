<script>
    import { onMount } from "svelte";
    import SvgAccount from "$lib/svg/svgAccount.svelte";
    import SvgChat from "$lib/svg/svgChat.svelte";
    import { goto } from "$app/navigation";
    import Icon from "@iconify/svelte";

</script>

<div class="flex w-full h-20 border items-center justify-between px-4">
    <button class="cursor" on:click={() => goto('/home')}>MATCHA</button>
    <div class="flex flex-row gap-5">
        <button on:click={() => {goto('chat')}}>
            <SvgChat />
        </button>
        <button>
            <Icon icon="material-symbols:settings" class="text-[50px]"/>
        </button>
        <button on:click={() => {goto('/profile')}}>
            <SvgAccount />
        </button>
    </div>
</div>
