<script setup lang="ts">
import { createWorker, PSM } from 'tesseract.js';
import { useToast } from 'primevue';
import { refDebounced, useEventListener } from '@vueuse/core';
import { ref, toRef } from 'vue';
import { WOW_CLASSES } from '@/utils/utils.ts';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import { search, uploadScreenshot } from '@/api/api.ts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import FileDropper from '@/components/FileDropper.vue';

const toast = useToast();
const queryClient = useQueryClient();

const screenshot = ref<File>();
const src = ref<string>();
const wowName = ref('');
const wowClass = ref('');

useEventListener(document, 'paste', (event: ClipboardEvent) => {
	const item = event.clipboardData?.items[0];

	if (item?.type.startsWith('image/')) {
		const file = item.getAsFile();
		if (file) {
			handleFile(file);
		}
	}
});

const isFilled = refDebounced(
	toRef(() => wowName.value.length > 0 && wowClass.value.length > 0),
	200
);

const queryKey = refDebounced(
	toRef(() => ['screenshots-search', wowName.value, wowClass.value]),
	200
);

const searchQuery = useQuery({
	queryKey,
	queryFn: async ({ signal }) => {
		if (wowName.value.length === 0 || wowClass.value.length === 0) {
			return false;
		}

		const screenshots = await search({ wowName: wowName.value, wowClass: wowClass.value }, signal);

		return screenshots.length === 0;
	},
});

const { mutate, status } = useMutation({
	mutationFn: uploadScreenshot,

	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ['screenshots'] });

		toast.add({ severity: 'success', summary: 'Success', detail: 'File uploaded', life: 5000 });

		resetForm();
	},

	onError: (error) => {
		console.error(error);

		// @ts-ignore
		if (error.status === 409) {
			toast.add({
				severity: 'error',
				summary: 'Name already exists',
				// @ts-ignore
				detail: error.data.message,
				life: 10000,
			});

			return;
		}

		toast.add({
			severity: 'error',
			summary: 'Error',
			detail: 'File upload failed: ' + error,
			life: 5000,
		});
	},
});

async function handleFile(file: File) {
	const reader = new FileReader();
	reader.onload = (e) => {
		if (typeof e.target?.result === 'string') {
			src.value = e.target.result;
		}
	};
	reader.readAsDataURL(file);

	const worker = await createWorker('eng');

	await worker.setParameters({
		// https://github.com/tesseract-ocr/tesseract/blob/4.0.0/src/ccstruct/publictypes.h#L163
		tessedit_pageseg_mode: PSM.SINGLE_WORD,

		tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		// 'áÁàÀâÂäÄåÅªæÆçÇœŒéÉèÈêÊëËƒíÍìÌîÎïÏñÑóÓòÒôÔöÖºúÚùÙûÛÜýÝÿ',
	});

	const result = await worker.recognize(file);
	const name = result.data.text;
	const nameFormatted = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

	wowName.value = nameFormatted;
	screenshot.value = file;

	await worker.terminate();
}

async function onSubmit() {
	const formData = new FormData();

	if (!screenshot.value) {
		return;
	}

	formData.append('file', screenshot.value);
	formData.append('wowName', wowName.value);
	formData.append('wowClass', wowClass.value);

	mutate(formData);
}

function resetForm() {
	screenshot.value = undefined;
	src.value = undefined;
	wowName.value = '';
	wowClass.value = '';
}
</script>

<template>
	<main class="mx-4 flex grow items-center">
		<form
			class="flex grow flex-col items-center justify-center gap-8 md:flex-row"
			@submit.prevent="onSubmit"
		>
			<div class="flex flex-col gap-4 md:self-stretch">
				<img v-if="src" :src="src" alt="" class="w-64 rounded shadow" />

				<FileDropper class="mt-auto h-50 w-64" @drop="handleFile" />
			</div>

			<div class="flex flex-col gap-4">
				<div class="flex flex-col">
					<label for="username">Name</label>
					<IconField>
						<InputText
							id="username"
							v-model="wowName"
							:invalid="isFilled && searchQuery.data.value === false"
						/>
						<InputIcon
							class="pi"
							:class="{
								'pi-spin pi-spinner': searchQuery.isPending.value,
								'pi-check-circle text-green-500': isFilled && searchQuery.data.value === true,
								'pi-times-circle text-red-300': isFilled && searchQuery.data.value === false,
							}"
						/>
					</IconField>
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
							class="text-2xl capitalize"
							:style="{ color: playableClass.color }"
						>
							{{ playableClass.name }}
						</label>
					</div>
				</div>

				<Button
					label="Save"
					type="submit"
					:disabled="
						status === 'pending' ||
						!wowName.length ||
						!wowClass.length ||
						!screenshot ||
						searchQuery.isPending.value ||
						searchQuery.data.value !== true
					"
				/>
			</div>
		</form>
	</main>
</template>

<style scoped></style>
