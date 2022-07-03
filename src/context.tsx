import React from 'react';
import mitt from 'mitt';

export const defaultEmitter = mitt();

export const EmitterContext = React.createContext(defaultEmitter);
