import '@/assets/main.css';

import App from '@/App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import { VueQueryPlugin } from '@tanstack/vue-query';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
	theme: {
		preset: Aura,
		options: {
			darkModeSelector: '.dark',

			cssLayer: {
				name: 'primevue',
				order: 'base, primevue, utilities',
			},
		},
	},
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(VueQueryPlugin);

app.mount('#app');
