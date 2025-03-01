<script setup lang="ts">
import type { IScreenshot } from '@/types/types.ts';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { WOW_CLASSES } from '@/utils/utils.ts';
import RadioButton from 'primevue/radiobutton';
import { ref } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { deleteScreenshot, updateScreenshot } from '@/api/api.ts';
import { useConfirm, useToast } from 'primevue';

const isModalOpen = defineModel<boolean>();

const { screenshot } = defineProps<{
	screenshot: IScreenshot;
}>();

const VITE_S3_URL = import.meta.env.VITE_S3_URL;

const queryClient = useQueryClient();
const toast = useToast();
const confirm = useConfirm();

const wowName = ref(screenshot.wow_name);
const wowClass = ref(screenshot.wow_class);

const updateMutation = useMutation({
	mutationFn: updateScreenshot,
	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ['screenshots'] });

		toast.add({
			severity: 'success',
			summary: 'Success',
			detail: 'Screenshot updated',
			life: 5000,
		});

		isModalOpen.value = false;
	},
});

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

		isModalOpen.value = false;
	},
});

function updateInputs() {
	wowName.value = screenshot.wow_name;
	wowClass.value = screenshot.wow_class;
}

function onSubmit() {
	updateMutation.mutate({
		id: screenshot.id,
		wowName: wowName.value,
		wowClass: wowClass.value,
	});
}

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
	<Dialog v-model:visible="isModalOpen" modal header="Edit screenshot" @show="updateInputs">
		<form class="flex flex-col items-center gap-8" @submit.prevent="onSubmit">
			<img
				:src="`${VITE_S3_URL}/${screenshot.path}`"
				:alt="screenshot.wow_name"
				class="w-64 rounded shadow"
			/>

			<div class="flex flex-col">
				<label for="username">Name</label>
				<InputText id="username" v-model="wowName" />
			</div>

			<div class="flex flex-col gap-1">
				<div
					v-for="playableClass in WOW_CLASSES"
					:key="playableClass.name"
					class="flex items-center gap-2"
				>
					<RadioButton
						v-model="wowClass"
						:inputId="playableClass.name"
						:value="playableClass.name"
						size="large"
					/>
					<label
						:for="playableClass.name"
						class="text-xl capitalize"
						:style="{ color: playableClass.color }"
					>
						{{ playableClass.name }}
					</label>
				</div>
			</div>

			<div class="flex gap-4">
				<Button
					type="button"
					label="Delete"
					icon="pi pi-trash"
					severity="danger"
					@click="onDeleteClick"
				/>

				<Button type="submit" label="Save" icon="pi pi-save" />
			</div>
		</form>
	</Dialog>
</template>

<style scoped></style>
