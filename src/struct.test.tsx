import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks/native';
import { describe, expect, it, beforeEach } from 'vitest';
import { defaulStore } from './';
import { createStruct, useStruct, useStructItem } from './struct';

interface Counter {
	value: number;
	loops: number;
	start: number;
}

const counterStruct = createStruct<Counter>('counter', defaultValue());

function defaultValue(): Counter {
	return {
		value: 3,
		loops: 0,
		start: 3,
	};
}

const setDefaultValue = () => {
	defaulStore.value[counterStruct.key] ||= defaultValue();
	const counter = defaulStore.value[counterStruct.key] as Counter;
	counter.value = 3;
	counter.loops = 0;
	counter.start = 3;
};

describe('useStruct', () => {
	describe('when struct is empty', () => {
		beforeEach(() => {
			delete defaulStore.value[counterStruct.key];
		});

		it('should return the default value', () => {
			const { result } = renderHook(() => useStruct(counterStruct, defaultValue()));

			expect(result.current[0]).toEqual(defaultValue());
		});
		describe('when no default value is provided', () => {
			it('should return undefined', () => {
				const { result } = renderHook(() => useStruct(counterStruct));

				expect(result.current[0]).toEqual(undefined);
			});
		});
	});

	describe('when the struct changes', () => {
		beforeEach(() => {
			setDefaultValue();
		});
		it('should return the latest value', async () => {
			const { result } = renderHook(() => useStruct(counterStruct, defaultValue()));

			act(() => {
				result.current[1]('value', (value) => value - 1);
			});

			expect(result.current[0]).toEqual({
				loops: 0,
				start: 3,
				value: 2,
			});
		});
	});
});

describe('useStructItem', () => {
	beforeEach(() => {
		setDefaultValue();
	});
	it('return a current value and a setter', () => {
		const { result } = renderHook(() => useStructItem(counterStruct, 'value'), {
			initialProps: {
				children: <div />,
			},
		});

		expect(result.current[0]).toEqual(defaultValue()['value']);
		act(() => {
			result.current[1](10);
		});
		expect(result.current[0]).toEqual(10);
	});

	describe('when the struct is empty', () => {
		it('should set the default value', () => {
			const { result } = renderHook(() => useStructItem(counterStruct, 'value', 10), {
				initialProps: {
					children: <div />,
				},
			});

			expect(result.current[0]).toEqual(10);
		});
	});
});
