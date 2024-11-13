import "./Wardrobe.css"

import Header from "../../components/Header/Header";
import Carousel from "../../components/Carousel/Carousel";

import { useContext } from "react";
import { UserContext } from "../../UserContext";

const importAllImages = (requireContext) => {
    return requireContext.keys().map(requireContext);
};

const images = importAllImages(require.context('../../assets/images', false, /\.(png|jpe?g|svg|webp)$/));

const Wardrobe = () => {
    const { user, setUser } = useContext(UserContext);

    return (
        <>
            <Header />
            {(user && user.isLoggedIn) ? <h1>{user.username}'s wardobe</h1> : <h1>Wardrobe</h1>}
            <div className="wardrobe-carousel-container">
                <Carousel id="carousel-tops" images={images} />
                <Carousel id="carousel-bottoms" images={images} />
            </div>
            <button>
                <span>Upload</span>
            </button>
        </>
    );
};

export default Wardrobe;