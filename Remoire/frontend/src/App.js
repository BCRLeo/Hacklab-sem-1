import './App.css';
import React, { useState, useEffect } from "react";
import MediaQueryProvider from './MediaQueryContext';

import FeedPage from './pages/Feed/FeedPage';
import HomePage from "./pages/Home/HomePage"
import LogInPage from './pages/LogIn/LogInPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SearchPage from './pages/Search/SearchPage';
import SignUpPage from "./pages/SignUp/SignUpPage"
import WardrobePage from './pages/Wardrobe/WardrobePage';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './UserContext';

export default function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState("");
	const [user, setUser] = useState({"isLoggedIn": isLoggedIn, "username": username});

	// Fetch login status from Flask
	useEffect(() => {
		fetch('/api/check-login')
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				setIsLoggedIn(true);
				setUsername(data.user.username);
				setUser(data.user);
			}
		})
		.catch((error) => {
			console.error('Error fetching login status:', error);
		});
	}, []);

	return (
		<MediaQueryProvider>
			<UserProvider>
				<Router>
					<Routes>
						<Route path="/feed" element={<FeedPage />} />
						<Route path="/" element={<HomePage />} />
						<Route path="/home" element={<HomePage />} />
						<Route path="/login" element={<LogInPage />} />
						<Route path="/profile" element={<ProfilePage />} />
						<Route path="/signup" element={<SignUpPage />} />
						<Route path="/wardrobe" element={<WardrobePage />} />
						<Route path="/search" element={<SearchPage />} />
				</Routes>
				</Router>
			</UserProvider>
		</MediaQueryProvider>
	);
}