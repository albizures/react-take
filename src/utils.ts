import React from 'react';
import { EmitterContext } from './context';

export function useForceUpdate() {
	const [, setValue] = React.useState(0);
	return () => setValue((value) => value + 1);
}

export function useUpdate(eventName?: string) {
	const emitter = React.useContext(EmitterContext);
	const [, forceUpdate] = React.useState(0);

	React.useEffect(() => {
		if (!eventName) {
			return;
		}

		const onChange = () => {
			forceUpdate((val) => val + 1);
		};

		emitter.on(eventName, onChange);

		return () => {
			emitter.off(eventName, onChange);
		};
	}, [emitter, eventName]);
}
