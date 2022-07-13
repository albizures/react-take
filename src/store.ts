import { StoreToken, Token, UnknowStore } from './types';

export function createStore<S extends UnknowStore>(key: string, value: S): StoreToken<S> {
	const storeKey = `store:${key}`;

	const store = {
		key: `store:${storeKey}`,
		token<T extends S[keyof S]>(key: keyof S, defaultValue?: T): Token<T, S> {
			const finalKey = typeof key === 'symbol' ? key : `${storeKey}:${String(key)}`;
			if (defaultValue) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				value[finalKey] = defaultValue;
			}

			return {
				key: finalKey,
				defaultValue,
				store,
			};
		},
		getValue<T>(token: Token<T, S>, defaultValue?: T) {
			return (value[token.key] as T) || defaultValue || token.defaultValue;
		},
		setValue<T extends S[keyof S]>(token: Token<T, S>, newValue: T) {
			(value[token.key] as T) = newValue;
			return store;
		},
		value,
	};

	return store;
}

export const defaulStore = createStore('default', {} as UnknowStore);
