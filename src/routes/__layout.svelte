<script>
	import LoginStatusBox from '$lib/components/LoginStatusBox.svelte';
	import Nav from '$lib/components/Nav.svelte';
</script>
<div>
	<Nav />
</div>
<div>
	<main>
		<slot />
	</main>
</div>



