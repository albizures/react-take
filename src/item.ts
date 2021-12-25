import React from 'react';
import { EmitterContext, StoreContext } from './context';
import { TokenId } from './types';
import { useUpdate } from './utils';

export function createItem<T>(key: string): TokenId<T> {
	return {
		key,
	};
}

export function useItemValue<T>(
	tokenId: TokenId<T>,
	defaultValue?: T,
): T {
	const store = React.useContext(StoreContext);

	useUpdate(tokenId.key);

	if (store[tokenId.key] === undefined) {
		store[tokenId.key] = defaultValue;
	}

	return store[tokenId.key] as T;
}

export function useSetItem<T>(tokenId: TokenId<T>) {
	const emitter = React.useContext(EmitterContext);
	const store = React.useContext(StoreContext);
	return React.useCallback(
		(value: T) => {
			store[tokenId.key] = value;
			emitter.emit(tokenId.key);
		},
		[emitter, store, tokenId.key],
	);
}

export function useItem<T>(
	tokenId: TokenId<T>,
	defaultValue?: T,
): [T, (value: T) => void] {
	const value = useItemValue(tokenId, defaultValue);
	const set = useSetItem(tokenId);

	return [value, set];
}
