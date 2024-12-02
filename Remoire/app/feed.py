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
        return jsonify({"success": False, "message": f"Post ${post_id} not found"})
    
    return send_file(io.BytesIO(post.image_data), mimetype=post.image_mimetype)

@feed.route("/api/posts/<param>", methods=["GET"])
def get_posts(param: str):
    if param.startswith("post-"):
        try:
            post_id = int(param[5:])
            return get_post(post_id)
        except ValueError:
            return jsonify({"success": False, "message": "Invalid post ID"})

    user = User.query.filter_by(UserName=param).first()
    if not user:
        return jsonify({"success": False, "message": f"User ${param} not found"})

    return get_user_posts(user.id)


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
