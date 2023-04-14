<script>
	import SignUp from "$lib/authentication/SignUp.svelte";
	import SignIn from "$lib/authentication/SignIn.svelte";

	let isSignIn = true;

	function invert() {
		isSignIn = !isSignIn;
	}
</script>

<div class="glob vflex flex-align-center justify-between text-center ">
	{#if isSignIn}
		<SignIn></SignIn>
		<div class="hflex flex-align-center gap">
			<p class="font-[17px]">Don't have an account yet ?</p>
			<button class="button !p-2" on:click={() => invert()}>Sign Up →</button>
		</div>
	{:else}
		<SignUp></SignUp>
		<div class="hflex flex-align-center gap">
			<p class="font-[17px]" >Already have an account ?</p>
			<button class="button !p-2" on:click={() => invert()}>Sign in →</button>
		</div>
	{/if}
</div>
