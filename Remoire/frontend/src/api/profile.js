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