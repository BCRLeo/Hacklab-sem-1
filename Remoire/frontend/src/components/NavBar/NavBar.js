import './NavBar.css';

import React from 'react';
import Dropdown from '../Dropdown/Dropdown';
import Icon from '../Icon/Icon';
import NavItem from '../NavItem/NavItem';
import SearchBar from '../SearchBar/SearchBar';

import { useContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';

export default function Navbar() {
	const location = useLocation();
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
				<NavItem href="/" text="Home" className={location.pathname === "/" ? "active" : ""} />
				<NavItem href="/feed" text="Feed" className={location.pathname === "/feed" ? "active" : ""} />
				<NavItem className="search">
					<SearchBar></SearchBar>
				</NavItem>
				{user && user !== -1 ? 
					<>
						<NavItem href="/wardrobe" text="Wardrobe" className={location.pathname === "/wardrobe" ? "active" : ""} />
						<NavItem text="Log out" onClick={handleLogout} />
					</>
					: 
					<>
						<NavItem href="/login" text="Wardrobe" />
						<NavItem href="/login" text="Log in" className={location.pathname === "/login" ? "active" : ""} />
						<NavItem href="/signup" text="Sign up" className={location.pathname === "/signup" ? "active" : ""} />
					</>
				}
				<NavItem>
					<Dropdown renderItem={(dropdownProps) => <Icon name="accountIcon" {...dropdownProps} />}>
					{user && user !== -1 ? 
					<>
						<NavItem text="Log out" onClick={handleLogout} />
					</>
					: 
					<>
						<NavItem href="/login" text="Log in" className={location.pathname === "/login" ? "active" : ""} />
						<NavItem href="/signup" text="Sign up" className={location.pathname === "/signup" ? "active" : ""} />
					</>
				}
					</Dropdown>
				</NavItem>
			</ul>
		</nav>
	);
}