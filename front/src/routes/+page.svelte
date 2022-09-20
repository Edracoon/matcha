<script>
	import Register from "$lib/authentication/Register.svelte";
	import SignIn from "$lib/authentication/SignIn.svelte";

	const title = "matcha";

	let isSignin = false;
	let isRegister = false;

	function showSignin() {
		isSignin = true;
		isRegister = false;
	}
	function showRegister() {
		isSignin = false;
		isRegister = true;
	}

</script>

<div class="flex-align-center glob">
	<div class="vflex flex-align-center gap">
		<h1>{ title }</h1>
		{#if !isSignin && !isRegister}
			<div class="vflex gap">
				<button class="button" on:click={() => showSignin()}>Sign In</button>
				<button class="button" on:click={() => showRegister()}>Register</button>
			</div>
		{:else if isRegister}
			<Register bind:showed={isRegister}></Register>
		{:else if isSignin}
			<SignIn bind:showed={isSignin}></SignIn>
		{/if}
	</div>
</div>
