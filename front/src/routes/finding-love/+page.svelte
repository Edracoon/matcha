<script>
    import { onMount } from "svelte";
    import Header from "$lib/component/Header.svelte";
    import Profile from "$lib/component/Profile.svelte";

    onMount(() => {});
</script>

<div class="h-screen flex flex-col">
    <div>
        <Header />
    </div>
    <div class="flex flex-grow justify-center items-center h-full bg-pink">
        <Profile />
    </div>
</div>
