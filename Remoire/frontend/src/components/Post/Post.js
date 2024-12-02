import "./Post.css";

import { getPostAuthorUsername, getPostImageUrl } from "../../api/feed";
import { getProfilePictureUrl } from "../../api/profile";

import Icon from "../Icon/Icon";
import Likes from "../Likes/Likes";

import React, { useState, useEffect } from 'react';

export default function Post({ postId, className = "" }) {
    const [username, setUsername] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

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
    
    useEffect(() => {
        (async () => {
            if (!username) {
                return;
            }
            const data = await getProfilePictureUrl(username);
            if (data === null) {
                return;
            }

            setProfilePictureUrl(data);
        })();
    }, [username]);

    return (
        <div className={`post ${className}`}>
            <div id={`post-${postId}`} className="post-container">
                <span className="post-user-info">
                    {profilePictureUrl ? <img src={profilePictureUrl} className="post-profile-picture" alt={`${username}'s profile`} /> : <Icon className="profile-icon" name="accountIcon" size="sm" />}
                    <h4 className="post-username">{username}</h4>
                </span>
                <img src={imageUrl} className="post-image" alt="Post" />
                <Likes postId={postId} />
            </div>
        </div>
    );
}


