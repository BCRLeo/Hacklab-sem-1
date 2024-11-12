import './App.css';
import React, { useState, useEffect } from "react";

import Feed from './pages/Feed/Feed';
import Home from "./pages/Home/Home"
import SignUp from "./pages/SignUp/SignUp"
import Wardrobe from './pages/Wardrobe/Wardrobe';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/wardrobe" element={<Wardrobe />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/feed" element={<Feed />} />
			</Routes>
		</Router>
	);
}

{/* <div className="App">
			<Home />
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
		</div> */}

export default App;