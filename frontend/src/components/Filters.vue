<script setup lang="ts">
import InputText from 'primevue/inputtext';
import { useFilters } from '@/stores/filters.ts';
import { WOW_CLASSES } from '@/utils/utils.ts';
import MultiSelect from 'primevue/multiselect';

const filters = useFilters();
</script>

<template>
	<div class="flex gap-4">
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
	</div>
</template>

<style scoped></style>
