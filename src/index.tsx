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
	const {
		emitter = defaultEmitter,
		store = defaultStore,
		children,
	} = props;
	return (
		<EmitterContext.Provider value={emitter}>
			<StoreContext.Provider value={store}>
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
