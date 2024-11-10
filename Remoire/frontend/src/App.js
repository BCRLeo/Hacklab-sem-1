import './App.css';
import React, { useState, useEffect } from "react";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState('');

	// Fetch login status from Flask
	useEffect(() => {
		fetch('/api/check-login')
		.then((response) => response.json())
		.then((data) => {
			if (data.logged_in) {
				setIsLoggedIn(true);
				setUsername(data.username);
			}
		})
		.catch((error) => {
			console.error('Error fetching login status:', error);
		});
	}, []);

	return (
		<div className="App">
			<h1>Welcome to the React App</h1>
			{isLoggedIn ? (
				<div>
					<h2>Welcome back, {username}!</h2>
				</div>
			) : (
				<div>
					<h2>Please log in</h2>
				</div>
			)}
		</div>
	);
}

export default App;
