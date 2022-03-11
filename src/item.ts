import React from 'react';
import { EmitterContext, StoreContext } from './context';
import { isSetCallback, SetterOrVal, TokenId } from './types';
import { useUpdate } from './utils';

/**
 * Creates a new item and returns its 'id'
 */
export function createItem<T>(key: string): TokenId<T> {
	return {
		key,
	};
}

/**
 * Returns the value of the given item, and
 * subscribes the component to the item updates
 */
export function useItemValue<T>(
	tokenId: TokenId<T>,
	defaultValue?: T,
): T {
	const { current: store } = React.useContext(StoreContext);

	useUpdate(tokenId.key);

	if (!(tokenId.key in store)) {
		store[tokenId.key] = defaultValue;
	}

	return store[tokenId.key] as T;
}

/**
 * Returns a setter function for the given item, without
 * subscribing the component to the item updates
 */
export function useSetItem<T>(tokenId: TokenId<T>) {
	const emitter = React.useContext(EmitterContext);
	const { current: store } = React.useContext(StoreContext);
	return React.useCallback(
		(value: SetterOrVal<T>) => {
			store[tokenId.key] = isSetCallback(value)
				? value(store[tokenId.key] as T)
				: value;

			emitter.emit(tokenId.key);
		},
		[emitter, store, tokenId.key],
	);
}

/**
 * Similar to React.useState, returns a tuples where the first element
 * is the item value and the second is a setter function
 */
export function useItem<T>(
	tokenId: TokenId<T>,
	defaultValue?: T,
): [T | undefined, (value: SetterOrVal<T>) => void] {
	return [useItemValue(tokenId, defaultValue), useSetItem(tokenId)];
}
