import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks/native';
import { describe, expect, it } from 'vitest';
import { TakeRoot } from './';
import { createStruct, useStruct, useStructItem } from './struct';

interface Counter {
	value: number;
	loops: number;
	start: number;
}

const counterStruct = createStruct<Counter>('counter');
const defaultValue = (): Counter => ({
	value: 3,
	loops: 0,
	start: 3,
});

describe('useStruct', () => {
	describe('when struct is empty', () => {
		it('should return the default value', () => {
			const { result } = renderHook(() => useStruct(counterStruct, defaultValue()), {
				wrapper: TakeRoot,
			});

			expect(result.current[0]).toEqual(defaultValue());
		});
		describe('when no default value is provided', () => {
			it('should return undefined', () => {
				const { result } = renderHook(() => useStruct(counterStruct), {
					wrapper: TakeRoot,
				});

				expect(result.current[0]).toEqual(undefined);
			});
		});
	});

	describe('when the struct changes', () => {
		it('should return the latest value', async () => {
			const { result } = renderHook(() => useStruct(counterStruct, defaultValue()), {
				wrapper: TakeRoot,
			});

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
	it('return a current value and a setter', () => {
		const { result } = renderHook(() => useStructItem(counterStruct, 'value'), {
			wrapper: TakeRoot,
			initialProps: {
				children: <div />,
				store: {
					[counterStruct.key]: defaultValue(),
				},
			},
		});

		expect(result.current[0]).toEqual(defaultValue()['value']);
		act(() => {
			result.current[1](10);
		});
		expect(result.current[0]).toEqual(10);
	});

	describe('when the struct is empty', () => {
		it('should', () => {
			const { result } = renderHook(() => useStructItem(counterStruct, 'value', 10), {
				wrapper: TakeRoot,
				initialProps: {
					children: <div />,
					store: {
						[counterStruct.key]: {},
					},
				},
			});

			expect(result.current[0]).toEqual(10);
		});
	});
});
