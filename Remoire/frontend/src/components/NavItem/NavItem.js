import './NavItem.css';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function NavItem({ href, text, children, onClick, className, activeClassName }) {
    if (children) {
        return <li className={`nav-item ${className ? className : ""}`}>{children}</li>;
    }

    return (
        <li className={`nav-item ${className ? className : ""}`}>
            {activeClassName ? (
                <NavLink to={href} className={({ isActive }) => "nav-link" + (isActive ? ` ${activeClassName}` : "")} onClick={onClick}>{text}</NavLink>
            ) : (
                <NavLink to={href} className="nav-link" onClick={onClick}>{text}</NavLink>
            )}
        </li>
    );
}