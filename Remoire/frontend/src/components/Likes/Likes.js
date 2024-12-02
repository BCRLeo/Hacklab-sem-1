import { getPostLikes } from "../../api/feed";

import { useEffect, useState } from "react";

export default function Likes({ postId }) {
    const [likes, setLikes] = useState(null);

    useEffect(() => {
        (async () => {
            const data = await getPostLikes(postId);
            if (!data) {
                return;
            }

            setLikes(data);
        })();
    }, []);

    return (
        <p>{likes}</p>
    );
}