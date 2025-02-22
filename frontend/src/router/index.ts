import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import { useUser } from '@/stores/user.ts';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/upload',
			name: 'upload',
			component: () => import('@/views/UploadView.vue'),
			beforeEnter: () => {
				const userStore = useUser();
				if (!userStore.isLoggedIn) {
					return '/';
				}
			},
		},
		{
			path: '/about',
			name: 'about',
			component: () => import('@/views/AboutView.vue'),
		},
	],
});

export default router;
