import React from 'react';
import { EmitterContext, StoreContext } from './context';
import { TokenId } from './types';
import { useUpdate } from './utils';
import { createItem } from './item';

/**
 * @deprecated use createStruct instead
 */
export function createList<T>(key: string): TokenId<T[]> {
	return createItem<T[]>(key);
}

/**
 * @deprecated use useStructItemValue instead
 */
export function useListItemValue<T>(
	tokenId: TokenId<T[]>,
	index: number,
) {
	const { current: store } = React.useContext(StoreContext);

	useUpdate(`${tokenId.key}-${index}`);

	return (store[tokenId.key] as T[])[index];
}

/**
 * @deprecated use useSetStructItem or useSetStruct instead
 */
export function useSetListItem<T>(
	tokenId: TokenId<T[]>,
	index: number,
) {
	const { current: store } = React.useContext(StoreContext);
	const emitter = React.useContext(EmitterContext);

	return React.useCallback(
		(value: T) => {
			const list = store[tokenId.key] as T[];

			list[index] = value;

			emitter.emit(`${tokenId.key}-child`);
			emitter.emit(`${tokenId.key}-${index}`);
		},
		[index, store, emitter, tokenId.key],
	);
}

/**
 * @deprecated use useSetStructItem or useSetStruct instead
 */
export function useListItem<T>(
	tokenId: TokenId<T[]>,
	index: number,
): [T, (value: T) => void] {
	const value = useListItemValue(tokenId, index);
	const set = useSetListItem(tokenId, index);

	return [value, set];
}

interface Options {
	changesFromChildren: boolean;
}

const defaultOptions: Options = {
	changesFromChildren: false,
};

/**
 * @deprecated use useStructValue or useItemValue instead
 */
export function useListValue<T>(
	tokenId: TokenId<T[]>,
	defaultValue?: T[],
	options = defaultOptions,
): T[] {
	const { current: store } = React.useContext(StoreContext);

	useUpdate(tokenId.key);
	useUpdate(
		options.changesFromChildren ? `${tokenId.key}-child` : undefined,
	);

	if (store[tokenId.key] === undefined) {
		store[tokenId.key] = defaultValue;
	}

	return store[tokenId.key] as T[];
}

/**
 * @deprecated use useSetItem or useSetStruct instead
 */
function useSetList<T>(tokenId: TokenId<T[]>) {
	const { current: store } = React.useContext(StoreContext);
	const emitter = React.useContext(EmitterContext);

	return React.useCallback(
		(value: T[]) => {
			store[tokenId.key] = value;
			emitter.emit(tokenId.key);

			emitter.emit(`${tokenId.key}-child`);
		},
		[emitter, store, tokenId.key],
	);
}

/**
 * @deprecated use useStruct instead
 */
export function useList<T>(
	tokenId: TokenId<T[]>,
	defaultValue?: T[],
	options = defaultOptions,
): [T[], (value: T[]) => void] {
	return [
		useListValue(tokenId, defaultValue, options),
		useSetList(tokenId),
	];
}
