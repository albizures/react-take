import {
	StoreToken,
	Token,
	TokenWithDefault,
	TokenWithoutDefault,
	UnknowStore,
} from './types';
import mitt from 'mitt';

export function createStore<S extends UnknowStore>(key: string, value: S): StoreToken<S> {
	const storeKey = `store:${key}`;
	const emitter = mitt();

	function token<T extends S[keyof S]>(
		key: keyof S,
		defaultValue: T,
	): TokenWithDefault<T, S>;
	function token<T extends S[keyof S]>(key: keyof S): TokenWithoutDefault<T, S>;
	function token<T extends S[keyof S]>(key: keyof S, defaultValue?: T): Token<T, S> {
		const finalKey = typeof key === 'symbol' ? key : `${storeKey}:${String(key)}`;
		if (typeof defaultValue !== 'undefined') {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			value[finalKey] = defaultValue;
		}

		return {
			key: finalKey,
			defaultValue,
			store,
		};
	}

	const store = {
		key: storeKey,
		emitter,
		token,
		/**
		 * @deprecated
		 */
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
