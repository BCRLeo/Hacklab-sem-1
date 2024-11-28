import "./Post.css"

export default function Post({ postId, className, image, username }) {
    return (
        <div className={`post ${className}`}>
            <div id={`post-${postId}`} className="post-container">
                <span className="post-username">
                    <img src={image} className="profile-picture"/>
                    {username}
                </span>
                <img src={image} className="post-image"></img>
            </div>
        </div>
    )
}
