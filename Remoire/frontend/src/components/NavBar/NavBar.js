import './NavBar.css';

import React from 'react';
import Dropdown from '../Dropdown/Dropdown';
import Icon from '../Icon/Icon';
import NavItem from '../NavItem/NavItem';
import SearchBar from '../SearchBar/SearchBar';

import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';

export default function Navbar() {
	const navigate = useNavigate();
	const { user, setUser } = useContext(UserContext);

	const handleLogout = async (event) => {
		try {
			const response = await fetch("/api/logout", {
				method: "GET"
			});

			const data = await response.json();

			if (response.ok && data.success) {
				setUser(null);
				navigate("/");
			} else {
				console.log("Logout failed: ", data.message);
			}
		} catch (error) {
			console.error("Error during logout: ", error);
		}
	};

	return (
		<nav className="navbar">
			<ul className="navbar-nav">
				<NavItem href="/" text="Home" />
				<NavItem href="/feed" text="Feed" />
				<NavItem>
					<SearchBar></SearchBar>
				</NavItem>
				{user && user !== -1 ? 
					<>
						<NavItem href="/wardrobe" text="Wardrobe" />
						<NavItem text="Log out" onClick={handleLogout} />
					</>
					: 
					<>
						<NavItem href="/login" text="Wardrobe" />
						<NavItem href="/login" text="Log in" />
						<NavItem href="/signup" text="Sign up" />
					</>
				}
				<NavItem href="/" text="Account">
					<Icon name="accountIcon" />
				</NavItem>
				{/* Dropdown component */}
				{/* <NavItem>
					<Dropdown title="More">
						<NavItem href="/contact" text="Contact Us" />
						<NavItem href="/faq" text="FAQ" />
					</Dropdown>
				</NavItem> */}
			</ul>
		</nav>
	);
}