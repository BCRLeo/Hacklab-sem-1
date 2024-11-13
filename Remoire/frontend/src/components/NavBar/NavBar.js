import './NavBar.css';

import React from 'react';
import NavItem from '../NavItem/NavItem';
import Dropdown from '../Dropdown/Dropdown';
import SearchBar from '../SearchBar/SearchBar';

import { useContext } from "react";
import { UserContext } from '../../UserContext';

const Navbar = () => {
	const { user, setUser } = useContext(UserContext);

	return (
		<nav className="navbar">
			<ul className="navbar-nav">
				<NavItem href="/" text="Home" />
				<NavItem href="/wardrobe" text="Wardrobe" />
				{user ? <NavItem href="/logout" text="Log out" /> : <><NavItem href="/login" text="Log in" /> <NavItem href="/signup" text="Sign up" /></>}
				<NavItem>
					<SearchBar></SearchBar>
				</NavItem>
				<NavItem href="/feed" text="Feed" />
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
};

export default Navbar;