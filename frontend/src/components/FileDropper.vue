<script setup lang="ts">
/**
 * Copied from https://github.com/ignis05/baro-save-editor/blob/master/src/components/FileDropper.vue
 */

import { defineEmits, ref, useTemplateRef } from 'vue';

const emit = defineEmits<{
	(event: 'drop', file: File): void;
}>();

const isHovered = ref(false);
const fileInput = useTemplateRef('file-input');

function onFileInput(e: Event) {
	const target = e.target as HTMLInputElement;

	if (target?.files?.[0]) {
		emit('drop', target.files[0]);
	}

	target.value = '';
}

function fileDrop(e: DragEvent) {
	isHovered.value = false;

	if (e.dataTransfer?.files?.[0]) {
		emit('drop', e.dataTransfer.files[0]);
	}
}

function dropzoneClick() {
	fileInput.value?.click();
}

function dragEnter() {
	isHovered.value = true;
}

function dragLeave() {
	isHovered.value = false;
}
</script>

<template>
	<div
		v-bind="$attrs"
		class="relative cursor-pointer rounded border-2 border-dashed"
		:class="{ 'border-primary-500': isHovered }"
		@drop.prevent="fileDrop"
		@click="dropzoneClick"
		@dragenter.stop.prevent="dragEnter"
		@dragleave.stop.prevent="dragLeave"
		@dragover.stop.prevent
	>
		<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
			<i class="pi pi-file-arrow-up text-3xl" :class="{ 'text-primary-500': isHovered }"></i>
		</div>
	</div>

	<input class="hidden" ref="file-input" type="file" accept="image/*" @change="onFileInput" />
</template>

<style scoped></style>
