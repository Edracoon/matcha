<style lang="postcss">
	.home {
		padding: 0.7rem 1.5rem;
	}
</style>

<script>
	import { goto } from "$app/navigation";
</script>

<div class="glob vflex flex-align-center text-center">
	<h1>Error 404</h1>
	<h2>Page Not Found !</h2>
	<button class="button home" on:click={() => goto('/')}>
		Home →
	</button>
</div>