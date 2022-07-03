import React from 'react';
import { EmitterContext } from './context';
import { defaulStore } from './store';
import {
	isSetCallback,
	KeyOf,
	SetterCallback,
	SetterOrVal,
	StoreToken,
	ValOf,
} from './types';
import { Token, UnknowStore } from './types';
import { useUpdate } from './utils';

// NOTE about `ValOf` and `KeyOf`, in typescript, when using keys a generic,
// regardless of the type `keyof T` will be any value (not `any` but a list of
// values like `number`, `boolean` and so on), and to improve the experience
// with arrays, ValOf and KeyOf help to find the array type (for example `string[]` - `string`)
// then `KeyOf<string[]>` is always a `number` (the index) and `ValOf<string[]>` is `string`.
// However when `T[KeyOf<string[]>]` is invalid, therefore convert back to `keyof T` is needed

export function createStructHooks<S extends UnknowStore>(storeToken: StoreToken<S>) {
	const store = storeToken.value;
	/**
	 * Returns the item value in the given struct, and
	 * subscribes the component to the item updates
	 */
	function useStructItemValue<T>(
		token: Token<T, S>,
		item: KeyOf<T>,
		defaultValue: ValOf<T>,
	): ValOf<T>;
	function useStructItemValue<T>(
		token: Token<T, S>,
		item: KeyOf<T>,
		defaultValue: undefined,
	): ValOf<T> | undefined;
	function useStructItemValue<T>(
		token: Token<T, S>,
		item: KeyOf<T>,
		defaultValue?: ValOf<T>,
	) {
		useUpdate(typeof token.key === 'symbol' ? token.key : `${token.key}-${String(item)}`);
		const key = item as keyof T;
		const struct = store[token.key] as T;

		if (!(key in store) && defaultValue && struct) {
			struct[key] = defaultValue as T[keyof T];
		}

		return (store[token.key] as T)?.[key] as ValOf<T> | undefined;
	}

	/**
	 * Returns a setter function for an item in given struct,
	 * without subscribing the component to the item updates
	 */
	const useSetStructItem = <T>(token: Token<T, S>, item: KeyOf<T>) => {
		const set = useSetStruct(token);

		return React.useCallback(
			(value: ValOf<T> | SetterCallback<ValOf<T>>) => {
				return set(item, value);
			},
			[set, item],
		);
	};

	/**
	 * Returns the item value in the given struct, and
	 * subscribes the component to the struct updates
	 */
	function useStructItem<T>(
		token: Token<T, S>,
		item: KeyOf<T>,
		defaultValue?: undefined,
	): [ValOf<T> | undefined, (value: ValOf<T>) => void];
	function useStructItem<T>(
		token: Token<T, S>,
		item: KeyOf<T>,
		defaultValue: ValOf<T>,
	): [ValOf<T>, (value: ValOf<T>) => void];
	function useStructItem<T>(token: Token<T, S>, item: KeyOf<T>, defaultValue: ValOf<T>) {
		return [useStructItemValue(token, item, defaultValue), useSetStructItem(token, item)];
	}

	/**
	 * Returns a setter function for any item in given struct,
	 * without subscribing the component to the struct updates
	 */
	function useSetStruct<T>(token: Token<T, S>) {
		const emitter = React.useContext(EmitterContext);

		return React.useCallback(
			(item: KeyOf<T>, value: SetterOrVal<ValOf<T>>) => {
				const key = item as keyof T;
				const struct = store[token.key] as T;
				const current = struct[key];
				const update = (
					isSetCallback(value) ? value(current as ValOf<T>) : value
				) as T[keyof T];

				struct[key] = update;

				emitter.emit(typeof token.key === 'symbol' ? token.key : `${token.key}-item`);
				emitter.emit(
					typeof token.key === 'symbol' ? token.key : `${token.key}-${String(item)}`,
				);
			},
			[emitter, token.key],
		);
	}

	/**
	 * Returns the struct value, and subscribes the component
	 * to the struct updates and any item update
	 */
	function useStructValue<T>(token: Token<T, S>, defaultValue?: T): T | undefined {
		useUpdate(token.key);
		useUpdate(typeof token.key === 'symbol' ? token.key : `${token.key}-item`);

		if (store[token.key] === undefined) {
			(store[token.key] as T) = defaultValue as T;
		}

		return store[token.key] as T;
	}

	/**
	 * Similar to React.useState, returns a tuples where the first element
	 * is the struct value and the second is a setter function for any item in the struc
	 */
	function useStruct<T>(
		token: Token<T, S>,
		defaultValue?: T,
	): [T | undefined, (item: KeyOf<T>, value: SetterOrVal<ValOf<T>>) => void] {
		return [useStructValue(token, defaultValue), useSetStruct(token)];
	}

	return {
		useStructItemValue,
		useSetStructItem,
		useStructItem,
		useSetStruct,
		useStructValue,
		useStruct,
		createStruct: storeToken.token,
	};
}

export const {
	useStructItemValue,
	useSetStructItem,
	useStructItem,
	useSetStruct,
	useStructValue,
	useStruct,
	createStruct,
} = createStructHooks(defaulStore);
