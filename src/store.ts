import { StoreToken, Token, UnknowStore } from './types';
import mitt from 'mitt';

export function createStore<S extends UnknowStore>(key: string, value: S): StoreToken<S> {
	const storeKey = `store:${key}`;
	const emitter = mitt();

	const store = {
		key: `store:${storeKey}`,
		emitter,
		token<T extends S[keyof S]>(key: keyof S, defaultValue?: T): Token<T, S> {
			const finalKey = typeof key === 'symbol' ? key : `${storeKey}:${String(key)}`;
			if (defaultValue) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
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
			emitter.emit(token.key);
			return store;
		},
		value,
	};

	return store;
}

export const defaulStore = createStore('default', {} as UnknowStore);
