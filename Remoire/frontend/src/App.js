import './App.css';
import React, { useState, useEffect, useContext } from "react";
import Clothes from './components/Clothes/Clothes';
import Header from './components/Header/Header';
import Outfits from './components/Outfits/Outfits';
import Posts from './components/Posts/Posts';

import FeedPage from './pages/Feed/FeedPage';
import HomePage from "./pages/Home/HomePage"
import LogInPage from './pages/LogIn/LogInPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SearchPage from './pages/Search/SearchPage';
import SignUpPage from "./pages/SignUp/SignUpPage"
import WardrobePage from './pages/Wardrobe/WardrobePage';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function App() {
	const { user } = useContext(UserContext);

	return (
		<Router>
			<Header />
			<Routes>
				<Route index element={user && user !== -1 ? <Navigate to="feed" replace /> : <HomePage />} />
				<Route path="feed" element={<FeedPage />} />
				<Route path="login" element={<LogInPage />} />
				<Route path="signup" element={<SignUpPage />} />
				<Route path=":username" element={<ProfilePage />}>
					<Route index element={<Navigate to="posts" replace />} />
					<Route path="posts" element={<Posts />} />
					<Route path="clothes" element={<Clothes />} />
					<Route path="outfits" element={<Outfits />} />
				</Route>
				<Route path="wardrobe" element={<WardrobePage />}>
					<Route index element={<Navigate to="clothes" replace />} />
					<Route path="clothes" element={<Clothes />} />
					<Route path="outfits" element={<Outfits />} />
				</Route>
				<Route path="search" element={<SearchPage />} />
				{/* Catch-all route to redirect to feed */}
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</Router>
	);
}