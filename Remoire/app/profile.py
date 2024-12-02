from flask import Flask, Blueprint, current_app, render_template, redirect, request, url_for, jsonify, send_file
from flask_login import LoginManager, login_required, current_user
from io import BytesIO
import os
import app
import imghdr
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

@profile.route('/api/profile/<username>/picture', methods=['POST'])
def upload_profile_picture(username):
    if not current_user.is_authenticated:
        return jsonify({"success": False, "message": "User not logged in"}), 401
    
    if current_user.UserName != username:
        return jsonify({"success": False, "message": "Cannot upload image to another user's profile"}), 403

    user = current_user

    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "message": "No file selected"}), 400

    try:
        file_data = file.read()
        file_type = file.content_type

        if len(file_data) > 5 * 1024 * 1024:  # 5MB limit
            return jsonify({"success": False, "message": "File too large"}), 400

        if not file_type.startswith('image/'):
            return jsonify({"success": False, "message": "Invalid file type"}), 400

        user.ProfilePicture = file_data
        db.session.commit()

        return jsonify({"success": True, "message": "Profile picture uploaded successfully"}), 200

    except Exception as e:
        # Log the full error for debugging
        print(f"Error uploading profile picture: {e}")
        # Rollback the session to prevent any partial commits
        db.session.rollback()
        return jsonify({"success": False, "message": "Error uploading profile picture"}), 500
    
@profile.route('/api/profile/<username>/picture', methods=['GET'])
def get_profile_picture(username):
    try:
        # Retrieve the user from the database
        user = User.query.filter_by(UserName=username).first()
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404
        
        if not user.ProfilePicture:
            return jsonify({"success": False, "message": "No profile picture available"}), 404

        # Infer image type using the `imghdr` module
        image_type = imghdr.what(None, h=user.ProfilePicture)
        if not image_type:
            return jsonify({"success": False, "message": "Invalid image data"}), 500

        mime_type = f"image/{image_type}"
        return send_file(
            BytesIO(user.ProfilePicture),
            mimetype=mime_type,
        )

    except Exception as e:
        # Log and handle any unexpected errors
        print(f"Error retrieving profile picture for user {username}: {e}")
        return jsonify({"success": False, "message": "Failed to retrieve profile picture"}), 500

""" @profile.route('/api/users/<int:user_id>/upload-profile-picture', methods=['POST'])
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
    
@profile.route('/api/users/<int:user_id>/upload-profile-picture', methods=['GET'])
def get_profile_picture(user_id):
    try:
        # Retrieve the user from the database
        user = User.query.get(user_id)
        
        if not user:
            # User not found
            print(f"User {user_id} not found.")
            return jsonify({"success": False, "message": "User not found"}), 404
        
        if not user.ProfilePicture:
            # User has no profile picture
            print(f"User {user_id} has no profile picture.")
            # Respond with a 404 and a message
            return jsonify({"success": False, "message": "No profile picture available"}), 404

        # Infer image type using the `imghdr` module
        image_type = imghdr.what(None, h=user.ProfilePicture)
        if not image_type:
            print(f"Unable to determine the image type for user {user_id}.")
            return jsonify({"success": False, "message": "Invalid image data"}), 500

        # Serve the user's profile picture with the inferred MIME type
        mime_type = f"image/{image_type}"
        print(f"Serving profile picture for user {user_id} with MIME type {mime_type}.")
        return send_file(
            BytesIO(user.ProfilePicture),
            mimetype=mime_type,
        )

    except Exception as e:
        # Log and handle any unexpected errors
        print(f"Error retrieving profile picture for user {user_id}: {e}")
        return jsonify({"success": False, "message": "Failed to retrieve profile picture"}), 500
    
     """