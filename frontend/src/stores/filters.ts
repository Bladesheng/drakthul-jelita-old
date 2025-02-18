import { defineStore } from 'pinia';
import { ref } from 'vue';
import { WOW_CLASSES } from '@/utils/utils.ts';

export const useFilters = defineStore('filters', () => {
	const search = ref('');

	const activeClasses = ref(WOW_CLASSES.map((c) => c.name));

	return {
		search,
		activeClasses,
	};
});
