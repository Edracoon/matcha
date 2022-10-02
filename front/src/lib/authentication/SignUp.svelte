<style>
	form {
		font-size: 15px;
		font-weight: bold;
	}

	input {
		color: #FAFAFD;
		font-size: 13px;
		width: 18rem;
		height: 1.8rem;
		border: 2px solid #FF6D7F;
		border-radius: 10px;
		background: #2f2f2f;
	}

	.btn-signup { width: 18rem }

	.error {
		color: rgb(250, 77, 77);
		font-size: 14px;
	}

	.minigap { gap: 0.2rem; }
</style>

<script>
	import SignUpUser from "../models/SignUpUser.js";
	import InputErrors from "../InputErrors.js";
	import AuthService from "../services/AuthService.js";

	let signUpUser = new SignUpUser();
	let errors = {
		firstname: "",
		lastname: "",
		email: "",
		username: "",
		password: "",
		confirmPassword: "",
	};

	function handleKeydown(event) {
		if (event.key === "Enter")
			submitSignUp();
	}

	function submitSignUp() {
		console.log("submitSignUp ->", signUpUser);
		errors.firstname = InputErrors.firstname(signUpUser.firstname);
		errors.lastname = InputErrors.lastname(signUpUser.lastname);
		errors.email = InputErrors.email(signUpUser.email);
		errors.username = InputErrors.username(signUpUser.username);
		errors.password = InputErrors.password(signUpUser.password);
		errors.confirmPassword = InputErrors.password(signUpUser.confirmPassword);
		if (signUpUser.password !== signUpUser.confirmPassword)
			errors.confirmPassword = "Passwords are not the same !";

		// Check if there is an error, if so, return
		for (let prop in errors)
			if (errors[prop] !== "") return ;

		// If no errors then submit it for real
		AuthService.postSignUp(signUpUser);
	}

</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="vflex flex-align-center gap">
	<form class="vflex gap text-left">
		<div class="vflex minigap">
			<label for="firstname">First Name</label>
			<input type="text" name="firstname" id="firstname" bind:value={signUpUser.firstname}>
			<div class="error">{ errors.firstname }</div>
		</div>
		<div class="vflex minigap">
			<label for="lastname">Last Name</label>
			<input type="text" name="lastname" id="lastname" bind:value={signUpUser.lastname}>
			<div class="error">{ errors.lastname }</div>
		</div>
		<div class="vflex minigap">
			<label for="email">E-mail</label>
			<input type="text" name="email" id="email" bind:value={signUpUser.email}>
			<div class="error">{ errors.email }</div>
		</div>
		<div class="vflex minigap">
			<label for="username">Username (Used to sign in)</label>
			<input type="text" name="username" id="username" bind:value={signUpUser.username}>
			<div class="error">{ errors.username }</div>
		</div>
		<div class="vflex minigap">
			<label for="password">Password (Used to sign in)</label>
			<input type="password" name="password" id="password" bind:value={signUpUser.password}>
			<div class="error">{ errors.password }</div>
		</div>
		<div class="vflex minigap">
			<label for="confirmPassword">Comfirm password</label>
			<input type="password" name="confirmPassword" id="confirmPassword" bind:value={signUpUser.confirmPassword}>
			<div class="error">{ errors.confirmPassword }</div>
		</div>
	</form>
	<div class="hflex gap flex-align-center">
		<button class="button btn-signup" on:click={() => submitSignUp()}>Sign up for free!</button>
	</div>
</div>
