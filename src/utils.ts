import React from 'react';
import { Token, UnknowStore } from './types';

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
