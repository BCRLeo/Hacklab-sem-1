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


@profile.route('/api/users/<int:user_id>/upload-profile-picture', methods=['POST'])
def upload_profile_picture(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "message": "No file selected"}), 400

    try:
        # Read file data and content type
        file_data = file.read()
        file_type = file.content_type

        # Ensure file is not too large (optional, adjust size as needed)
        if len(file_data) > 5 * 1024 * 1024:  # 5MB limit
            return jsonify({"success": False, "message": "File too large"}), 400

        # Ensure file type is an image
        if not file_type.startswith('image/'):
            return jsonify({"success": False, "message": "Invalid file type"}), 400

        # Save the file data and MIME type to the database
        user.ProfilePicture = file_data
        db.session.commit()

        return jsonify({"success": True, "message": "Profile picture uploaded successfully"})

    except Exception as e:
        # Log the full error for debugging
        print(f"Error uploading profile picture: {e}")
        # Rollback the session to prevent any partial commits
        db.session.rollback()
        return jsonify({"success": False, "message": "Error uploading profile picture"}), 500