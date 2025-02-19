<script setup lang="ts">
import type { IScreenshot } from '@/types/types.ts';
import Button from 'primevue/button';
import { useConfirm, useToast } from 'primevue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { deleteScreenshot } from '@/api/screenshots.ts';
import ScreenshotEditModal from '@/components/ScreenshotEditModal.vue';
import { ref } from 'vue';

let { screenshot } = defineProps<{
	screenshot: IScreenshot;
}>();

const confirm = useConfirm();
const queryClient = useQueryClient();
const toast = useToast();

const isModalOpen = ref(false);

const deleteMutation = useMutation({
	mutationFn: deleteScreenshot,
	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ['screenshots'] });
		toast.add({
			severity: 'success',
			summary: 'Success',
			detail: 'Screenshot deleted',
			life: 5000,
		});
	},
});

function onDeleteClick(event: MouseEvent) {
	confirm.require({
		target: event.currentTarget as HTMLElement,
		header: 'Delete screenshot',
		message: 'Are you sure you want to delete this screenshot?',
		icon: 'pi pi-exclamation-triangle',
		rejectProps: {
			label: 'Cancel',
			severity: 'secondary',
		},
		acceptProps: {
			label: 'Delete',
			severity: 'danger',
		},
		accept: () => {
			deleteMutation.mutate(screenshot.id);
		},
	});
}
</script>

<template>
	<div class="group relative flex flex-col">
		<img :src="`https://jelita-r2.bladesheng.com/${screenshot.path}`" :alt="screenshot.wow_name" />

		<div
			class="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
		>
			<div class="rounded bg-gray-600 px-1 text-center capitalize">{{ screenshot.wow_name }}</div>

			<div class="flex gap-2">
				<Button icon="pi pi-trash" severity="danger" rounded @click="onDeleteClick" />
				<Button icon="pi pi-pencil" rounded @click="isModalOpen = true" />
			</div>
		</div>
	</div>

	<ScreenshotEditModal :screenshot v-model="isModalOpen" />
</template>

<style scoped></style>
