import "./Carousel.css"

const Carousel = ({ images, children }) => {
	if (images) {
		return (
			<div className="carousel">
				<h2>carousel</h2>
				{images.map((src, index) => (
					<img className="carousel-image" key={index} src={src} alt={`Slide ${index + 1}`} />
				))}
			</div>
		);
	}

	return (
		<div className="carousel">
			<h2>carousel</h2>
			{children}
		</div>
	);
};

export default Carousel;