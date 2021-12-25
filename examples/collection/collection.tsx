import React from 'react';
import ReactDOM from 'react-dom';
import { TakeRoot } from '../../src';
import App from './App';

ReactDOM.render(
	<React.StrictMode>
		<TakeRoot>
			<App />
		</TakeRoot>
	</React.StrictMode>,
	document.getElementById('root'),
);
