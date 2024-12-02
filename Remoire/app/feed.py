from flask import (
    Flask,
    Blueprint,
    current_app,
    render_template,
    redirect,
    request,
    url_for,
    jsonify,
    send_file,
)
from flask_login import LoginManager, login_required, current_user
import io
import os
import app
from .models import User, Like, Post
from . import ImageBackgroundRemoverV1
from . import db
from . import models
from werkzeug.utils import secure_filename
from sqlalchemy_imageattach.context import store_context
from json import dumps
from .algorithm import get_posts as get_feed_posts

feed = Blueprint("feed", __name__)

def get_user_posts(user_id: int):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "message": f"Failed to retrieve user ${user_id}'s posts"})
    posts = user.posts

    posts_metadata = [
        {
            "id": post.id,
            "url": f"/api/posts/post-{post.id}",
            "caption": post.description,
            "timestamp": post.timestamp,
            "profile_picture": f"/api/users/{post.author.id}/upload-profile-picture",
            "outfit": post.outfit_id,
            "username": post.author.UserName,
            "likes": post.like_count(),
            "is_liked": Like.query.filter_by(
                user_id=current_user.id, post_id=post.id
            ).first()
            is not None,
        }
        for post in posts
    ]
    return jsonify({"success": True, "postsMetadata": posts_metadata, "message": f"Successfully retrieved user ${user_id}'s posts"})

def get_post(post_id: int):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"success": False, "message": f"Post ${post_id} not found"}), 404
    
    return send_file(io.BytesIO(post.image_data), mimetype=post.image_mimetype)

@feed.route("/api/posts/<param>", methods=["GET"])
def get_posts(param: str):
    if param.startswith("post-"):
        try:
            post_id = int(param[5:])
            return get_post(post_id)
        except ValueError:
            return jsonify({"success": False, "message": "Invalid post ID"}), 400

    user = User.query.filter_by(UserName=param).first()
    if not user:
        return jsonify({"success": False, "message": f"User ${param} not found"}), 404

    return get_user_posts(user.id)

@feed.route("/api/posts/<param>/author", methods=["GET"])
def get_post_author(param: str):
    if not param.startswith("post-"):
        return jsonify({"success": False, "message": "Invalid post ID", "data": None}), 400
    
    try:
        post_id = int(param[5:])
    except ValueError:
        return jsonify({"success": False, "message": "Invalid post ID", "data": None}), 400
    
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"success": False, "message": f"Post ${post_id} not found", "data": None}), 404
    
    author = post.author
    return jsonify({
        "success": True,
        "message": f"Successfully retrieved author of post #{post_id}",
        "data": {
            "username": author.UserName,
            "userId": author.id
        }
    }), 200


@feed.route("/api/feed", methods=["GET"])
def get_user_feed_posts():
    if not current_user.is_authenticated:
        return jsonify({"success": False, "message": "User not logged in"})
    posts = get_feed_posts(current_user.id)
    posts_metadata = [
        {
            "id": post.id,
            "url": f"/api/posts/post-{post.id}",
            "caption": post.description,
            "timestamp": post.timestamp,
            "outfit": post.outfit_id,
            "profile_picture":f"/api/users/{post.author.id}/upload-profile-picture",
            "username": post.author.UserName,
            "likes": post.like_count(),
            "is_liked": Like.query.filter_by(
                user_id=current_user.id, post_id=post.id
            ).first()
            is not None,
        }
        for post in posts
    ]
    return jsonify({"success": True, "postsMetadata": posts_metadata, "message": "Successfully retrieved feed posts"})

@feed.route('/api/posts/<int:post_id>/likes', methods=['GET'])
def get_likes(post_id):
    # Query the post by ID
    post = Post.query.get(post_id)
    if post is not None:
        like_count = post.like_count()
        print(like_count)
        return jsonify({
            "success": True,
            "message": f"Post #{post_id} successfully",
            "data": {
                "likeCount": like_count
            }
        }), 200
    else:
        return jsonify({"success": False, "message": f"Post #{post_id} not found", "data": None}), 404

@feed.route("/api/posts/<int:post_id>/liked", methods=["GET"])
def is_liked(post_id: int):
    if not current_user.is_authenticated:
        return jsonify({"success": False, "message": "User not logged in", "data": None}), 401
    
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"success": False, "message": f"Post #{post_id} not found", "data": None}), 404
    
    if Like.query.filter_by(user_id=current_user.id, post_id=post_id).first():
        return jsonify({
            "success": True,
            "message": f"Successfully checked if post #{post_id} is liked",
            "data": {
                "isLiked": True
            }
        }), 200
    
    return jsonify({
            "success": True,
            "message": f"Successfully checked if post #{post_id} is liked",
            "data": {
                "isLiked": False
            }
        }), 200

@feed.route("/api/posts/<int:post_id>/likes", methods=["PUT"])
def like_post(post_id):
    if not current_user.is_authenticated:
        return jsonify({"success": False, "message": "User not logged in", "data": None}), 401

    post = Post.query.get(post_id)
    if not post:
        return jsonify({"success": False, "message": f"Post #{post_id} not found", "data": None}), 404
    
    existing_like = Like.query.filter_by(user_id=current_user.id, post_id=post_id).first()
    
    if not existing_like:
        like = Like(user_id=current_user.id, post_id=post_id)
        db.session.add(like)
        db.session.commit()
        return jsonify({
            "success": True, 
            "message": f"Post #{post_id} successfully liked",
            "data": {
                "likeCount": post.like_count()
            }
        }), 200
    
    return jsonify({
        "success": True, 
        "message": f"Post #{post_id} already liked",
        "data": {
            "likeCount": post.like_count()
        }
    }), 200
    
@feed.route("/api/posts/<int:post_id>/likes", methods=["DELETE"])
def unlike_post(post_id):
    if not current_user.is_authenticated:
        return jsonify({"success": False, "message": "User not logged in", "data": None}), 401

    post = Post.query.get(post_id)
    if not post:
        return jsonify({"success": False, "message": f"Post #{post_id} not found", "data": None}), 404
    
    existing_like = Like.query.filter_by(user_id=current_user.id, post_id=post_id).first()
    
    if existing_like:
        db.session.delete(existing_like)
        db.session.commit()
        return jsonify({
            "success": True, 
            "message": f"Successfully unliked post #{post_id}",
            "data": {
                "likeCount": post.like_count()
            }
        }), 200
    
    return jsonify({
        "success": True,
        "message": f"Post #{post_id} already not liked",
        "data": {
            "likeCount": post.like_count()
        }
    }), 200


@feed.route("/api/posts/<int:post_id>", methods=["DELETE"])
def delete_post(post_id):
    # Check if the user is authenticated
    if not current_user.is_authenticated:
        return jsonify({
            "success": False,
            "message": "User not logged in",
            "data": None
        }), 401

    # Retrieve the post from the database
    post = Post.query.get(post_id)
    if not post:
        return jsonify({
            "success": False,
            "message": f"Post #{post_id} not found",
            "data": None
        }), 404

    # Check if the current user is the author of the post
    if post.author != current_user:
        return jsonify({
            "success": False,
            "message": "You are not authorized to delete this post",
            "data": None
        }), 403

    # Attempt to delete the post
    try:
        db.session.delete(post)
        db.session.commit()
        return jsonify({
            "success": True,
            "message": f"Successfully deleted post #{post_id}",
            "data": {"post_id": post_id}
        }), 200
    except Exception as e:
        # Rollback changes in case of an error
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Failed to delete post: {str(e)}",
            "data": None
        }), 500
