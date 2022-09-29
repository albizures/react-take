import React from 'react';
import { isSetCallback, SetterOrVal, Token, UnknowStore } from './types';

export function useSubscribeTo<T, S extends UnknowStore>(token: Token<T, S>) {
	const [, forceUpdate] = React.useState(0);

	React.useEffect(() => {
		const { store, key } = token;
		const { emitter } = store;
		const onChange = () => {
			forceUpdate((val) => val + 1);
		};

		emitter.on(key, onChange);

		return () => {
			emitter.off(key, onChange);
		};
	}, [token]);
}

export function setItem<T, S extends UnknowStore>(
	token: Token<T, S>,
	newValue: SetterOrVal<T>,
) {
	const { store, key } = token;
	const { value: storeValue, emitter } = store;

	(storeValue[token.key] as T) = isSetCallback(newValue)
		? newValue(storeValue[token.key] as T)
		: newValue;
	emitter.emit(key);
}

export function getItem<T, S extends UnknowStore>(token: Token<T, S>): T;
export function getItem<T, S extends UnknowStore>(
	token: Token<T, S>,
	defaultValue?: T,
): T | undefined;
export function getItem<T, S extends UnknowStore>(token: Token<T, S>, defaultValue?: T) {
	const { store, key } = token;

	return (store.value[key] as T) || defaultValue || token.defaultValue;
}
