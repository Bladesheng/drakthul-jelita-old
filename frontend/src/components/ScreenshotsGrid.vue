<script setup lang="ts">
import { WOW_CLASSES } from '@/utils/utils.ts';
import Screenshot from '@/components/Screenshot.vue';
import type { IScreenshot, IScreenshots, IWowClass } from '@/types/types.ts';
import { useFilters } from '@/stores/filters.ts';
import { computed, ref } from 'vue';
import fuzzysort from 'fuzzysort';
import ScreenshotEditModal from '@/components/ScreenshotEditModal.vue';
import { useUser } from '@/stores/user.ts';

const { screenshots } = defineProps<{
	screenshots: IScreenshots;
}>();

const filters = useFilters();
const userStore = useUser();

const isModalOpen = ref(false);
const selectedScreenshot = ref<IScreenshot>();

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

function onScreenshotClick(screenshot: IScreenshot) {
	if (!userStore.isLoggedIn) {
		return;
	}

	selectedScreenshot.value = screenshot;
	isModalOpen.value = true;
}
</script>

<template>
	<div class="grid gap-1">
		<div v-for="playableClass in filteredClasses" :key="playableClass.name">
			<div
				class="mb-4 text-center text-lg font-bold capitalize"
				:style="{ color: playableClass.color }"
			>
				{{ playableClass.name }}
			</div>

			<div class="flex flex-col gap-1">
				<Screenshot
					v-for="screenshot in filteredScreenshots![playableClass.name]"
					:key="screenshot.id"
					:screenshot
					@click="onScreenshotClick(screenshot)"
				/>
			</div>
		</div>
	</div>

	<ScreenshotEditModal
		v-if="userStore.isLoggedIn && selectedScreenshot"
		v-model="isModalOpen"
		:screenshot="selectedScreenshot"
	/>
</template>

<style scoped>
.grid {
	grid-template-columns: repeat(13, minmax(135px, 1fr));
}
</style>
