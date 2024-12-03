import useHoverAndClick from "../../hooks/useHoverAndClick";
import useCarouselLayout from "../../hooks/useCarouselLayout";

import CarouselButton from "../CarouselButton/CarouselButton";
import IconArrowLeft from "../../assets/icons/icon__arrow-left.svg";
import IconArrowRight from "../../assets/icons/icon__arrow-right.svg";

import { useEffect, useRef, useState } from "react";

export default function ImageCarousel({ className = "", images, imageClassName, hoveredClassName, clickedClassName }) {
    const carouselRef = useRef(null);
    const { visibleImageCount, imageSize } = useCarouselLayout(carouselRef);
    const { hoveredIndex, clickedIndex, handleMouseEnter, handleMouseLeave, handleClick, setHoveredIndex, setClickedIndex } = useHoverAndClick();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setHoveredIndex(null);
    }, [hoveredClassName]);

    useEffect(() => {
        setClickedIndex(null);
    }, [clickedClassName]);

    const handleClickPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleClickNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div ref={carouselRef} className={`carousel ${className}`}>
            <CarouselButton direction="left" onClick={handleClickPrevious} iconPath={IconArrowLeft} />

            {Array(visibleImageCount).fill().map((_, i) => {
                const index = (currentIndex + i) % images.length;
                return (
                    <img
                        key={i}
                        className={`
                            carousel-image
                            ${imageClassName}
                            ${hoveredIndex === i ? hoveredClassName : ""}
                            ${clickedIndex === i ? clickedClassName : ""}
                        `}
                        src={images[index]}
                        alt={`slide ${index + 1}`}
                        onMouseEnter={() => handleMouseEnter(i)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(i)}
                    />
                );
            })}

            <CarouselButton direction="right" onClick={handleClickNext} iconPath={IconArrowRight} />
        </div>
    );
}