import "./Wardrobe.css"
import Header from "../../components/Header/Header";
import Carousel from "../../components/Carousel/Carousel";

const importAllImages = (requireContext) => {
    return requireContext.keys().map(requireContext);
};

const images = importAllImages(require.context('../../assets/images', false, /\.(png|jpe?g|svg|webp)$/));

const Wardrobe = () => {
    return (
        <div className="wardrobe">
            <Header />
            <h1>Wardrobe</h1>
            <div className="wardrobe-carousel-container">
                <Carousel id="carousel-tops" images={images} />
                <Carousel id="carousel-bottoms" images={images} />
            </div>
        </div>
    );
};

export default Wardrobe;