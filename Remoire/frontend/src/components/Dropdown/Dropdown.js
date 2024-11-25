import "./Dropdown.css"

import React, { useState } from 'react';


export default function Dropdown({ renderItem, children }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="dropdown">
            {renderItem({className: "dropdown-toggle"})}
            <ul className="dropdown-menu">
                {children}
            </ul>
        </div>
    );

    return (
        <div className="dropdown">
            {renderItem({className: "dropdown-toggle", onClick: toggleDropdown})}
            {isOpen && (
                <ul className="dropdown-menu">
                    {children}
                </ul>
            )}
        </div>
    );
}