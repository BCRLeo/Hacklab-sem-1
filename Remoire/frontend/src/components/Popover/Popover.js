import "./Popover.css"

import Card from "../Card/Card";

import { useState, useRef, useEffect } from "react";

const Popover = ({ label, children }) => {
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
            <button className="popover-toggle" onClick={togglePopover}>
                {label}
            </button>
            {isOpen && (
                <Card className="popover-content">
                    {children}
                </Card>
            )}
        </div>
    );
};

export default Popover;