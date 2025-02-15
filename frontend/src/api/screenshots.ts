import axios from 'axios';
import type { IScreenshots } from '@/types/types.ts';

const api = axios.create({
	baseURL: 'http://localhost:8000',
});

export async function getScreenshots(): Promise<IScreenshots> {
	const screenshots = await api.get<IScreenshots>('/api/screenshots');
	return screenshots.data;
}

export async function uploadScreenshot(formData: FormData) {
	return await api.post('/api/screenshots', formData);
}
