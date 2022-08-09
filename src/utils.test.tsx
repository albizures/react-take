import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react-hooks/native';
import { createItem } from './item';
import { useSubscribeTo } from './utils';

const item = createItem('item');

describe('useSubscribeTo', () => {
	it('should update the component', async () => {
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
			const emitter = item.store.emitter;
			const spy = vi.spyOn(emitter, 'off');
			const { unmount } = renderHook(() => useSubscribeTo(item));

			unmount();
			expect(spy).toHaveBeenCalledOnce();
		});
	});
});
