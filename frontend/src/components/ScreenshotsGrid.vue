<script setup lang="ts">
import { WOW_CLASSES } from '@/utils/utils.ts';
import Screenshot from '@/components/Screenshot.vue';
import type { IScreenshots, IWowClass } from '@/types/types.ts';
import { useFilters } from '@/stores/filters.ts';
import { computed } from 'vue';
import fuzzysort from 'fuzzysort';

const { screenshots } = defineProps<{
	screenshots: IScreenshots;
}>();

const filters = useFilters();

const filteredScreenshots = computed(() => {
	if (filters.search.length === 0) {
		return screenshots;
	}

	const filtered: Partial<IScreenshots> = {};

	for (const [className, classScreenshots] of Object.entries(screenshots)) {
		const results = fuzzysort
			.go(filters.search, classScreenshots, { key: 'wow_name' })
			.map((r) => r.obj);

		if (results.length > 0) {
			filtered[className as IWowClass] = results;
		}
	}

	return filtered;
});

const filteredClasses = computed(() => {
	return WOW_CLASSES.filter((wowClass) => filters.activeClasses.includes(wowClass.name));
});
</script>

<template>
	<div class="grid">
		<div v-for="playableClass in filteredClasses" :key="playableClass.name">
			<div
				class="mb-4 text-center text-xl font-bold capitalize"
				:style="{ color: playableClass.color }"
			>
				{{ playableClass.name }}
			</div>

			<div class="flex flex-col gap-4">
				<Screenshot
					v-for="screenshot in filteredScreenshots![playableClass.name]"
					:key="screenshot.id"
					:screenshot
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>
.grid {
	grid-template-columns: repeat(13, 150px);
}
</style>
