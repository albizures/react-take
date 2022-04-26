export interface TokenId<_T> {
	key: string;
}

export type SetterCallback<T> = (value: T) => T;
export const isSetCallback = <T>(cb: T | SetterCallback<T>): cb is SetterCallback<T> => {
	return typeof cb === 'function';
};

export type SetterOrVal<T> = T | SetterCallback<T>;
export type KeyOf<T> = T extends unknown[] ? number : keyof T;
export type ValOf<T> = T extends (infer U)[] ? U : T[keyof T];
