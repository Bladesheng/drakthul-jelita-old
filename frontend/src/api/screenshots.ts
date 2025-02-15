import axios from 'axios';
import mockScreenshots from '@/api/screenshots.mock.json';

const api = axios.create({
	baseURL: 'http://localhost:8000',
});

export async function getScreenshots() {
	// @TODO
	await new Promise((resolve) => setTimeout(resolve, 400));

	return mockScreenshots;
}

export async function uploadScreenshot(formData: FormData) {
	// @TODO
	for (const e of formData.entries()) {
		console.log(e);
	}

	await new Promise((resolve) => setTimeout(resolve, 400));
}
