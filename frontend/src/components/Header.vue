<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useUser } from '@/stores/user.ts';

const userStore = useUser();
</script>

<template>
	<header class="m-4">
		<nav
			class="decoration-primary-500 flex items-center gap-4 text-xl font-bold decoration-2 underline-offset-3"
		>
			<img src="/favicon.svg" alt="" class="h-10 w-10" />

			<RouterLink to="/" activeClass="text-primary-500" class="hover:underline">Home</RouterLink>
			<RouterLink
				v-if="userStore.isLoggedIn"
				to="/upload"
				activeClass="text-primary-500"
				class="hover:underline"
			>
				Upload
			</RouterLink>
			<RouterLink to="/about" activeClass="text-primary-500" class="hover:underline">
				About
			</RouterLink>
		</nav>
	</header>
</template>

<style scoped></style>
