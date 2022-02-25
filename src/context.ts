import React from 'react';
import mitt from 'mitt';

export const defaultEmitter = mitt();

export type Store = Record<string, unknown>;
type StoreContextValue = React.MutableRefObject<Store>;

export const defaultStore = (): Store => ({});

const defaultValue: React.MutableRefObject<Store | null> =
	React.createRef();

defaultValue.current = defaultStore();

export const EmitterContext = React.createContext(defaultEmitter);
export const StoreContext: React.Context<StoreContextValue> =
	React.createContext(defaultValue as StoreContextValue);
