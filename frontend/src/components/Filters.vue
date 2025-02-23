<script setup lang="ts">
import InputText from 'primevue/inputtext';
import { useFilters } from '@/stores/filters.ts';
import { WOW_CLASSES } from '@/utils/utils.ts';
import MultiSelect from 'primevue/multiselect';
import type { IScreenshots } from '@/types/types.ts';
import { computed } from 'vue';

const { screenshots } = defineProps<{
	screenshots: IScreenshots;
}>();

const screenshotsCount = computed(() =>
	Object.values(screenshots).reduce((total, screenshots) => total + screenshots.length, 0)
);

const classCounts = computed(() =>
	Object.entries(screenshots)
		.reduce<
			{
				classColor: string;
				count: number;
			}[]
		>((counts, [className, screenshots]) => {
			const classColor = WOW_CLASSES.find((wowClass) => wowClass.name === className)!.color;
			counts.push({ classColor, count: screenshots.length });
			return counts;
		}, [])
		.sort((a, b) => b.count - a.count)
);

const filters = useFilters();
</script>

<template>
	<div class="flex grow items-center gap-4 self-stretch">
		<InputText v-model="filters.search" type="search" placeholder="Search for names..." />

		<MultiSelect
			v-model="filters.activeClasses"
			:options="WOW_CLASSES"
			optionLabel="name"
			optionValue="name"
			filter
			placeholder="Select classes"
			:maxSelectedLabels="3"
			class="w-full md:w-80"
		>
			<template #option="slotProps">
				<span class="capitalize" :style="{ color: slotProps.option.color }">
					{{ slotProps.option.name }}
				</span>
			</template>
		</MultiSelect>

		<div class="ml-auto">
			<span>{{ screenshotsCount }} screenshots</span>

			(<span class="inline-flex gap-2">
				<span v-for="{ classColor, count } in classCounts" :style="{ color: classColor }">
					{{ count }}
				</span> </span
			>)
		</div>
	</div>
</template>

<style scoped></style>
