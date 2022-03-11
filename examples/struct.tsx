import React from 'react';
import {
	useItemValue,
	createItem,
	useItem,
	createStruct,
	useStructItem,
} from '../src';

const lastNameItem = createItem<string>('foo');
const childrenCollection = createStruct<string[]>('children');

interface ChildProps {
	index: number;
}

const Child = (props: ChildProps) => {
	const [isEditing, setEditing] = React.useState(false);
	const [firstName, setFirstName] = useStructItem(
		childrenCollection,
		props.index,
	);
	const lastName = useItemValue(lastNameItem);

	const onChange = (event: { target: HTMLInputElement }) => {
		setFirstName(event.target.value);
	};

	return (
		<li>
			{isEditing ? (
				<input onChange={onChange} value={firstName} />
			) : (
				firstName
			)}{' '}
			{lastName}{' '}
			{isEditing ? (
				<button onClick={() => setEditing(false)}>save</button>
			) : (
				<button onClick={() => setEditing(true)}>edit</button>
			)}
		</li>
	);
};

const Family = () => {
	const [lastName, setLastName] = useItem(lastNameItem, 'Parker');
	const [children, setChildren] = useItem(childrenCollection, []);

	React.useEffect(() => {
		setChildren(['Peter', 'Miles', 'Gwen']);
	}, [setChildren]);

	const onChange = (event: { target: HTMLInputElement }) => {
		setLastName(event.target.value);
	};

	return (
		<div>
			<label>
				Family Name{' '}
				<input type="text" value={lastName} onChange={onChange} />
			</label>
			<ul>
				{children.map((_, index) => {
					return <Child index={index} key={index} />;
				})}
			</ul>
		</div>
	);
};
export { Family as Collection };
