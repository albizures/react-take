import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react-hooks/native';
import { createItem, useItem, useSetItem, defaulStore, useItemValue } from './';

const counterItem = createItem<number>('counter');
const withDefaultItem = createItem<number>('with-default', 10);

function setDefaultValue() {
	defaulStore.value[counterItem.key] = 0;
}

describe('useSetItem', () => {
	beforeEach(() => {
		setDefaultValue();
	});

	it('should change the value', () => {
		const { result } = renderHook(() => useSetItem(counterItem), {
			initialProps: {
				children: <div />,
			},
		});

		act(() => {
			result.current(10);
		});

		expect(defaulStore.value[counterItem.key]).toBe(10);
	});
});

describe('useItemValue', () => {
	describe('with default value', () => {
		it('should return the default value', () => {
			const { result } = renderHook(() => useItemValue(withDefaultItem), {
				initialProps: {
					children: <div />,
				},
			});

			expect(result.current).toBe(withDefaultItem.defaultValue);
		});
	});
});

describe('useItem', () => {
	beforeEach(() => {
		setDefaultValue();
	});
	it('should change the value and update the component ', async () => {
		const { result } = renderHook(() => useItem(counterItem, 0));

		act(() => {
			result.current[1]((current) => {
				return current + 1;
			});
		});

		expect(result.current[0]).toBe(1);
	});
});
