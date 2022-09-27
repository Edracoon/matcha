<style>
	form {
		font-size: 17px;
		font-weight: bold;
	}

	.btn-signin { width: 18rem }

	input {
		color: #FAFAFD;
		font-size: 15px;
		width: 18rem;
		height: 2rem;
		border: 2px solid #FF6D7F;
		border-radius: 10px;
		background: #2f2f2f;
	}

	.minigap { gap: 0.2rem; }
	.forgot-password { font-size: 15px; }
</style>

<script>
	import InputErrors from "../InputErrors.js";
	import SignInUser from "../models/SignInUser.js";
	import AuthService from "../services/AuthService.js";
	import { goto } from '$app/navigation';

	let signInUser = new SignInUser();
	let errors = {
		username: "",
		password: ""
	};

	function handleKeydown(event) {
		if (event.key === "Enter")
			submitSignIn();
	}

	function submitSignIn() {
		console.log("submitSignIn ->", signInUser);
		errors.username = InputErrors.username(signInUser.username);
		errors.password = InputErrors.password(signInUser.password);

		// Check if there is an error, if so, return
		for (let prop in errors)
			if (errors[prop] !== "") return ;

		// If no errors then submit it for real
		AuthService.postSignIn(signInUser);
	}
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="vflex gap flex-align-center gap">
	<form class="vflex gap text-left">
		<div class="vflex minigap">
			<label for="username">Username</label>
			<input type="text" name="username" id="username" bind:value={signInUser.username}>
			<div class="error">{ errors.username }</div>
		</div>
		<div class="vflex minigap">
			<label for="password">Password</label>
			<input type="password" name="password" id="password" bind:value={signInUser.password}>
			<div class="error">{ errors.password }</div>
		</div>
	</form>
	<div class="hflex gap flex-align-center">
		<button class="button btn-signin" on:click={() => submitSignIn()}>Sign in!</button>
	</div>
	<div class="anchor forgot-password" on:click={() => goto('/forgot-password')}>You forgot your password ?</div>
</div>
