export type KeyOf<T> = T extends unknown[] ? number : keyof T;
export type ValOf<T> = T extends (infer U)[] ? U : T[keyof T];

export type SetterCallback<T> = (value: T) => T;
export function isSetCallback<T>(cb: T | SetterCallback<T>): cb is SetterCallback<T> {
	return typeof cb === 'function';
}

export type SetItem<T> = (value: SetterOrVal<T>) => void;
export type SetterOrVal<T> = T | SetterCallback<T>;

export type UnknowStore = Record<string | number | symbol, unknown>;

export interface Token<T, S extends UnknowStore> {
	key: string | symbol;
	defaultValue?: T;
	store: StoreToken<S>;
}

export interface StoreToken<S extends UnknowStore> {
	key: string;
	token<T extends S[keyof S]>(key: keyof S, defaultValue: T): Token<T, S>;
	token<T extends S[keyof S]>(key: keyof S): Token<T, S>;
	getValue<T>(token: Token<T, S>, defaultValue: T): T;
	getValue<T>(token: Token<T, S>, defaultValue?: undefined): T | undefined;
	setValue<T extends S[keyof S]>(token: Token<T, S>, newValue: T): StoreToken<S>;
	value: S;
}
