// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

export type Debt = {
	itemNo: number,
	id: number,
	description: string,
	amount: number,
	name: string,
	timeAdded: Date
}
