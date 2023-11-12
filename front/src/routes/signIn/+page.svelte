<script>
	import SignIn from "$lib/authentication/SignIn.svelte";
    import { goto } from "$app/navigation";
</script>

<div class="glob vflex flex-align-center justify-between text-center ">
    <SignIn></SignIn>
    <div class="hflex flex-align-center gap">
        <p class="font-[17px]">Don't have an account yet ?</p>
        <button class="button !p-2" on:click={() => goto('/signUp')}>Sign Up →</button>
    </div>
</div>