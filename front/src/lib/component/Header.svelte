<script>
    import { onMount } from "svelte";
    import SvgAccount from "$lib/svg/svgAccount.svelte";
    import SvgChat from "$lib/svg/svgChat.svelte";
    import { goto } from "$app/navigation";
    import Icon from "@iconify/svelte";
    import AccountService from "$lib/services/account.service.js"

    let currentRoute = '';

    onMount(async () => {
        if (typeof window !== 'undefined') {
            currentRoute = window.location.pathname;
            let route = await AccountService.getRedirectUrl(currentRoute);
            console.log(route);
            goto(route);
            console.log(currentRoute);
        }
    });

</script>

<div class="flex w-full h-20 border items-center justify-between px-4">
    <button class="cursor" on:click={() => goto('/home')}>MATCHA</button>
    <div class="flex flex-row gap-5">
        <button on:click={() => {goto('/chat')}}>
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
