<style>
	form {
		font-size: 17px;
		font-weight: bold;
	}

	input {
		color: #FAFAFD;
		font-size: 15px;
		width: 15rem;
		height: 2rem;
		border: 3px solid #FF6D7F;
		border-radius: 20px;
		background: #2f2f2f;
	}

	.error {
		color: rgb(250, 77, 77);
		font-size: 14px;
	}

	.minigap { gap: 0.2rem; }

	.cross {
		width: 20px;
		height: 20px;
		padding: 0;
	}

	.form-title {
		font-size: 30px;
	}
</style>

<script>
	import InputErrors from "../InputErrors.js";
	import SignInUser from "../models/SignInUser.js";
	import AuthService from "../services/AuthService.js";

	export let showed = true;

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
		errors.username = InputErrors.username(registerUser.username);
		errors.password = InputErrors.password(registerUser.password);

		// Check if there is an error, if so, return
		for (let prop in errors)
			if (errors[prop] !== "") return ;

		// If no errors then submit it for real
		AuthService.postSignIn(signInUser);
	}
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="card vflex gap flex-align-center">
	<div class="form-title">Sign In</div>
	<form class="vflex gap">
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
		<button class="button cross" on:click={() => showed = false}>X</button>
		<button class="button" on:click={() => submitSignIn()}>Sign in!</button>
	</div>
</div>
