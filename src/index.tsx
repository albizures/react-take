import React from 'react';
import type { Emitter, EventType } from 'mitt';
import {
	defaultEmitter,
	defaultStore,
	StoreContext,
	EmitterContext,
} from './context';

interface Props {
	emitter?: Emitter<Record<EventType, unknown>>;
	store?: Record<string, unknown>;
}

export const TakeRoot: React.FC<Props> = (props) => {
	const [emitter] = React.useState(props.emitter || defaultEmitter);
	const { children, store = defaultStore() } = props;

	const storeRef = React.useRef(store);

	React.useEffect(() => {
		return () => {
			emitter.all.clear();
		};
	}, [emitter]);

	return (
		<EmitterContext.Provider value={emitter}>
			<StoreContext.Provider value={storeRef}>
				{children}
			</StoreContext.Provider>
		</EmitterContext.Provider>
	);
};

export {
	createItem,
	useSetItem,
	useItemValue,
	useItem,
} from './item';

export {
	createList,
	useList,
	useListItem,
	useListItemValue,
	useSetListItem,
} from './collection';
