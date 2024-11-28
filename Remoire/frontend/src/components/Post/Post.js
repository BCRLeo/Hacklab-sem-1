import React, { useState, useEffect } from 'react';
import "./Post.css";

export default function Post({ 
  postId, 
  className, 
  image, 
  username, 
  likeCount,  
  initialIsLiked = false 
}) {
  const [likes, setLikes] = useState(likeCount);  
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const handleLike = async () => {
      try {
          const response = await fetch(`/api/posts/${postId}/like`, {
              method: 'POST'
          });
          
          if (!response.ok) {
              throw new Error('Failed to like/unlike post');
          }
          
          const data = await response.json();

          if (data.success) {
              setIsLiked(data.action === 'liked');
              setLikes(data.like_count);  
          }
      } catch (error) {
          console.error('Error liking post:', error);
      }
  };

  useEffect(() => {
    console.log("Initial likeCount:", likeCount);
    setLikes(likeCount);
  }, [likeCount]);

  console.log("Current likes:", likes);

  return (
       <div className={`post ${className}`}>
          <div id={`post-${postId}`} className="post-container">
                <span className="post-username">
                    <img src={image} className="profile-picture" alt={`${username}'s profile`}/>
                    {username}
                </span>
                <img src={image} className="post-image" alt="Post"/> 
              <span className="post-likes-container">
                  <button
                      className={`like-button ${isLiked ? 'liked' : ''}`}
                      onClick={handleLike}
                  >
                      {isLiked ? '❤️' : '🤍'}
                  </button>
                  <div className="post-likes">
                      {likes} likes
                  </div>
              </span>
          </div>
      </div>
  );
}