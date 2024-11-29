import { UserContext } from "../../UserContext";
import { useContext, useEffect, useState } from "react";

import Post from "../Post/Post";

export default function Posts() {
    const { user, setUser } = useContext(UserContext);
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await fetch("/api/posts", {
                method: "GET"
            });
    
            if (response.ok) {
                const postsMetadata = await response.json();
                
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
                            />
                        );
                    } catch (imageError) {
                        console.error(`Error fetching image for post ${postMetadata.id}:`, imageError);
                        return null;
                    }
                }));
    
                setPosts(postComponents.filter(Boolean));
            } else {
                console.error("Failed to fetch posts");
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [user]);

    return (
        <div className="posts-container">
            {posts}
        </div>
    );
}