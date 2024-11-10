import React, { useState } from 'react';

const Dropdown = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="dropdown">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
                {title}
            </button>
            {isOpen && (
                <ul className="dropdown-menu">
                    {children}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;