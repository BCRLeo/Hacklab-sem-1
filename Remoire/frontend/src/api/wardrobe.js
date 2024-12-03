/**
 * Uploads an clothing image file along with a category to the server.
 * @async
 * @function uploadClothingImage
 * @param {File} imageFile - The image file to be uploaded.
 * @param {string} category - The category associated with the item.
 * @returns {Promise<Object>} - Returns a promise that resolves to a JSON Object with `success` flag and `fileName`.
 */
export async function uploadClothingImage(imageFile, category) {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("category", category);

    try {
        const response = await fetch("/api/wardrobe/items", {
            method: "POST",
            body: formData
        });
        if (!response.ok) {
            console.error(`Failed to upload item ${imageFile.name}`);
            return { "success": false, "fileName": imageFile.name };
        }

        const data = await response.json();
        if (data.success) {
            return { "success": true, "fileName": imageFile.name };
        }

        console.error(`Failed to upload item ${imageFile.name}`);
    } catch (error) {
        console.error(`Error uploading file ${imageFile.name}: `, error);
    }
    return { "success": false, "fileName": imageFile.name };
}

/**
 * Uploads clothing image files along with a category to the server.
 * @async
 * @function uploadClothingImages
 * @param {File[]} imageFiles - The image files to be uploaded.
 * @param {string} category - The category associated with the item.
 * @returns {Promise<number>} - Returns a promise that resolves to the number of the successful uploads.
 */
export async function uploadClothingImages(imageFiles, category) {
    let successfulUploads = 0;
    let failedUploads = 0;

    const uploadPromises = imageFiles.map(file =>
        uploadClothingImage(file, category).then((result) => {
            if (result.success) {
                successfulUploads++;
                console.log(`Successfully uploaded: ${result.fileName}`);
            } else {
                failedUploads++;
                console.log(`Failed to upload: ${result.fileName}`);
            }

            return result;
        })
    );
    await Promise.all(uploadPromises);

    return successfulUploads;
}

/**
 * Fetches image endpoints for a specified clothing item type and username from the wardrobe API.
 * 
 * @async
 * @function getUserClothingImageEndpoints
 * @param {string} username - The username to fetch images from.
 * @param {string} itemType - The type of clothing item (e.g., "shirt", "pants", "shoes") to fetch image endpoints for.
 * @returns {Promise<string[]|null>} A promise that resolves to an array of image endpoints if successful, or null if there was an error.
 * @throws Will log an error message to the console if the fetch operation or response parsing fails.
 */
export async function getUserClothingImageEndpoints(username, itemType) {
    try {
        const response = await fetch(`/api/wardrobe/${username}/items/${itemType}`, { method: "GET" });
        const data = await response.json();
        if (!response.ok || !data.success) {
            console.error(data.message);
            return null;
        }

        return data.data;
    } catch (error) {
        console.error(`Error retrieving ${itemType} image endpoints: `, error);
    }
    return null;
}

/**
 * Fetches image endpoints for a specified clothing item type from the wardrobe API.
 * 
 * @async
 * @function getClothingImageEndpoints
 * @param {string} itemType - The type of clothing item (e.g., "shirt", "pants", "shoes") to fetch image endpoints for.
 * @returns {Promise<string[]|null>} A promise that resolves to an array of image endpoints if successful, or null if there was an error.
 * @throws Will log an error message to the console if the fetch operation or response parsing fails.
 */
export async function getClothingImageEndpoints(itemType) {
    try {
        const response = await fetch(`/api/wardrobe/items/${itemType}`, { method: "GET" });
        const data = await response.json();
        if (!response.ok || !data.success) {
            console.error(data.message);
            return null;
        }

        return data.data;
    } catch (error) {
        console.error(`Error retrieving ${itemType} image endpoints: `, error);
    }
    return null;
}

// NOT READY. if URLs for image blobs are passed to clothing items at the moment, it'll break outfit selection
async function getClothingImageUrls(itemType) {
    const imageEndpoints = await getClothingImageEndpoints(itemType);
    if (imageEndpoints === null) {
        return null;
    }

    let imageUrls = [];

    imageEndpoints.forEach((imageEndpoint) => {
        const imageBlob = imageEndpoint.blob();
        if (!imageBlob) {
            console.error(`No image data found for ${imageEndpoint}`);
            return;
        }

        imageUrls.push(URL.createObjectURL(imageBlob));
    })

    return imageUrls;
}


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

export async function getUserOutfitIds(username) {
    try {
        const response = await fetch(`/api/wardrobe/${username}/outfits`, {method: "GET"});
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