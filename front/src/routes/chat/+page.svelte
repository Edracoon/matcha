<script>
    import Header from "$lib/component/Header.svelte";
    import { goto } from "$app/navigation";

    let chatopen = false;


    let falseliked = [
        {
            username: "test",
        },
        {
            username: "test2",
        },
        {
            username: "test3",
        },
        {
            username: "test4",
        }
    ]
</script>

<div class="h-full">
    <Header />
    <div class='flex flex-col h-full overflow-scroll'>
        {#each falseliked as liked}
            <div class="h-0 border w-full"></div>
                <div class="flex justify-center text-lg w-full my-3">
                    <button on:click={() => {goto('/chat/12')}}>
                        {liked.username}
                    </button>
                </div>
            <div class="h-0 border w-full"></div>
        {/each}
    </div>
</div>