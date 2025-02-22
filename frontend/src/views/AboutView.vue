<script setup lang="ts">
import LoginButton from '@/components/LoginButton.vue';
</script>

<template>
	<main class="m-4">
		<small class="flex items-center gap-1.5">
			Made by
			<a
				href="https://github.com/Bladesheng/drakthul-jelita"
				target="_blank"
				class="inline-flex items-center gap-1 text-blue-500"
			>
				<img src="/github-mark-white.svg" class="h-5" alt="github-mark" />

				Bladesheng
			</a>
		</small>
	</main>

	<LoginButton />
</template>

<style scoped></style>
