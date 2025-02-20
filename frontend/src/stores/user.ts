import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useUser = defineStore('user', () => {
	const isLoggedIn = useStorage('isLoggedIn', false);

	return {
		isLoggedIn,
	};
});
