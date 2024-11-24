import './NavItem.css';
import React from 'react';
import { Link } from 'react-router-dom';

export default function NavItem({ href, text, children, onClick }) {
    if (children) {
        return <li className="nav-item">{children}</li>;
    }

    return (
        <li className="nav-item">
            <Link to={href} className="nav-link" onClick={onClick}>{text}</Link>
        </li>
    );
}