<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { WOW_CLASSES } from '@/utils/utils.ts';
import { getScreenshots } from '@/api/screenshots.ts';
import ProgressSpinner from 'primevue/progressspinner';
import Screenshot from '@/components/Screenshot.vue';

const { data: screenshots, status } = useQuery({
	queryKey: ['screenshots'],
	queryFn: getScreenshots,
});
</script>

<template>
	<main class="grid">
		<div v-if="status === 'pending'">
			<ProgressSpinner />
		</div>

		<div
			v-else-if="status === 'success'"
			v-for="playableClass in WOW_CLASSES"
			:key="playableClass.name"
			class=""
		>
			<div
				class="mb-4 text-center text-xl font-bold capitalize"
				:style="{ color: playableClass.color }"
			>
				{{ playableClass.name }}
			</div>

			<div class="flex flex-col gap-4" v-if="status === 'success'">
				<Screenshot
					v-for="screenshot in screenshots![playableClass.name]"
					:key="screenshot.id"
					:screenshot
				/>
			</div>
		</div>
	</main>
</template>

<style scoped>
.grid {
	grid-template-columns: repeat(13, 150px);
}
</style>
