import Post from "../components/Post/Post";

export async function getUserPosts(username) {
    try {
        const response = await fetch(`/api/posts/${username}`, { method: "GET" });
        if (!response.ok) {
            console.error(`Failed to retrieve ${username}'s posts`);
            return null;
        }
        
        const data = await response.json();
        if (!data.success) {
            console.error(`Failed to retrieve ${username}'s posts`);
            return null;
        }

        const postsMetadata = data.postsMetadata;
        const postComponents = await Promise.all(postsMetadata.map(async (postMetadata) => {
            try {
                const imageResponse = await fetch(postMetadata.url);
                const imageBlob = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                
                return (
                    <Post
                        key={postMetadata.id}
                        postId={postMetadata.id}
                        image={imageUrl}
                        profilePicture={postMetadata.profile_picture}
                        username={postMetadata.username}
                        likeCount={postMetadata.like_count}
                        initialIsLiked={postMetadata.is_liked}  // New prop
                    />
                );
            } catch (imageError) {
                console.error(`Error fetching image for post ${postMetadata.id}:`, imageError);
                return null;
            }
        }));
        return postComponents.filter(Boolean);
    } catch (error) {
        console.error(`Error retrieving ${username}'s posts: `, error);
        return null;
    }
}

export async function getUserFeedPosts(username) {
    try {
        const response = await fetch("/api/feed", { method: "GET" });
        if (!response.ok) {
            console.error(`Failed to retrieve feed posts`);
            return null;
        }

        const data = await response.json();
        if (!data.success) {
            console.error(`Failed to retrieve feed posts`);
            return null;
        }

        const postsMetadata = data.postsMetadata;
        const postComponents = await Promise.all(postsMetadata.map(async (postMetadata) => {
            try {
                const imageResponse = await fetch(postMetadata.url);
                const imageBlob = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                
                return (
                    <Post
                        key={postMetadata.id}
                        postId={postMetadata.id}
                        image={imageUrl}
                        profilePicture={postMetadata.profile_picture}
                        username={postMetadata.username}
                        likeCount={postMetadata.like_count}
                        initialIsLiked={postMetadata.is_liked}  // New prop
                    />
                );
            } catch (imageError) {
                console.error(`Error fetching image for post ${postMetadata.id}:`, imageError);
                return null;
            }
        }));
        return postComponents.filter(Boolean);
    } catch (error) {
        console.error("Error retrieving feed posts: ", error);
        return null;
    }
}