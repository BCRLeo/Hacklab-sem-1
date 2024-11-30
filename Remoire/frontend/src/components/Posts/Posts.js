import { getUserPosts } from "../../api/feed";

import { UserContext } from "../../UserContext";
import { useContext, useEffect, useState } from "react";

import Post from "../Post/Post";

export default function Posts() {
    const { user, setUser } = useContext(UserContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await getUserPosts("joshuadtan");
            if (data) {
                setPosts(data);
            }
        })();
    }, [user]);

    return (
        <div className="posts-container">
            {posts}
        </div>
    );
}