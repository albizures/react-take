import React from 'react';
import ReactDOM from 'react-dom';

import { Basic } from './basic';

function App() {
	return (
		<div>
			<Basic />
		</div>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root'),
);
