<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { WOW_CLASSES } from '@/utils/utils.ts';
import { getScreenshots } from '@/api/screenshots.ts';
import ProgressSpinner from 'primevue/progressspinner';

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
				<div
					v-for="screenshot in screenshots![playableClass.name]"
					:key="screenshot.id"
					class="flex flex-col"
				>
					<img
						:src="`https://jelita-r2.bladesheng.com/${screenshot.path}`"
						:alt="screenshot.wow_name"
					/>
					<div class="text-center capitalize">{{ screenshot.wow_name }}</div>
				</div>
			</div>
		</div>
	</main>
</template>

<style scoped>
.grid {
	grid-template-columns: repeat(13, 150px);
}
</style>
