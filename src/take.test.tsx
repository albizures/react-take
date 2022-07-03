import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react-hooks/native';
import { createItem, useItem, useSetItem, defaulStore } from './';

const counterItem = createItem<number>('counter');

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
