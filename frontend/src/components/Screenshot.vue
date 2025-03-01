<script setup lang="ts">
import type { IScreenshot } from '@/types/types.ts';
import { useUser } from '@/stores/user.ts';

const { screenshot } = defineProps<{
	screenshot: IScreenshot;
}>();

const userStore = useUser();

const VITE_S3_URL = import.meta.env.VITE_S3_URL;
</script>

<template>
	<img
		:src="`${VITE_S3_URL}/${screenshot.path}`"
		:alt="screenshot.wow_name"
		:class="{ 'cursor-pointer': userStore.isLoggedIn }"
	/>
</template>

<style scoped></style>
