import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserProvider } from './UserContext';
import MediaQueryProvider from './MediaQueryContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<MediaQueryProvider>
			<UserProvider>
				<App />
			</UserProvider>
		</MediaQueryProvider>
	</React.StrictMode>
);