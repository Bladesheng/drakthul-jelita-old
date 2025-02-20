<script setup lang="ts">
import { RouterView } from 'vue-router';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import Header from '@/components/Header.vue';
</script>

<template>
	<Header />

	<RouterView />

	<Toast />
	<ConfirmDialog />

	<VueQueryDevtools />
</template>

<style scoped></style>
