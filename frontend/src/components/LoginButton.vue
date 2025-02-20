<script setup lang="ts">
import Button from 'primevue/button';
import { useUser } from '@/stores/user.ts';
import { login, logout } from '@/api/api.ts';
import { useToast } from 'primevue';

const userStore = useUser();
const toast = useToast();

async function onClick() {
	if (userStore.isLoggedIn) {
		await logout();

		userStore.isLoggedIn = false;
		toast.add({
			severity: 'success',
			summary: 'Logged Out',
			detail: 'You have been successfully logged out',
			life: 5000,
		});

		return;
	}

	const password = prompt('Password');
	if (!password) {
		return;
	}

	try {
		await login(password);

		userStore.isLoggedIn = true;
		toast.add({
			severity: 'success',
			summary: 'Login Successful',
			detail: 'Access granted',
			life: 5000,
		});
	} catch (err) {
		console.error(err);

		// @ts-ignore
		if (err.status === 401) {
			toast.add({
				severity: 'error',
				summary: 'Login failed',
				detail: 'Wrong password',
				life: 5000,
			});
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error',
				detail: err,
				life: 5000,
			});
		}
	}
}
</script>

<template>
	<Button
		:icon="`pi pi-sign-${userStore.isLoggedIn ? 'out' : 'in'}`"
		:severity="userStore.isLoggedIn ? 'danger' : ''"
		rounded
		variant="outlined"
		class="fixed bottom-4 left-4 opacity-5 transition-opacity hover:opacity-100"
		@click="onClick"
	/>
</template>

<style scoped></style>
