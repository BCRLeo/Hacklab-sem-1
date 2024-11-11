import './NavBar.css';
import React from 'react';
import NavItem from '../NavItem/NavItem';
import Dropdown from '../Dropdown/Dropdown';
import SearchBar from '../SearchBar/SearchBar';

const Navbar = () => {
	return (
		<nav className="navbar">
			<ul className="navbar-nav">
				<NavItem href="/" text="Home" />
				<NavItem href="/wardrobe" text="Wardrobe" />
				<NavItem href="/signup" text="Sign Up" />
				<NavItem>
					<SearchBar></SearchBar>
				</NavItem>
				{/* Dropdown component */}
				<NavItem>
					<Dropdown title="More">
						<NavItem href="/contact" text="Contact Us" />
						<NavItem href="/faq" text="FAQ" />
					</Dropdown>
				</NavItem>
			</ul>
		</nav>
	);
};

export default Navbar;