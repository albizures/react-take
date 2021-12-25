import React from 'react';
import { test, expect } from 'vitest';

import {
	fireEvent,
	render,
	screen,
	waitFor,
} from '@testing-library/react';
import App from '../examples/collection/App';

test('basic test 2', async () => {
	render(<App />);

	const input =
		screen.getByLabelText<HTMLInputElement>('Family Name');

	fireEvent.change(input, { target: { value: 'Doe' } });

	expect(input.value).toBe('Doe');

	await waitFor(() => screen.getAllByRole('listitem'));

	screen.getAllByRole<HTMLLIElement>('listitem').forEach((item) => {
		expect(item.textContent).toContain('Doe');
	});
});
