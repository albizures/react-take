import React from 'react';
import mitt from 'mitt';

export const defaultEmitter = mitt();
export const defaultStore: Record<string, unknown> = {};

export const EmitterContext = React.createContext(defaultEmitter);
export const StoreContext = React.createContext(defaultStore);
