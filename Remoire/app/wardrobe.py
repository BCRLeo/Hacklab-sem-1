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

wardrobe = Blueprint("wardrobe", __name__)

@wardrobe.route("/api/wardrobe/outfits", methods = ["POST"])
def create_outfit():
    if not current_user.is_authenticated:
        return jsonify({"success": False, "message": "User not logged in"})
    
    if not request.form:
        return jsonify({"success": False, "message": "No item selected"})

    jacket = models.Jacket.query.get(request.form["jacket"]) if "jacket" in request.form else None
    shirt = models.Shirt.query.get(request.form["shirt"]) if "shirt" in request.form else None
    trouser = models.Trouser.query.get(request.form["trousers"]) if "trousers" in request.form else None
    shoe = models.Shoe.query.get(request.form["shoes"]) if "shoes" in request.form else None  
    flag = models.Outfit.create_outfit(current_user, jacket, shirt, trouser, shoe)

    if flag:
        return jsonify({"success": True}), 200
    return jsonify({"success": False, "message": "Failed to create outfit"})