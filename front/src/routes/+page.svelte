<script>
	import SignUp from "$lib/authentication/SignUp.svelte";
	import SignIn from "$lib/authentication/SignIn.svelte";
    import { onMount } from "svelte";
    import AuthService from "../lib/services/auth.service.js";
    import { goto } from "$app/navigation";

    onMount(async () => {
        if (!localStorage.getItem("token"))
            goto('signUp');
        let res = await AuthService.getVerifyToken();
        if (res === "success") goto("/home");
    });
</script>
