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
	import RegisterUser from "../models/RegisterUser.js";
	import InputErrors from "../InputErrors.js";
	import AuthService from "../services/AuthService.js";

	export let showed = true;

	let registerUser = new RegisterUser();
	let errors = {
		firstname: "",
		lastname: "",
		email: "",
		username: "",
		password: "",
		password2: "",
	};

	function handleKeydown(event) {
		if (event.key === "Enter")
			submitRegister();
	}

	function submitRegister() {
		console.log("submitRegister ->", registerUser);
		errors.firstname = InputErrors.firstname(registerUser.firstname);
		errors.lastname = InputErrors.lastname(registerUser.lastname);
		errors.email = InputErrors.email(registerUser.email);
		errors.username = InputErrors.username(registerUser.username);
		errors.password = InputErrors.password(registerUser.password);
		errors.password2 = InputErrors.password(registerUser.password2);
		if (registerUser.password !== registerUser.password2)
			errors.password2 = "Passwords are not the same !";

		// Check if there is an error, if so, return
		for (let prop in errors) {
			if (errors[prop] !== "")
				return ;
		}

		// If no errors then submit it for real
		AuthService.postRegister(registerUser);
	}

</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="card vflex gap flex-align-center">
	<div class="form-title">Register</div>
	<form class="vflex gap">
		<div class="vflex minigap">
			<label for="firstname">First Name</label>
			<input type="text" name="firstname" id="firstname" bind:value={registerUser.firstname}>
			<div class="error">{ errors?.firstname }</div>
		</div>
		<div class="vflex minigap">
			<label for="lastname">Last Name</label>
			<input type="text" name="lastname" id="lastname" bind:value={registerUser.lastname}>
			<div class="error">{ errors?.lastname }</div>
		</div>
		<div class="vflex minigap">
			<label for="email">Email</label>
			<input type="text" name="email" id="email" bind:value={registerUser.email}>
			<div class="error">{ errors?.email }</div>
		</div>
		<div class="vflex minigap">
			<label for="username">Username (this will be used to login)</label>
			<input type="text" name="username" id="username" bind:value={registerUser.username}>
			<div class="error">{ errors?.username }</div>
		</div>
		<div class="vflex minigap">
			<label for="password">Password (this will be used to login)</label>
			<input type="password" name="password" id="password" bind:value={registerUser.password}>
			<div class="error">{ errors?.password }</div>
		</div>
		<div class="vflex minigap">
			<label for="password2">Same password</label>
			<input type="password" name="password2" id="password2" bind:value={registerUser.password2}>
			<div class="error">{ errors?.password2 }</div>
		</div>
	</form>
	<div class="hflex gap flex-align-center">
		<button class="button cross" on:click={() => showed = false}>X</button>
		<button class="button" on:click={() => submitRegister()}>Register me!</button>
	</div>
</div>
