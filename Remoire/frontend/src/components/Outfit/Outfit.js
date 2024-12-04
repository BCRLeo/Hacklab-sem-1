import "./Outfit.css";

import { getOutfitImageUrls } from "../../api/wardrobe";

import { useEffect, useState } from "react";

export default function Outfit({ outfitId }) {
    const [images, setImages] = useState(null);

    useEffect(() => {
        (async () => {
            const data = await getOutfitImageUrls(outfitId);
            if (!data) {
                return;
            }

            let typedImages = {
                "jacket": null,
                "shirt": null,
                "trouser": null,
                "shoe": null
            };

            for (const [type, url] of Object.entries(data)) {
                typedImages = {...typedImages, [type]: <img className="outfit-image" key={type} src={url} alt={type} data-item-type={type} />};
            }
            const imageArray = [typedImages.jacket, typedImages.shirt, typedImages.trouser, typedImages.shoe];
            
            setImages(imageArray);
        })();
    }, [outfitId]);



    return (
        <div className="outfit" data-outfit-id={outfitId}>
            {images}
        </div>
    );
}