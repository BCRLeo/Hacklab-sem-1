import "./Outfits.css";

import { deleteOutfit, getOutfitIds, getUserOutfitIds } from "../../api/wardrobe";

import Bar from "../Bar/Bar";
import Icon from "../Icon/Icon";
import Outfit from "../Outfit/Outfit";
import ToggleButton from "../ToggleButton/ToggleButton";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Outfits() {
    const [outfitIds, setOutfitIds] = useState([]);
    const { username } = useParams();

    const [isEditing, setIsEditing] = useState(false);
    const [isPendingUpdate, setIsPendingUpdate] = useState(false);

    async function handleOutfitClick(event) {
        if (!isEditing) {
            return;
        }

        const outfitDiv = event.target.closest(".outfit");
        if (!outfitDiv) {
            return;
        }

        const outfitId = outfitDiv.dataset.outfitId;
        if (!outfitId) {
            return;
        }

        const data = await deleteOutfit(outfitId);
        if (!data) {
            console.error(`Deletion of outfit #${outfitId} failed`);
            return;
        }

        setIsPendingUpdate(true);
    }

    useEffect(() => {
        (async () => {
            const data = username ? await getUserOutfitIds(username) : await getOutfitIds();
            if (!data) {
                return;
            }
            setOutfitIds(data);
        })();
    }, [isPendingUpdate]);

    return (
        <>
            {!username && <Bar orientation="horizontal">
                <ToggleButton labels={{"before": "Edit", "after": "Done"}} content={{"before": <Icon name="editIcon" />, "after": <Icon name="checkIcon" />}} isToggled={isEditing} onClick={() => setIsEditing(isEditing => !isEditing)} />
            </Bar>}

            <div className="outfits" onClick={handleOutfitClick}>
                {outfitIds.map((outfitId) => <Outfit outfitId={outfitId} />)}
            </div>
        </>
    );
}