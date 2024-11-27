import "./Dropdown.css"

import React, { useState } from 'react';

/**
 * Dropdown component that displays a toggleable dropdown menu upon hover.
 *
 * @component
 * @param {Function} renderToggle - A function that renders the toggle area for the dropdown. This function receives an object containing the className.
 * @param {React.ReactNode} children - The content to display inside the dropdown when it is open.
 * @returns {JSX.Element} The rendered dropdown component.
 *
 * @example
 * <Dropdown renderToggle={(dropdownProps) => <Icon name="accountIcon" {...dropdownProps} />}>
 *     <div>Dropdown Content</div>
 * </Dropdown>
 */
export default function Dropdown({ renderToggle, children }) {
    return (
        <div className="dropdown">
            {renderToggle({className: "dropdown-toggle"})}
            <ul className="dropdown-menu">
                {children}
            </ul>
        </div>
    );
}