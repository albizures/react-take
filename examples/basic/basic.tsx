import React from 'react';
import ReactDOM from 'react-dom';
import {
	TakeRoot,
	createItem,
	useItem,
	useItemValue,
} from '../../src';

const nameItem = createItem<string>('name');

const Nested = () => {
	const [name, setName] = useItem(nameItem);
	const onChange = (event: { target: HTMLInputElement }) => {
		setName(event.target.value);
	};

	return (
		<div>
			<label>
				Enter name: <input onChange={onChange} value={name} />
			</label>
		</div>
	);
};

const App = () => {
	const name = useItemValue(nameItem, 'John');

	return (
		<div>
			<h3>{name}</h3>
			<Nested />
		</div>
	);
};

ReactDOM.render(
	<TakeRoot>
		<App />
	</TakeRoot>,
	document.getElementById('root'),
);
