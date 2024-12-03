import "./TabBar.css"

import Bar from "../Bar/Bar";
import { Link, useLocation } from "react-router-dom";

export default function TabBar({ orientation = "horizontal", links, className }) {
    const location = useLocation();

    return (
        <Bar orientation={orientation} className={`tabbar ${className ? className : ""}`}>
            {links.map(link => (
                <Link to={link.href} className={`tabbar-link ${location.pathname === link.href ? "active" : ""}`}>{link.label}</Link>
            ))}
        </Bar>
    );
}