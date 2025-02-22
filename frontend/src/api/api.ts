import type { IScreenshots } from '@/types/types.ts';
import { ofetch } from 'ofetch';

const api = ofetch.create({
	baseURL: 'http://localhost:8000',
	credentials: 'include',
});

export async function getScreenshots(): Promise<IScreenshots> {
	const screenshots = await api<IScreenshots>('/api/screenshots');
	return screenshots;
}

export async function uploadScreenshot(formData: FormData) {
	return await api('/api/screenshots', {
		method: 'POST',
		body: formData,
	});
}

export async function updateScreenshot(params: { id: number; wowName: string; wowClass: string }) {
	return await api(`/api/screenshots/${params.id}`, {
		method: 'PATCH',
		body: params,
	});
}

export async function deleteScreenshot(screenshotId: number) {
	return await api(`/api/screenshots/${screenshotId}`, {
		method: 'DELETE',
	});
}

export async function login(password: string) {
	return await api('/login', {
		body: { password },
		method: 'POST',
	});
}

export async function logout() {
	return await api('/logout', {
		method: 'POST',
	});
}
