export async function getProfile(username) {
    try {
        const response = await fetch(`/api/profile/${username}`, { method: "GET" });
        if (!response.ok) {
            console.log(`Failed to retrieve ${username}'s profile`);
            return null;
        }

        const data = await response.json();
        if (data.success) {
            return data.user;
        }
        console.log(`Failed to retrieve ${username}'s profile: `, data.message);
    } catch (error) {
        console.error(`Error while retrieving ${username}'s profile: `, error);
    }
    return null;
}

/**
 * Fetches the image URL for a given user's profile picture.
 * @async
 * @function getProfilePicture
 * @param {number} username - The username for which to retrieve the profile picture.
 * @returns {Promise<URL | null>} The URL for the image of the profile picture, or `null` if an error occurred or the post doesn't exist.
 */
export async function getProfilePictureUrl(username) {
    try {
        const response = await fetch(`/api/profile/${username}/picture`, { method: "GET" });
        if (!response.ok) {
            console.log(`Failed to retrieve ${username}'s profile picture`);
            return null;
        }

        const imageBlob = await response.blob();
        if (!imageBlob) {
            console.error(`No image data found for ${username}'s profile picture`);
            return null;
        }

        return URL.createObjectURL(imageBlob);
    } catch (error) {
        console.error(`Error while retrieving ${username}'s profile picture: `, error);
    }
    return null;
}

export async function uploadProfilePicture(username, image) {
    const formData = new FormData();
    formData.append("file", image);

    try {
        const response = await fetch(`/api/profile/${username}/picture`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error("Error while uploading profile picture: ", error);
    }
    
    return false;
}