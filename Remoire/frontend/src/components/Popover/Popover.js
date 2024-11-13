import Card from "../Card/Card";

import { useState } from "react";

const Popover = ({ label, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePopover = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="popover">
            <button className="popover-toggle" onClick={togglePopover}>
                {label}
            </button>
            <Card>
                {isOpen && children}
            </Card>
        </div>
    );
};

export default Popover;