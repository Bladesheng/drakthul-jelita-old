<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { getScreenshots } from '@/api/screenshots.ts';
import ProgressSpinner from 'primevue/progressspinner';
import Filters from '@/components/Filters.vue';
import ScreenshotsGrid from '@/components/ScreenshotsGrid.vue';

const { data: screenshots, status } = useQuery({
	queryKey: ['screenshots'],
	queryFn: getScreenshots,
});
</script>

<template>
	<main class="m-4">
		<div v-if="status === 'pending'">
			<ProgressSpinner />
		</div>

		<div v-else-if="status === 'success'" class="flex flex-col gap-6">
			<Filters />

			<ScreenshotsGrid :screenshots="screenshots!" />
		</div>
	</main>
</template>

<style scoped></style>
