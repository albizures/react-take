import React from 'react';
import ReactDOM from 'react-dom';
import { createItem, TakeRoot, useItem, useItemValue } from '../src';

import { Basic } from './basic';
import { Collection } from './struct';

const exampleItem = createItem<string>('example');

const Button = (props: { name: string }) => {
	const { name } = props;
	const [current, setExample] = useItem(exampleItem);

	return (
		<button
			style={current === name ? { background: 'cadetblue' } : {}}
			onClick={() => setExample(name)}
		>
			{name}
		</button>
	);
};

function App() {
	const example = useItemValue(exampleItem, 'basic');

	return (
		<div>
			<Button name="basic" />
			<Button name="struct" />
			<hr />
			{example === 'basic' ? <Basic /> : <Collection />}
		</div>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<TakeRoot>
			<App />
		</TakeRoot>
	</React.StrictMode>,
	document.getElementById('root'),
);
