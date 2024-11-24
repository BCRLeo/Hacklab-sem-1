import "./Carousel.css"

import CarouselButton from "../CarouselButton/CarouselButton";
import IconArrowLeft from "../../assets/icons/icon__arrow-left.svg";
import IconArrowRight from "../../assets/icons/icon__arrow-right.svg";

import { useEffect, useRef, useState } from "react";

export default function Carousel({ images, children }) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [visibleImages, setVisibleImages] = useState([]);
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

	useEffect(() => {
		const newVisibleImages = [];
		for (let i = 0; i < visibleImageCount; i++) {
			let index = (currentIndex + i + images.length) % images.length;
			newVisibleImages.push(<img className="carousel-image" key={i} src={images[index]} alt={`slide ${index + 1}`} />);
		}
		newVisibleImages.forEach((element) => console.log(element.key));
		setVisibleImages(newVisibleImages);
	}, [currentIndex, visibleImageCount, images]);

	const handleClickPrevious = () => {
		setCurrentIndex((currentIndex) => (currentIndex - 1 + images.length) % images.length);
	};

	const handleClickNext = () => {
		setCurrentIndex((currentIndex) => (currentIndex + 1) % images.length);
	};

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
}