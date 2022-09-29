import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react-hooks/native';
import { createItem } from './item';
import { useSubscribeTo, setItem, getItem } from './utils';

describe('useSubscribeTo', () => {
	it('should update the component', async () => {
		const item = createItem('item1', 0);
		const emitter = item.store.emitter;
		const { result } = renderHook(() => useSubscribeTo(item));

		act(() => {
			emitter.emit(item.key);
		});

		// A second value means a render just happened
		expect(result.all.length).toBe(2);
	});

	describe('when the component is unmounted', () => {
		it('should unsubscribe from the event', () => {
			const item = createItem('item2', 0);
			const emitter = item.store.emitter;
			const spy = vi.spyOn(emitter, 'off');
			const { unmount } = renderHook(() => useSubscribeTo(item));

			unmount();
			expect(spy).toHaveBeenCalledOnce();
		});
	});
});

describe('setItem', () => {
	it('should change the value of the item', () => {
		const item = createItem('item3', 0);
		const newValue = 1;
		setItem(item, newValue);

		expect(item.store.value[item.key]).toBe(newValue);
	});

	it('should emit the change', () => {
		const item = createItem('item4', 0);
		const emitter = item.store.emitter;
		const newValue = 2;

		emitter.on(item.key, () => {
			expect(item.store.value[item.key]).toBe(newValue);
		});

		setItem(item, newValue);
	});

	it('should allow to use a setter function', () => {
		const item = createItem('item5', 0);
		const current = item.store.value[item.key] as number;
		setItem(item, (current) => current + 1);

		expect(item.store.value[item.key]).toBe(current + 1);
	});
});

describe('getItem', () => {
	it('should return the current value of the item', () => {
		const item = createItem('item5', 0);

		expect(getItem(item)).toBe(0);

		item.store.value[item.key] = 10;

		expect(getItem(item)).toBe(10);
	});
});
