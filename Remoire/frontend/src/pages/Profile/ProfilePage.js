import "./ProfilePage.css";

import Header from "../../components/Header/Header";
import Icon from "../../components/Icon/Icon";
import Post from "../../components/Post/Post";

import { UserContext } from "../../UserContext";
import { useContext, useEffect, useState } from "react";

export default function ProfilePage() {
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

    if (user && user !== -1) {
        return (
            <>
                <Header />
                <Icon className="profile-icon" name="accountIcon" size="xl" />
                <h1>{user.username}</h1>
                <p>bio test test i'm so cool test test fashion whatever</p>
                {posts}
            </>
        );
    }

    return (
        <>
            <Header />
            {user && user !== -1 ? <h1>{user.username}</h1> : <h1>Profile</h1>}
        </>
    );
}