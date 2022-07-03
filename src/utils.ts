import React from 'react';
import invariant from 'tiny-invariant';
import { EmitterContext } from './context';

export function useUpdate(eventName?: string | symbol) {
	const emitter = React.useContext(EmitterContext);
	const [, forceUpdate] = React.useState(0);

	React.useEffect(() => {
		invariant(eventName, 'React Take: An event is required');

		const onChange = () => {
			forceUpdate((val) => val + 1);
		};

		emitter.on(eventName, onChange);

		return () => {
			emitter.off(eventName, onChange);
		};
	}, [emitter, eventName]);
}
