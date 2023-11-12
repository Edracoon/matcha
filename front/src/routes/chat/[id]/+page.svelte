<script>
    import Header from "$lib/component/Header.svelte";
    import Icon from "@iconify/svelte";
    import { goto } from "$app/navigation";
    let messages = [
        {
            username: "test",
            message: "test",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test2",
            message: "test2",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test3",
            message: "test3",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test4",
            message: "test4",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test",
            message: "test",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test2",
            message: "test2",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test3",
            message: "test3",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test4",
            message: "test4",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test",
            message: "test",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test2",
            message: "test2",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test3",
            message: "test3",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test4",
            message: "test4",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test",
            message: "test",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test2",
            message: "test2",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test3",
            message: "test3",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test4",
            message: "test4",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test",
            message: "test",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test2",
            message: "test2",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test3",
            message: "test3",
            date: "12/12/12",
            time: "12:12:12",
        },
        {
            username: "test4",
            message: "test4",
            date: "12/12/12",
            time: "12:12:12",
        },
    ]

    let currMessage = "";
</script>

<div class="h-screen flex flex-col">
    <Header />
    <div class="h-full flex flex-col">
        <div class="w-full bg-transparent">
            <button on:click={() => {goto('/chat')}}>
                <Icon icon="pajamas:go-back" class="text-[40px]" />
            </button>
        </div>
        <div class="flex-grow overflow-y-hidden bg-pink">
            <div class="flex flex-col">
                {#each messages as message}
                    <div>{message.message}</div>
                {/each}
            </div>
        </div>
        <div class="flex flex-row w-full">
            <input class="flex-grow text-black" bind:value={currMessage} type="text" placeholder="Entrez votre message">
            <Icon icon="tabler:send" class="text-[40px]" />
        </div>
    </div>
</div>