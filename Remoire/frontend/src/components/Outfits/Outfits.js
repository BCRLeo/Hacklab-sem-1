import "./Outfits.css";

import { getOutfitIds } from "../../api/wardrobe";

import Outfit from "../Outfit/Outfit";

import { useEffect, useState } from "react";

export default function Outfits() {
    const [outfitIds, setOutfitIds] = useState([]);
    const [outfits, setOutfits] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await getOutfitIds();
            if (!data) {
                return;
            }
            setOutfitIds(data);
        })();
    }, []);

    return (
        <div className="outfits">
            {outfitIds.map((outfitId) => <Outfit outfitId={outfitId} />)}
        </div>
    );
}