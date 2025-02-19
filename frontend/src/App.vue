<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
</script>

<template>
	<header class="m-4">
		<nav class="flex gap-4">
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/upload">Upload</RouterLink>
		</nav>
	</header>

	<RouterView />

	<Toast />
	<ConfirmDialog />

	<VueQueryDevtools />
</template>

<style scoped></style>
