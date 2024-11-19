import "./Carousel.css"

import CarouselButton from "../CarouselButton/CarouselButton";
import IconArrowLeft from "../../assets/icons/icon__arrow-left.svg";
import IconArrowRight from "../../assets/icons/icon__arrow-right.svg";

import { useState } from "react";

const Carousel = ({ images, children }) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleClickPrevious = () => {
		setCurrentIndex((currentIndex) => (currentIndex - 1 + images.length) % images.length);
	};

	const handleClickNext = () => {
		setCurrentIndex((currentIndex) => (currentIndex + 1) % images.length);
	};

	let visibleRange = 2;
	let visibleImages = [];
	for (let i = -1 * visibleRange; i <= visibleRange; i++) {
		let index = (currentIndex + i + images.length) % images.length;
		visibleImages.push(<img className="carousel-image" key={index} src={images[index]} alt={`slide ${index + 1}`} />);
	}

	if (images && images.length > 0) {
		return (
			<div className="carousel">
				<CarouselButton direction="left" onClick={handleClickPrevious} iconPath={IconArrowLeft} />
				<CarouselButton direction="right" onClick={handleClickNext} iconPath={IconArrowRight} />
				{visibleImages}
			</div>
		);
	}

	return (
		<div className="carousel">
			<CarouselButton direction="left" onClick={handleClickPrevious} iconPath={IconArrowLeft} />
			<CarouselButton direction="right" onClick={handleClickNext} iconPath={IconArrowRight} />
			{children}
		</div>
	);
};

export default Carousel;