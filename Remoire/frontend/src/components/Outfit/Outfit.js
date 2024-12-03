import "./Outfit.css";

import { getOutfitImageUrls } from "../../api/wardrobe";

import { useEffect, useState } from "react";

export default function Outfit({ outfitId }) {
    const [imageUrls, setImageUrls] = useState({});
    const [images, setImages] = useState(null);

    useEffect(() => {
        (async () => {
            const data = await getOutfitImageUrls(outfitId);
            if (!data) {
                return;
            }
            setImageUrls(data);

            const imageArray = Object.keys(data).map(type => (
                <img className="outfit-image" key={type} src={data[type]} alt={type} />
            ));
            setImages(imageArray);
        })();
    }, [outfitId]);



    return (
        <div className="outfit" data-outfit-id={outfitId}>
            {images}
        </div>
    );
}