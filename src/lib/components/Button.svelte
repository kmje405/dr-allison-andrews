<script lang="ts">
	let { label, disabled = false } = $props();
</script>

<button class="btn" {disabled}>{label}</button>

<style>
	.btn {
		padding: 0.5rem 0.5rem;
	}
</style>
