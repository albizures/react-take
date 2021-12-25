import React from 'react';
import { EmitterContext, StoreContext } from './context';
import { TokenId } from './types';
import { useUpdate } from './utils';
import { createItem } from './item';

export function createList<T>(key: string): TokenId<T[]> {
	return createItem(key);
}

export function useListItemValue<T>(
	tokenId: TokenId<T[]>,
	index: number,
) {
	const store = React.useContext(StoreContext);

	useUpdate(`${tokenId.key}-${index}`);

	return (store[tokenId.key] as T[])[index];
}

export function useSetListItem<T>(
	tokenId: TokenId<T[]>,
	index: number,
) {
	const store = React.useContext(StoreContext);
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

function useListValue<T>(
	tokenId: TokenId<T[]>,
	defaultValue?: T[],
	options = defaultOptions,
): T[] {
	const store = React.useContext(StoreContext);

	useUpdate(tokenId.key);
	useUpdate(
		options.changesFromChildren ? `${tokenId.key}-child` : undefined,
	);

	if (store[tokenId.key] === undefined) {
		store[tokenId.key] = defaultValue;
	}

	return store[tokenId.key] as T[];
}

function useSetList<T>(tokenId: TokenId<T[]>) {
	const store = React.useContext(StoreContext);
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
