import "./Post.css";

import { getPostAuthorUsername, getPostImageUrl } from "../../api/feed";

import Likes from "../Likes/Likes";

import React, { useState, useEffect } from 'react';

export default function Post({ postId, className = "" }) {
    const [username, setUsername] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        (async () => {
            const data = await getPostAuthorUsername(postId);
            if (data === null) {
                return;
            }

            setUsername(data);
        })();

        (async () => {
            const data = await getPostImageUrl(postId);
            if (data === null) {
                return;
            }

            setImageUrl(data);
        })();
    }, []);
    

    return (
        <div className={`post ${className}`}>
            <div id={`post-${postId}`} className="post-container">
                <span className="post-username">
                    <img src={imageUrl} className="post-profile-picture" alt={`${username}'s profile`} />
                    {username}
                </span>
                <img src={imageUrl} className="post-image" alt="Post" />
                <Likes postId={postId} />
            </div>
        </div>
    );
}


