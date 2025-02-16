<script setup lang="ts">
import { createWorker, PSM } from 'tesseract.js';
import { type FileUploadSelectEvent, useToast } from 'primevue';
import { useEventListener } from '@vueuse/core';
import { ref } from 'vue';
import { WOW_CLASSES } from '@/utils/utils.ts';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import { uploadScreenshot } from '@/api/screenshots.ts';
import { useMutation, useQueryClient } from '@tanstack/vue-query';

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

const { mutate, status } = useMutation({
	mutationFn: uploadScreenshot,

	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ['screenshots'] });

		toast.add({ severity: 'success', summary: 'Success', detail: 'File uploaded', life: 5000 });

		resetForm();
	},

	onError: (error) => {
		console.error(error);

		toast.add({
			severity: 'error',
			summary: 'Failure',
			detail: 'File upload failed: ' + error,
			life: 5000,
		});
	},
});

function onSelect(e: FileUploadSelectEvent) {
	handleFile(e.files[0]);
}

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

		tessedit_char_whitelist:
			'abcdefghijklmnopqrstuvwxyz' +
			'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
			'áÁàÀâÂäÄåÅªæÆçÇœŒéÉèÈêÊëËƒíÍìÌîÎïÏñÑóÓòÒôÔöÖºúÚùÙûÛÜýÝÿ',
	});

	const result = await worker.recognize(file);

	wowName.value = result.data.text;
	screenshot.value = file;

	await worker.terminate();
}

async function onSubmit() {
	const formData = new FormData();
	formData.append('file', screenshot.value!);
	formData.append('wowName', wowName.value);
	formData.append('wowClass', wowClass.value);

	mutate(formData);
}

function resetForm() {
	screenshot.value = undefined;
	src.value = undefined;
	wowName.value = '';
	// wowClass.value = ''; // @TODO
}
</script>

<template>
	<form class="flex flex-col items-center gap-8" @submit.prevent="onSubmit">
		<FileUpload mode="basic" @select="onSelect" accept="image/*" :maxFileSize="5_000_000" />

		<img v-if="src" :src="src" alt="" class="w-64 rounded shadow" />

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
				<RadioButton v-model="wowClass" :inputId="playableClass.name" :value="playableClass.name" />
				<label :for="playableClass.name" class="capitalize" :style="{ color: playableClass.color }">
					{{ playableClass.name }}
				</label>
			</div>
		</div>

		<Button
			label="Save"
			type="submit"
			:disabled="status === 'pending' || !wowName.length || !wowClass.length || !screenshot"
		/>
	</form>
</template>

<style scoped></style>
