// See https://kit.svelte.dev/docs/types#app
// for information about these types
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	// Phoenix Clika AdFraud Integration
	interface Window {
		__PHOENIX_ADS__?: {
			registerSlot: (config: {
				position: string;
				size: string;
				container: HTMLElement;
				onLoad?: () => void;
			}) => void;
		};
		__PHOENIX_TRACKER__?: {
			session?: {
				sessionId: string;
				pagesViewed: number;
				clicks: number;
			};
		};
		__PHOENIX_DEBUG__?: {
			session: unknown;
			config: unknown;
		};
	}
}

export {};

