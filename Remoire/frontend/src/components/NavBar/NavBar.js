import './NavBar.css';

import React from 'react';
import Dropdown from '../Dropdown/Dropdown';
import Icon from '../Icon/Icon';
import NavItem from '../NavItem/NavItem';
import SearchBar from '../SearchBar/SearchBar';

import { Link } from 'react-router-dom';
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

	if (user && user !== -1) {
		return (
			<nav className="navbar">
				<ul className="navbar-nav">
					<NavItem><Icon name="logoIcon" /></NavItem>
					<NavItem href="/feed" text="Explore" activeClassName="active" />
					<NavItem className="search">
						<SearchBar></SearchBar>
					</NavItem>
					<NavItem href="/wardrobe" text="Wardrobe" activeClassName="active" />
					<NavItem>
						<Dropdown renderToggle={(dropdownProps) => <Link to={`/${user.username}`}><Icon name="accountIcon" {...dropdownProps} /></Link>}>
							<NavItem text="Log out" onClick={handleLogout} />
						</Dropdown>
					</NavItem>
				</ul>
			</nav>
		);
	}

	return (
		<nav className="navbar">
			<ul className="navbar-nav">
				<NavItem><Icon name="logoIcon" /></NavItem>
				{/* <NavItem href="/" text="Home" activeClassName="active" /> */}
				<NavItem href="/feed" text="Explore" activeClassName="active" />
				<NavItem className="search">
					<SearchBar></SearchBar>
				</NavItem>
				<NavItem href="/login" text="Log in" className={location.pathname === "/login" ? "active" : ""} />
				<NavItem href="/signup" text="Sign up" className={location.pathname === "/signup" ? "active" : ""} />
			</ul>
		</nav>
	);
}