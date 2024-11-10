import './NavItem.css';
import React from 'react';
import { Link } from 'react-router-dom';

const NavItem = ({ href, text, children }) => {
    if (children) {
        return <li className="nav-item">{children}</li>;
    }

    return (
        <li className="nav-item">
            <Link to={href} className="nav-link">{text}</Link>
        </li>
    );
};

export default NavItem;