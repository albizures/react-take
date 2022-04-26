import React from 'react';
import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react-hooks/native';
import { createItem, TakeRoot, useItem, useSetItem } from './';
import { Store } from './context';

const counterItem = createItem<number>('counter');

describe('useSetItem', () => {
	it('should change the value', () => {
		const store: Store = {
			some: 'thing',
		};
		const { result } = renderHook(() => useSetItem(counterItem), {
			wrapper: TakeRoot,
			initialProps: {
				children: <div />,
				store,
			},
		});

		act(() => {
			result.current(10);
		});

		expect(store[counterItem.key]).toBe(10);
	});
});

describe('useItem', () => {
	it('should change the value and update the component ', async () => {
		const { result } = renderHook(() => useItem(counterItem, 0), {
			wrapper: TakeRoot,
		});

		act(() => {
			result.current[1]((current) => {
				return current + 1;
			});
		});

		expect(result.current[0]).toBe(1);
	});
});
