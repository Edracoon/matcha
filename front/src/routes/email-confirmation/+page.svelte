<script>
    import { goto } from "$app/navigation";
    import "$lib/authentication/auth.scss";
    let code;

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
                <button>
                    Resend a code
                </button>
            </div>
        </div>
    </div>
</div>