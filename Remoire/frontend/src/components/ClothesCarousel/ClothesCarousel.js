import { getClothingIds, getClothingImageEndpoints } from "../../api/wardrobe";

import useHoverAndClick from "../../hooks/useHoverAndClick";
import useCarouselLayout from "../../hooks/useCarouselLayout";

import CarouselButton from "../CarouselButton/CarouselButton";
import IconArrowLeft from "../../assets/icons/icon__arrow-left.svg";
import IconArrowRight from "../../assets/icons/icon__arrow-right.svg";
import { UserContext } from "../../UserContext";

import { useContext, useEffect, useRef, useState } from "react";

export default function ClothesCarousel({ className = "", itemType, imageClassName, hoveredClassName, clickedClassName, isPendingUpdate }) {
    const { user } = useContext(UserContext);

    const carouselRef = useRef(null);
    const { visibleImageCount, imageSize } = useCarouselLayout(carouselRef);
    const { hoveredIndex, clickedIndex, handleMouseEnter, handleMouseLeave, handleClick, setHoveredIndex, setClickedIndex } = useHoverAndClick();
    const [currentIndex, setCurrentIndex] = useState(0);

    const [itemIds, setItemIds] = useState([]);

    useEffect(() => {
        if (!user || user === -1) {
            return;
        }

        (async () => {
            const data = await getClothingIds(user.username, itemType);
            if (data !== null) {
                setItemIds(data);
            }
        })();
    }, [isPendingUpdate]);

    useEffect(() => {
        setHoveredIndex(null);
    }, [hoveredClassName]);

    useEffect(() => {
        setClickedIndex(null);
    }, [clickedClassName]);

    const handleClickPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + itemIds.length) % itemIds.length);
    };

    const handleClickNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % itemIds.length);
    };

    return (
        <div ref={carouselRef} className={`carousel ${className}`}>
            <CarouselButton direction="left" onClick={handleClickPrevious} iconPath={IconArrowLeft} />

            {Array(visibleImageCount).fill().map((_, i) => {
                const index = (currentIndex + i) % itemIds.length;
                return (
                    <img
                        key={i}
                        className={`
                            carousel-image
                            ${imageClassName}
                            ${hoveredIndex === i ? hoveredClassName : ""}
                            ${clickedIndex === i ? clickedClassName : ""}
                        `}
                        data-clothing-id={itemIds[index]}
                        src={`/api/wardrobe/items/${itemType}/${itemIds[index]}`}
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