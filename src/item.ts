import React from 'react';
import { getItem, setItem, useSubscribeTo } from './utils';
import {
	SetItem,
	SetterOrVal,
	StoreToken,
	Token,
	TokenWithDefault,
	TokenWithoutDefault,
	UnknowStore,
} from './types';
import { defaulStore } from './store';

export function createItemHooks<S extends UnknowStore>(storeToken: StoreToken<S>) {
	/**
	 * Returns the value of the given item, and
	 * subscribes the component to the item updates
	 */
	function useItemValue<T>(token: TokenWithDefault<T, S>, defaultValue?: T): T;
	function useItemValue<T>(token: TokenWithDefault<T, S>): T;
	function useItemValue<T>(token: TokenWithoutDefault<T, S>, defaultValue: T): T;
	function useItemValue<T>(
		token: TokenWithoutDefault<T, S>,
		defaultValue?: undefined,
	): T | undefined;
	function useItemValue<T>(token: Token<T, S>, defaultValue?: T) {
		useSubscribeTo(token);

		return getItem(token, defaultValue);
	}

	/**
	 * Returns a setter function for the given item, without
	 * subscribing the component to the item updates
	 */
	function useSetItem<T>(token: Token<T, S>) {
		return React.useCallback((value: SetterOrVal<T>) => setItem(token, value), [token]);
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
