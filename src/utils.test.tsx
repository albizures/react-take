import { describe, it, expect, spyOn } from 'vitest';
import { act, renderHook } from '@testing-library/react-hooks/native';
import { TakeRoot } from './';
import mitt from 'mitt';
import { useUpdate } from './utils';

describe('useUpdate', () => {
	it('should update the component', async () => {
		const emitter = mitt();
		const { result } = renderHook(() => useUpdate('some-name'), {
			wrapper: TakeRoot,
			initialProps: {
				emitter,
			},
		});

		act(() => {
			emitter.emit('some-name');
		});

		// A second value means a render just happened
		expect(result.all.length).toBe(2);
	});

	describe('when the component is unmounted', () => {
		it('should unsubscribe from the event', () => {
			const emitter = mitt();
			const spy = spyOn(emitter, 'off');
			const { unmount } = renderHook(() => useUpdate('some-name'), {
				wrapper: TakeRoot,
				initialProps: {
					emitter,
				},
			});

			unmount();
			expect(spy).toHaveBeenCalledOnce();
		});
	});
});
