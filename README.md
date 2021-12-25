# React Take

> _Take your data and get out here!_

> A simple and straight to point state management library for React

## Installation

```bash
	npm install react-take
	# or
	yarn add react-take
```

## Demo

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {
	TakeRoot,
	createItem,
	useItem,
	useItemValue,
} from '../../src';

const nameItem = createItem('name');

const Nested = () => {
	const [name, setName] = useItem(nameItem);
	const onChange = (event) => {
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
```

## Feedback

If you have any feedback, please reach out to us at [@albzrs](https://twitter.com/albzrs)

## Acknowledgements

The api of this libray was heavily inspired in [Recoil.js](https://recoiljs.org/)

## License

[MIT](https://choosealicense.com/licenses/mit/)
