import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export interface IAppStore {
	deviceId: string | null;
}

const initialValue: IAppStore = browser
	? {
			deviceId: window.localStorage.getItem('deviceId')
		}
	: { deviceId: '' };

export const appStore = writable<IAppStore>(initialValue);
