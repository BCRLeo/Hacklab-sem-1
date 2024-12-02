import "./Likes.css"

import { getPostLikes, isPostLiked, likePost, unlikePost } from "../../api/feed";

import Icon from "../Icon/Icon";
import ToggleButton from "../ToggleButton/ToggleButton";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";

export default function Likes({ postId }) {
    const { user } = useContext(UserContext);
    const [likeCount, setLikeCount] = useState(null);
    const [isLiked, setIsLiked] = useState(null);

    useEffect(() => {
        (async () => {
            const data = await getPostLikes(postId);
            if (data === null) {
                return;
            }

            setLikeCount(data);
        })();

        (async () => {
            const data = await isPostLiked(postId);
            if (data === null) {
                return;
            }
            setIsLiked(data);
        })();
    }, []);

    async function handleLike() {
        if (isLiked === false) {
            const data = await likePost(postId);
            if (data !== null) {
                setLikeCount(data);
                setIsLiked(true);
            }
        } else if (isLiked === true) {
            const data = await unlikePost(postId);
            if (data !== null) {
                setLikeCount(data);
                setIsLiked(false);
            }
        }
    }

    return (
        <div className="likes-container">
            {user && user !== -1 ? (
                <ToggleButton
                    className="like-button"
                    content={{
                        "before": <Icon className="like-icon" name="heartOutlinedIcon" size="sm" />,
                        "after": <Icon className="like-icon liked" name="heartFilledIcon" size="sm" />
                    }}
                    isToggled={isLiked}
                    onClick={handleLike}
                />
            ) : (
                <Icon className="like-icon" name="heartOutlinedIcon" size="sm" />
            )}
            <p className="like-count">{likeCount}</p>
        </div>
    );
}