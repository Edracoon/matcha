<script>
	import "./auth.scss";
	import { goto } from '$app/navigation';
	import InputErrors from "$lib/InputErrors.js";
	import AuthService from "$lib/services/auth.service.js";

    let signInUser = {
        username: "",
        password: ""
    };

	let errors = {
		username: "",
		password: ""
	};

	function handleKeydown(event) {
		if (event.key === "Enter")
			submitSignIn();
	}

	async function submitSignIn() {
		// errors.username = InputErrors.username(username);
		// errors.password = InputErrors.password(password);

		// Check if there is an error, if so, return
		for (let prop in errors)
			if (errors[prop] !== "") return ;

		// If no errors then submit it for real
		let res = await AuthService.postSignIn(signInUser);
        if (res === "success")
            goto('/home');
	}
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="card">
	<div class="form vflex flex-align-center gap">
		<div class="vflex gap text-left flex-align-center">
			<h1>matcha</h1>
			<div class="vflex minigap">
				<span>Username</span>
				<input type="text" spellcheck="false" bind:value={signInUser.username}>
				<div class="error">{ errors.username }</div>
			</div>
			<div class="vflex minigap">
				<span>Password</span>
				<input type="password" spellcheck="false" bind:value={signInUser.password}>
				<div class="error">{ errors.password }</div>
			</div>
		</div>
		<div class="hflex gap flex-align-center">
			<button class="button btn-signin" on:click={async () => await submitSignIn()}>Sign in!</button>
		</div>
		<div class="anchor forgot-password" on:click={() => goto('/forgot-password')}>You forgot your password ?</div>
	</div>
</div>
