import "./Carousel.css"

import CarouselButton from "../CarouselButton/CarouselButton";
import IconArrowLeft from "../../assets/icons/icon__arrow-left.svg";
import IconArrowRight from "../../assets/icons/icon__arrow-right.svg";

import { useEffect, useRef, useState } from "react";

const Carousel = ({ images, children }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const carouselRef = useRef(null);
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
				setVisibleImageCount( Math.floor(carouselWidth / imageWidth) );
			}
		};

		const observer = new ResizeObserver(() => {
			updateSize();
		});

		if (carouselRef.current) {
			observer.observe(carouselRef.current);
		}

		return () => {
			if (carouselRef.current) {
				observer.unobserve(carouselRef.current);
			}
		};
	}, []);

	const handleClickPrevious = () => {
		setCurrentIndex((currentIndex) => (currentIndex - 1 + images.length) % images.length);
	};

	const handleClickNext = () => {
		setCurrentIndex((currentIndex) => (currentIndex + 1) % images.length);
	};

	let visibleRange = 2;
	// width / (height / 5 * 4)
	/* if (visibleRange * 2 + 1 > images.length) {
		visibleRange = Math.min(Math.floor(images.length / 2) - 1, 0);
	} */
	// FIX FIX FIX

	let visibleImages = [];
	for (let i = 0; i < visibleImageCount; i++) {
		let index = (currentIndex + i + images.length) % images.length;
		visibleImages.push(<img className="carousel-image" key={index} src={images[index]} alt={`slide ${index + 1}`} />);
	}
	/* for (let i = -1 * visibleRange; i <= visibleRange; i++) {
		let index = (currentIndex + i + images.length) % images.length;
		visibleImages.push(<img className="carousel-image" key={index} src={images[index]} alt={`slide ${index + 1}`} />);
		console.log(`i = ${i}, index = ${index}`);
	} */

	if (images && images.length > 0) {
		return (
			<div className="carousel" ref={carouselRef}>
				<CarouselButton direction="left" onClick={handleClickPrevious} iconPath={IconArrowLeft} />
				<CarouselButton direction="right" onClick={handleClickNext} iconPath={IconArrowRight} />
				{visibleImages}
			</div>
		);
	}

	return (
		<div className="carousel" ref={carouselRef}>
			<CarouselButton direction="left" onClick={handleClickPrevious} iconPath={IconArrowLeft} />
			<CarouselButton direction="right" onClick={handleClickNext} iconPath={IconArrowRight} />
			{children}
		</div>
	);
};

export default Carousel;