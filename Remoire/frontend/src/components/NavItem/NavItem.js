import './NavItem.css';
import React from 'react';
import { Link } from 'react-router-dom';

export default function NavItem({ href, text, children, onClick, className }) {
    if (children) {
        return <li className={`nav-item ${className ? className : ""}`}>{children}</li>;
    }

    return (
        <li className={`nav-item ${className ? className : ""}`}>
            <Link to={href} className="nav-link" onClick={onClick}>{text}</Link>
        </li>
    );
}