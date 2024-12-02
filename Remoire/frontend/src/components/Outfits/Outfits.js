import "./Outfits.css";

import { getOutfitIds, getUserOutfitIds } from "../../api/wardrobe";

import Outfit from "../Outfit/Outfit";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Outfits() {
    const [outfitIds, setOutfitIds] = useState([]);
    const [outfits, setOutfits] = useState([]);
    const { username } = useParams();

    useEffect(() => {
        (async () => {
            const data = username ? await getUserOutfitIds(username) : await getOutfitIds();
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