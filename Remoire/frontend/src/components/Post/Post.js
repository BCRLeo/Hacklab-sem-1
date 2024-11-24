import "./Post.css"

export default function Post({ postId, className, image }) {
    return (
        <div className={`post ${className}`}>
            <div id={`post-${postId}`} className="post-container">
                <span className="post-username"><img src={image} className="profile-picture"/>tornadowarnings</span>
                <img src={image} className="post-image"></img>
            </div>
        </div>
    )
}