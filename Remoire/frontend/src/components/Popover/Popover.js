import "./Popover.css"

import Card from "../Card/Card";

import { useState, useRef, useEffect } from "react";

/**
 * Popover component that displays a toggleable popover menu.
 *
 * @component
 * @param {Function} renderToggle - A function that renders the toggle button for the popover. This function receives an object containing the className and onClick handler for the button.
 * @param {React.ReactNode} children - The content to display inside the popover when it is open.
 * @returns {JSX.Element} The rendered popover component.
 *
 * @example
 * <Popover
 *   renderItem={({ className, onClick }) => (
 *     <button className={className} onClick={onClick}>Toggle Popover</button>
 *   )}
 * >
 *   <div>Popover Content</div>
 * </Popover>
 * 
 * @example
 * <Popover renderToggle={(dropdownProps) => <Button {...dropdownProps}>Upload item</Button>}>
 *     <div>Popover Content</div>
 * </Popover>
 */
export default function Popover({ renderToggle, children }) {
    const [isOpen, setIsOpen] = useState(false);
    const newRef = useRef(null);

    const  handleClickOutside = (event) => {
        if (newRef.current && !newRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
    
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    const togglePopover = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="popover-container" ref={newRef}>
            {renderToggle({className: "popover-toggle", onClick: togglePopover})}
            {isOpen && (
                <Card className="popover-content">
                    {children}
                </Card>
            )}
        </div>
    );
}