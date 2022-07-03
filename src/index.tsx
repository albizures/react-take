import React from 'react';
import type { Emitter, EventType } from 'mitt';
import { defaultEmitter, EmitterContext } from './context';

interface Props {
	emitter?: Emitter<Record<EventType, unknown>>;
	children: React.ReactNode;
}

export function TakeRoot(props: Props) {
	const [emitter] = React.useState(props.emitter || defaultEmitter);
	const { children } = props;

	React.useEffect(() => {
		return () => {
			emitter.all.clear();
		};
	}, [emitter]);

	return <EmitterContext.Provider value={emitter}>{children}</EmitterContext.Provider>;
}

export { defaulStore } from './store';

export { createItem, useSetItem, useItemValue, useItem } from './item';
