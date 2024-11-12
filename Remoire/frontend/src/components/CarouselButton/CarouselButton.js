import "./CarouselButton.css"

import React from "react";

const CarouselButton = ({ direction, onClick, iconPath, text }) => {
    return (
        <button onClick={onClick} className={`carouselbutton ${direction}`}>
            {iconPath && <img src={iconPath} alt={`${direction} arrow`} />}
            {text && <span>{text}</span>}
        </button>
    );
}

export default CarouselButton;