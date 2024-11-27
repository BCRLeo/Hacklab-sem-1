import "./CarouselButton.css"

import React from "react";
import Button from "../Button/Button";

export default function CarouselButton({ direction, onClick, iconPath, text }) {
    return (
        <Button onClick={onClick} className={`carouselbutton ${direction}`}>
            {iconPath && <img src={iconPath} alt={`${direction} arrow`} />}
            {text && <span>{text}</span>}
        </Button>
    );
}