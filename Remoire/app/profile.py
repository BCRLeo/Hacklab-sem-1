from flask import Flask, Blueprint, current_app, render_template, redirect, request, url_for, jsonify, send_file
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
from .algorithm import get_posts

profile = Blueprint('profile', __name__)

@profile.route("/api/profile/<username>", methods=["GET"])
def get_profile(username):
    user = User.query.filter_by(UserName=username).first()
    if user:
        return jsonify({
            "success": True,
            "user": {
                "id": user.id,
                "username": user.UserName,
                "email": user.email,
                "profilePicture": f"/api/profile/${username}/profile-picture",
                "bio": user.Bio
            },
            "message": f"${username}'s profile successfully retreived"
            })
    else:
        return jsonify({"success": False, "message": f"Failed to retreive ${username}'s profile"})