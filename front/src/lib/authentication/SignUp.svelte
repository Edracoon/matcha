<script>
    import "./auth.scss";
    import InputErrors from "../InputErrors.js";
    import AuthService from "../services/auth.service.js";
    import { goto } from "$app/navigation";

    let signUpUser = {};
    let errors = {
        firstname: "",
        lastname: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    };

    function handleKeydown(event) {
        if (event.key === "Enter") submitSignUp();
    }

    async function submitSignUp() {
        console.log("test");
        errors.firstname = InputErrors.firstname(signUpUser.firstname);
        errors.lastname = InputErrors.lastname(signUpUser.lastname);
        errors.email = InputErrors.email(signUpUser.email);
        errors.username = InputErrors.username(signUpUser.username);
        errors.password = InputErrors.password(signUpUser.password);
        errors.confirmPassword = InputErrors.password(
            signUpUser.confirmPassword
        );
        if (signUpUser.password !== signUpUser.confirmPassword)
            errors.confirmPassword = "Passwords are not the same !";

        // Check if there is an error, if so, return
        for (let prop in errors) if (errors[prop] !== "") return;

        // If no errors then submit it for real
        let res = await AuthService.postSignUp(signUpUser);
        if (res.emailValidated === 0) goto('/email-confirmation');
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="card">
    <div class="form vflex text-left flex-align-center justify-between semigap">
        <h1>Sign Up</h1>
        <div class="vflex minigap">
            <span>First Name</span>
            <input type="text" bind:value={signUpUser.firstname} />
            <div class="error">{errors.firstname}</div>
        </div>
        <div class="vflex minigap">
            <span>Last Name</span>
            <input type="text" bind:value={signUpUser.lastname} />
            <div class="error">{errors.lastname}</div>
        </div>
        <div class="vflex minigap">
            <span>E-mail</span>
            <input type="text" bind:value={signUpUser.email} />
            <div class="error">{errors.email}</div>
        </div>
        <div class="vflex minigap">
            <span>Username (Used to sign in)</span>
            <input type="text" bind:value={signUpUser.username} />
            <div class="error">{errors.username}</div>
        </div>
        <div class="vflex minigap">
            <span>Password (Used to sign in)</span>
            <input type="password" bind:value={signUpUser.password} />
            <div class="error">{errors.password}</div>
        </div>
        <div class="vflex minigap">
            <span>Comfirm password</span>
            <input type="password" bind:value={signUpUser.confirmPassword} />
            <div class="error">{errors.confirmPassword}</div>
        </div>
        <div class="hflex gap flex-align-center">
            <button class="button btn-signup" on:click={() => submitSignUp()}
                >Sign up for free!</button
            >
        </div>
    </div>
    <div>
        <div class="anchor forgot-password" on:click={() => goto("/signIn")}>
            Already have an account ?
        </div>
    </div>
</div>

<style>
    .form {
        font-size: 15px;
    }
    input {
        width: 16rem;
    }
    span {
        padding: 2px 0px 5px;
    }

    .semigap {
        gap: 0.4rem;
    }
    .minigap {
        gap: 0.1rem;
    }

    .btn-signup {
        width: 16rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    .card {
        width: 500px;
        height: 750px;
    }

    .card::before {
        width: 500px;
        height: 750px;
    }

    .card::after {
        width: 500px;
        height: 750px;
    }
</style>
