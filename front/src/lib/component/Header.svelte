<script>
    import { onMount } from "svelte";
    import SvgAccount from "$lib/svg/svgAccount.svelte";
    import SvgChat from "$lib/svg/svgChat.svelte";
    onMount(() => {});
</script>

<div class="flex w-full h-20 border items-center justify-between px-4">
    <div>MATCHA</div>
    <div class="flex flex-row gap-5">
        <SvgChat />
        <SvgAccount />
    </div>
</div>
