# ✊ React Take

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
import { createItem, useItem, useItemValue } from '../../src';

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

ReactDOM.render(<App />, document.getElementById('root'));
```

## API

### createItem(key: string, defaultValue?): Token

Creates a new item and returns its 'id'

### useItem(token: Token, defaultValue?): [value, Setter]

Similar to React.useState, returns a tuples where the first element is the item value and the second is a setter function

### useSetItem(token: Token): Setter

Returns a setter function for the given item, without subscribing the component to the item updates

### useItemValue(token: Token, defaultValue?): value

Returns the value of the given item, and subscribes the component to the item updates

### createStruct(key: string, defaultValue?): Token

Creates a new struct and returns its 'id'

### useStruct(token: Token, defaultValue?): [value, Setter]

Similar to React.useState, returns a tuples where the first element is the struct value and the second is a setter function for any item in the struc

### useSetStruct(token: Token): Setter

Returns a setter function for any item in given struct, without subscribing the component to the struct updates

### useStructValue(token: Token<T>, defaultValue?):

Returns the struct value, and subscribes the component to the struct updates and any item update

### useStructItem(token: Token, item: string | number, defaultValue?): [value, Setter]

Returns the item value in the given struct, and subscribes the component to the struct updates

### useSetStructItem(token: Token, item: string | number): Setter

Returns a setter function for an item in given struct, without subscribing the component to the item updates

### useStructItemValue(token: Token, item: string | number, defaultValue?): value

Returns the item value in the given struct, and subscribes the component to the item updates

## Feedback

If you have any feedback, please reach out to us at [@albzrs](https://twitter.com/albzrs)

## Acknowledgements

The api of this libray was heavily inspired in [Recoil.js](https://recoiljs.org/)

## License

[MIT](https://choosealicense.com/licenses/mit/)
