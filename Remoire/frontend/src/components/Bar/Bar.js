import "./Bar.css"

import React from "react";

/**
 * 
 * @param {"horizontal" | "vertical"} orientation - The orientation in which the bar elements should be arranged
 * @param {React.ReactNode} children - The elements to be placed in the bar
 * 
 * @returns {JSX.Element}
 */

export default function Bar({ orientation, children, className }) {
    const childrenArray = React.isValidElement(children) ? [children] : children;

    return (
        <ul className={`${orientation ? `bar ${orientation}` : "bar"} ${className ? className : ""}`}>
            {childrenArray.map((child, index) => (
                <li key={index} className={`bar-item ${className ? className : ""}`}>{child}</li>
            ))}
        </ul>
    );
}