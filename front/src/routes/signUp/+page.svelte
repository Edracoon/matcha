<script>
	import SignUp from "$lib/authentication/SignUp.svelte";
	import SignIn from "$lib/authentication/SignIn.svelte";
    import { goto } from "$app/navigation";
</script>

<div class="glob vflex flex-align-center justify-between text-center ">
    <SignUp></SignUp>
    <div class="hflex flex-align-center gap">
        <p class="font-[17px]" >Already have an account ?</p>
        <button class="button !p-2" on:click={() => goto('/signIn')}>Sign in →</button>
    </div>
</div>