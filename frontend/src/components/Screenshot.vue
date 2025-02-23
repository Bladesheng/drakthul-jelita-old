<script setup lang="ts">
import type { IScreenshot } from '@/types/types.ts';
import Button from 'primevue/button';
import { useConfirm, useToast } from 'primevue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { deleteScreenshot } from '@/api/api.ts';
import ScreenshotEditModal from '@/components/ScreenshotEditModal.vue';
import { ref } from 'vue';
import { useUser } from '@/stores/user.ts';

const { screenshot } = defineProps<{
	screenshot: IScreenshot;
}>();

const VITE_S3_URL = import.meta.env.VITE_S3_URL;

const confirm = useConfirm();
const queryClient = useQueryClient();
const toast = useToast();
const userStore = useUser();

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
		<img :src="`${VITE_S3_URL}/${screenshot.path}`" :alt="screenshot.wow_name" />

		<div
			v-if="userStore.isLoggedIn"
			class="absolute inset-0 z-1 flex flex-col items-center justify-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
		>
			<div class="rounded bg-gray-700 px-1 text-center text-sm capitalize">
				{{ screenshot.wow_name }}
			</div>

			<div class="flex gap-1">
				<Button
					icon="pi pi-trash"
					severity="danger"
					size="small"
					class="h-8 w-8"
					@click="onDeleteClick"
				/>
				<Button icon="pi pi-pencil" size="small" class="h-8 w-8" @click="isModalOpen = true" />
			</div>
		</div>
	</div>

	<ScreenshotEditModal v-model="isModalOpen" :screenshot />
</template>

<style scoped></style>
