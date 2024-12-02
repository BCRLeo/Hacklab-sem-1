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
from .models import User, Like, Post, Outfit, Wardrobe, Jacket, Shirt, Trouser, Shoe
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
        return jsonify({"success": True, "message": "Successfully created outfit"}), 200
    return jsonify({"success": False, "message": "Failed to create outfit"})


def get_user_outfit_ids(username: str):
    user = User.query.filter_by(UserName=username).first()
    if not user:
        return jsonify({"success": False, "message": f"User {username} not be found"}), 404

    outfits = user.outfits
    outfit_ids = [outfits[i].id for i in range(len(outfits))]

    return jsonify({"success": True, "outfitIds": outfit_ids, "message": "Successfully retrieved outfits"}), 200

def get_user_outfit_urls(username: str):
    user = User.query.filter_by(UserName=username).first()
    if not user:
        return jsonify({"success": False, "message": f"User {username} not be found"}), 404

    outfits = user.outfits
    outfit_urls = [f"/api/wardrobe/outfits/outfit-{outfits[i].id}" for i in range(len(outfits))]

    return jsonify({"success": True, "outfits": outfit_urls, "message": "Successfully retrieved outfits"}), 200

@wardrobe.route("/api/wardrobe/outfits", methods=["GET"])
def get_self_outfit_ids() -> str:
    if not current_user.is_authenticated:
        return jsonify({"success": False, "message": "User not logged in"}), 401
    
    return get_user_outfit_ids(current_user.UserName)

def get_clothing_ids(outfit_id: int) -> dict[int]:
    outfit = Outfit.query.get(outfit_id)
    if not outfit:
        return None
    
    clothing_ids = {}
    if outfit.jacket_id:
        clothing_ids["jacket"] = outfit.jacket_id
    if outfit.shirt_id:
        clothing_ids["shirt"] = outfit.shirt_id
    if outfit.trouser_id:
        clothing_ids["trouser"] = outfit.trouser_id
    if outfit.shoe_id:
        clothing_ids["shoe"] = outfit.shoe_id
    
    return clothing_ids

def get_clothing_image_urls(clothing_ids: dict[int]) -> dict[str]:
    clothing_image_urls = {}
    if "jacket" in clothing_ids and Jacket.query.get(clothing_ids["jacket"]):
        clothing_image_urls["jacket"] = f"/api/wardrobe/items/jacket?id={Jacket.query.get(clothing_ids["jacket"]).id}"

    if "shirt" in clothing_ids and Shirt.query.get(clothing_ids["shirt"]):
        clothing_image_urls["shirt"] = f"/api/wardrobe/items/shirt?id={Shirt.query.get(clothing_ids["shirt"]).id}"

    if "trouser" in clothing_ids and Trouser.query.get(clothing_ids["trouser"]):
        clothing_image_urls["trouser"] = f"/api/wardrobe/items/trousers?id={Trouser.query.get(clothing_ids["trouser"]).id}"

    if "shoe" in clothing_ids and Shoe.query.get(clothing_ids["shoe"]):
        clothing_image_urls["shoe"] = f"/api/wardrobe/items/shoes?id={Shoe.query.get(clothing_ids["shoe"]).id}"

    return clothing_image_urls
    
def get_outfit_image_urls(outfit_id: int):
    clothing_ids = get_clothing_ids(outfit_id)
    if not clothing_ids:
        return None
    
    return get_clothing_image_urls(clothing_ids)

@wardrobe.route("/api/wardrobe/outfits/<param>", methods=["GET"])
def get_outfits(param: str):
    if param.startswith("outfit-"):
        # Get outfit's image urls
        try:
            outfit_id = int(param[7:])
            clothing_image_urls = get_outfit_image_urls(outfit_id)
            if not clothing_image_urls:
                return jsonify({"success": False, "message": f"No image URLs for outfit #{outfit_id} found"}), 404

            return jsonify({"success": True, "imageUrls": clothing_image_urls, "message": f"Successfully retrieved outfit #{outfit_id}'s image URLs"}), 200
        except ValueError:
            return jsonify({"success": False, "message": "Invalid outfit ID"}), 400
    else:
        # Get user's outfit IDs
        return get_user_outfit_ids(param)

def get_self_outfits():
    return