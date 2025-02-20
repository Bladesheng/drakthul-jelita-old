<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useUser } from '@/stores/user.ts';

const userStore = useUser();
</script>

<template>
	<header v-if="userStore.isLoggedIn" class="m-4">
		<nav
			class="decoration-primary-500 flex gap-4 text-xl font-bold decoration-2 underline-offset-3"
		>
			<RouterLink to="/" activeClass="text-primary-500" class="hover:underline">Home</RouterLink>
			<RouterLink to="/upload" activeClass="text-primary-500" class="hover:underline">
				Upload
			</RouterLink>
		</nav>
	</header>
</template>

<style scoped></style>
