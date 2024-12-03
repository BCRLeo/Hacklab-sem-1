import { useState } from "react";

export default function useHoverAndClick() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [clickedIndex, setClickedIndex] = useState(null);

    const handleMouseEnter = (index) => setHoveredIndex(index);
    const handleMouseLeave = () => setHoveredIndex(null);
    const handleClick = (index) => setClickedIndex(index);

    return {
        hoveredIndex,
        clickedIndex,
        handleMouseEnter,
        handleMouseLeave,
        handleClick,
        setHoveredIndex,
        setClickedIndex
    };
}