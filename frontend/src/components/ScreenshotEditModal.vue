<script setup lang="ts">
import type { IScreenshot } from '@/types/types.ts';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { WOW_CLASSES } from '@/utils/utils.ts';
import RadioButton from 'primevue/radiobutton';
import { ref } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updateScreenshot } from '@/api/screenshots.ts';
import { useToast } from 'primevue';

const isModalOpen = defineModel<boolean>();

let { screenshot } = defineProps<{
	screenshot: IScreenshot;
}>();

const queryClient = useQueryClient();
const toast = useToast();

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
</script>

<template>
	<Dialog v-model:visible="isModalOpen" modal header="Edit screenshot" @show="updateInputs">
		<form class="flex flex-col items-center gap-8" @submit.prevent="onSubmit">
			<img
				:src="`https://jelita-r2.bladesheng.com/${screenshot.path}`"
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
					/>
					<label
						:for="playableClass.name"
						class="capitalize"
						:style="{ color: playableClass.color }"
					>
						{{ playableClass.name }}
					</label>
				</div>
			</div>

			<Button type="submit" label="Save" icon="pi pi-save" />
		</form>
	</Dialog>
</template>

<style scoped></style>
