import Post from "../components/Post/Post";

/**
 * Fetches the username of the author for a given post.
 * @async
 * @function getPostAuthorUsername
 * @param {number} postId - The ID of the post for which to retrieve the like count.
 * @returns {string | null} The username of the author of the post, or `null` if an error occurred or the post doesn't exist.
 */
export async function getPostAuthorUsername(postId) {
    try {
        const response = await fetch(`/api/posts/post-${postId}/author`, { method: "GET" });
        const data = await response.json();
        if (!response.ok || !data.success) {
            console.error(data.message);
            return null;
        }

        return data.data.username;
    } catch (error) {
        console.error(`Error fetching author's username for post #${postId}:`, error);
        return null;
    }
}

/**
 * Fetches the image URL for a given post.
 * @async
 * @function getPostImageUrl
 * @param {number} postId - The ID of the post for which to retrieve the like count.
 * @returns {URL | null} The URL for the image of the post, or `null` if an error occurred or the post doesn't exist.
 */
export async function getPostImageUrl(postId) {
    try {
        const response = await fetch(`/api/posts/post-${postId}`, { method: "GET" });
        if (!response.ok) {
            console.error(`Failed to retrieve post #${postId} image`);
            return null;
        }

        const imageBlob = await response.blob();
        if (!imageBlob) {
            console.error(`No image data found for post #${postId}`);
            return null;
        }

        return URL.createObjectURL(imageBlob);
    } catch (error) {
        console.error(`Error fetching post #${postId} image: `, error);
        return null;
    }
}

/**
 * Asynchronously retrieves posts for a given username and returns an array of `Post` components.
 *
 * This function fetches a list of posts metadata from an API endpoint using the provided `username`.
 * For each post metadata, it renders a `Post` component. If the fetch request or data processing fails,
 * an error is logged and `null` is returned.
 *
 * @async
 * @function getUserPosts
 * @param {string} username - The username whose posts are to be retrieved.
 * @returns {Promise<Array<JSX.Element> | null>} A promise that resolves to an array of `Post` components if successful, or `null` if an error occurs.
 *
 * @example
 * const posts = await getUserPosts('johnDoe');
 * if (posts) {
 *   // Render posts
 * }
 */
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
            return (
                <Post key={postMetadata.id} postId={postMetadata.id} />
            );
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

/**
 * Fetches the number of likes for a given post.
 * 
 * @param {number} postId - The ID of the post for which to retrieve the like count.
 * @returns {number | null} The number of likes for the post, or `null` if an error occurred or the post doesn't exist.
 */
export async function getPostLikes(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}/likes`, { method: "GET" });
        const data = await response.json();
        if (!response.ok || !data.success) {
            console.error(data.message);
            return null;
        }

        return data.data.likeCount;
    } catch (error) {
        console.error(`Error while retrieving post #${postId}'s likes: `, error);
    }

    return null;
}

/**
 * Fetches whether a given post is liked.
 * 
 * @param {number} postId - The ID of the post for which to check if it is liked.
 * @returns {boolean | null} Whether the post is liked, or `null` if an error occurred or the post doesn't exist.
 */
export async function isPostLiked(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}/liked`, { method: "GET" });
        const data = await response.json();
        if (!response.ok || !data.success) {
            console.error(data.message);
            return null;
        }

        return data.data.isLiked;
    } catch (error) {
        console.error(`Error while checking if post #${postId}'s is liked: `, error);
    }

    return null;
}

/**
 * Likes a given post.
 * 
 * @param {number} postId - The ID of the post to be liked.
 * @returns {number | null} New like count, or `null` if an error occurred or the post doesn't exist.
 */
export async function likePost(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}/likes`, { method: "PUT" });
        const data = await response.json();
        if (!response.ok || !data.success) {
            console.error(data.message);
            return null;
        }

        return data.data.likeCount;
    } catch (error) {
        console.error(`Error while liking post #${postId}: `, error);
    }

    return null;
}

/**
 * Unlikes a given post.
 * 
 * @param {number} postId - The ID of the post to be liked.
 * @returns {number | null} New like count, or `null` if an error occurred or the post doesn't exist.
 */
export async function unlikePost(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}/likes`, { method: "DELETE" });
        const data = await response.json();
        if (!response.ok || !data.success) {
            console.error(data.message);
            return null;
        }

        return data.data.likeCount;
    } catch (error) {
        console.error(`Error while unliking post #${postId}: `, error);
    }

    return null;
}