import { useUpdate } from './utils';
import {
	isSetCallback,
	SetItem,
	SetterOrVal,
	StoreToken,
	Token,
	UnknowStore,
} from './types';
import { EmitterContext } from './context';
import React from 'react';
import { defaulStore } from './store';

export function createItemHooks<S extends UnknowStore>(storeToken: StoreToken<S>) {
	const store = storeToken.value;

	/**
	 * Returns the value of the given item, and
	 * subscribes the component to the item updates
	 */
	function useItemValue<T>(token: Token<T, S>, defaultValue: T): T;
	function useItemValue<T>(token: Token<T, S>, defaultValue?: undefined): T | undefined;
	function useItemValue<T>(token: Token<T, S>, defaultValue?: T) {
		useUpdate(token.key);

		return (store[token.key] as T) || defaultValue || token.defaultValue;
	}

	/**
	 * Returns a setter function for the given item, without
	 * subscribing the component to the item updates
	 */
	function useSetItem<T>(token: Token<T, S>) {
		const emitter = React.useContext(EmitterContext);
		return React.useCallback(
			(value: SetterOrVal<T>) => {
				(store[token.key] as T) = isSetCallback(value)
					? value(store[token.key] as T)
					: value;

				emitter.emit(token.key);
			},
			[emitter, token.key],
		);
	}

	/**
	 * Similar to React.useState, returns a tuples where the first element
	 * is the item value and the second is a setter function
	 */
	function useItem<T>(token: Token<T, S>, defaultValue: T): [T, SetItem<T>];
	function useItem<T>(
		token: Token<T, S>,
		defaultValue?: undefined,
	): [T | undefined, SetItem<T>];
	function useItem<T>(token: Token<T, S>, defaultValue?: T) {
		return [useItemValue(token, defaultValue), useSetItem(token)];
	}

	return {
		useItemValue,
		useSetItem,
		useItem,
		createItem: storeToken.token,
	};
}

export const { useItemValue, useSetItem, useItem, createItem } =
	createItemHooks(defaulStore);
