import React from 'react';
import { EmitterContext, StoreContext } from './context';
import {
	isSetCallback,
	ValOf,
	SetterCallback,
	TokenId,
	SetterOrVal,
	KeyOf,
} from './types';
export { createItem as createStruct } from './item';
import { useUpdate } from './utils';

// NOTE about `ValOf` and `KeyOf`, in typescript, when using keys a generic,
// regardless of the type `keyof T` will be any value (not `any` but a list of
// values like `number`, `boolean` and so on), and to improve the experience
// with arrays, ValOf and KeyOf help to find the array type (for example `string[]` - `string`)
// then `KeyOf<string[]>` is always a `number` (the index) and `ValOf<string[]>` is `string`.
// However when `T[KeyOf<string[]>]` is invalid, therefore convert back to `keyof T` is needed

/**
 * Returns the item value in the given struct, and
 * subscribes the component to the item updates
 */
export const useStructItemValue = <T>(
	tokenId: TokenId<T>,
	item: KeyOf<T>,
	defaultValue?: ValOf<T>,
): ValOf<T> => {
	const { current: store } = React.useContext(StoreContext);

	useUpdate(`${tokenId.key}-${item}`);
	const key = item as keyof T;
	const struct = store[tokenId.key] as T;

	if (!(key in store) && defaultValue && struct) {
		struct[key] = defaultValue as T[keyof T];
	}

	return (store[tokenId.key] as T)?.[key] as ValOf<T>;
};

/**
 * Returns a setter function for an item in given struct,
 * without subscribing the component to the item updates
 */
export const useSetStructItem = <T>(
	tokenId: TokenId<T>,
	item: KeyOf<T>,
) => {
	const set = useSetStruct(tokenId);

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
export const useStructItem = <T>(
	tokenId: TokenId<T>,
	item: KeyOf<T>,
	defaultValue?: ValOf<T>,
): [ValOf<T>, (value: ValOf<T>) => void] => {
	return [
		useStructItemValue(tokenId, item, defaultValue),
		useSetStructItem(tokenId, item),
	];
};

/**
 * Returns a setter function for any item in given struct,
 * without subscribing the component to the struct updates
 */
export const useSetStruct = <T>(tokenId: TokenId<T>) => {
	const emitter = React.useContext(EmitterContext);
	const { current: store } = React.useContext(StoreContext);

	return React.useCallback(
		(item: KeyOf<T>, value: SetterOrVal<ValOf<T>>) => {
			const key = item as keyof T;
			const struct = store[tokenId.key] as T;
			const current = struct[key];
			const update = (
				isSetCallback(value) ? value(current as ValOf<T>) : value
			) as T[keyof T];

			struct[key] = update;

			emitter.emit(`${tokenId.key}-item`);
			emitter.emit(`${tokenId.key}-${item}`);
		},
		[emitter, store, tokenId.key],
	);
};

/**
 * Returns the struct value, and subscribes the component
 * to the struct updates and any item update
 */
export const useStructValue = <T>(
	tokenId: TokenId<T>,
	defaultValue?: T,
): T | undefined => {
	const { current: store } = React.useContext(StoreContext);

	useUpdate(tokenId.key);
	useUpdate(`${tokenId.key}-item`);

	if (store[tokenId.key] === undefined) {
		store[tokenId.key] = defaultValue;
	}

	return store[tokenId.key] as T;
};

/**
 * Similar to React.useState, returns a tuples where the first element
 * is the struct value and the second is a setter function for any item in the struc
 */
export const useStruct = <T>(
	tokenId: TokenId<T>,
	defaultValue?: T,
): [
	T | undefined,
	(item: KeyOf<T>, value: SetterOrVal<ValOf<T>>) => void,
] => {
	return [
		useStructValue(tokenId, defaultValue),
		useSetStruct(tokenId),
	];
};
