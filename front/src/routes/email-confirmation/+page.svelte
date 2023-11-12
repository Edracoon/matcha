<script>
    import { goto } from "$app/navigation";
    import "$lib/authentication/auth.scss";
    import AccountService from "$lib/services/account.service.js";
    let code;

    async function submitCode() {
        let res = await AccountService.postEmailCode(code);
        console.log(res);
        if (res === true) goto("/home");
    }

</script>

<div class="glob vflex flex-align-center justify-between text-center semigap">
    <div class="card">
        <div class="form vflex text-left flex-align-center">
            <h1>Sign Up</h1>
            <div class="vflex minigap">
                <span>Code send by email</span>
                <input type="text" bind:value={code} />
            </div>
            <div class="vflex minigap mt-4">
                <button on:click={async () => {await submitCode()}}>
                    send
                </button>
            </div>
        </div>
    </div>
</div>