export async function postOutfit(outfit) {
    if (Object.keys(outfit).length === 0) {
        console.log("Must select at least one item");
        return false;
    }

    const formData = new FormData();
    for (const [category, itemId] of Object.entries(outfit)) {
        formData.append(category, itemId);
    }

    try {
        const response = await fetch("/api/wardrobe/outfits", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            console.log("Failed to upload outfit");
            return false;
        }

        const data = await response.json();
        if (data.success) {
            return true;
        }
        console.error("Failed to upload outfit");
    } catch (error) {
        console.error("Error while uploading outfit: ", error);
    }
    return false;
}

export async function getOutfitIds() {
    try {
        const response = await fetch("/api/wardrobe/outfits", {method: "GET"});
        const data = await response.json();

        if (!response.ok || !data.success) {
            console.error(data.message);
            return null;
        }

        return data.outfitIds;
    } catch (error) {
        console.error("Error while retrieving outfit IDs: ", error);
    }
    return null;
}

export async function getOutfitImageUrls(outfitId) {
    try {
        const response = await fetch(`/api/wardrobe/outfits/outfit-${outfitId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            console.error(data.message);
            return null;
        }

        return data.imageUrls;
    } catch (error) {
        console.log("Error while retrieving outfit image URLs: ", error);
    }
    return null;
}