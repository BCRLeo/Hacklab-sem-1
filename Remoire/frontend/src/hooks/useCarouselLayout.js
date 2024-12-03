import { useState, useEffect } from "react";

export default function useCarouselLayout(carouselRef) {
    const [carouselSize, setCarouselSize] = useState({ width: 0, height: 0 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [visibleImageCount, setVisibleImageCount] = useState(0);

    useEffect(() => {
        const updateSize = () => {
            if (carouselRef.current) {
                const carouselWidth = carouselRef.current.offsetWidth;
                const carouselHeight = carouselRef.current.offsetHeight;
                const imageWidth = carouselHeight * (4 / 5);

                setCarouselSize({ width: carouselWidth, height: carouselHeight });
                setImageSize({ width: imageWidth, height: carouselHeight });
                setVisibleImageCount(Math.floor(carouselWidth / imageWidth));
            }
        };

        const observer = new ResizeObserver(updateSize);
        if (carouselRef.current) {
            observer.observe(carouselRef.current);
        }

        return () => {
            if (carouselRef.current) {
                observer.unobserve(carouselRef.current);
            }
        };
    }, [carouselRef]);

    return { carouselSize, imageSize, visibleImageCount };
};