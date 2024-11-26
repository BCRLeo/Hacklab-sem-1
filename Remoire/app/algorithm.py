from datetime import datetime, timedelta
from sqlalchemy import func
from . import db
from .models import Post, User, Like
import random

def get_posts(user_id):
    one_month_ago = datetime.utcnow() - timedelta(days=30)

    # Top 10 most liked posts in the past month
    top_posts = db.session.query(
        Post,
        func.count(Like.id).label('like_count')
    ).outerjoin(Like).filter(
        Post.timestamp >= one_month_ago
    ).group_by(Post.id).order_by(func.count(Like.id).desc()).limit(10).all()

    # Get the user
    user = User.query.get(user_id)

    # Get list of following user IDs
    following_user_ids = [u.id for u in user.following]

    # Top 10 most liked posts in the past month by following users
    top_following_posts = db.session.query(
        Post,
        func.count(Like.id).label('like_count')
    ).outerjoin(Like).filter(
        Post.timestamp >= one_month_ago,
        Post.user_id.in_(following_user_ids)
    ).group_by(Post.id).order_by(func.count(Like.id).desc()).limit(10).all()

    posts = top_posts + top_following_posts
    random.shuffle(posts)

    return posts

