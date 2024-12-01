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