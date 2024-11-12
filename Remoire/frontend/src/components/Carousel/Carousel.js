import "./Carousel.css"

import CarouselButton from "../CarouselButton/CarouselButton";
import IconArrowLeft from "../../assets/icons/icon__arrow-left.svg";
import IconArrowRight from "../../assets/icons/icon__arrow-right.svg";

import { useState } from "react";

const Carousel = ({ images, children }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const visibleImages = images.map((image, index) => {
		for (let i = -2; i <= 2; i++)
		{
			if (index === (currentIndex + i + images.length) % images.length) {
				return <img key={index} src={image} alt={`slide ${index + 1}`} />;
			}
		}
		/* if (index === currentIndex || index === (currentIndex - 1 + images.length) % images.length || index === (currentIndex + 1) % images.length) {
			return <img key={index} src={image} alt={`slide ${index + 1}`} />;
		} */
		return null;
	});

	if (images) {
		return (
			<div className="carousel">
				<CarouselButton direction="left" iconPath={IconArrowLeft} />
				<CarouselButton direction="right" iconPath={IconArrowRight} />
				{visibleImages}
				{/* images.map((src, index) => (
					<img className="carousel-image" key={index} src={src} alt={`Slide ${index + 1}`} />
				)) */}
			</div>
		);
	}

	return (
		<div className="carousel">
			{children}
		</div>
	);
};

export default Carousel;