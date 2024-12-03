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
from json import dumps
from .algorithm import get_posts as get_feed_posts

wardrobe = Blueprint("wardrobe", __name__)

@wardrobe.route("/api/wardrobe/items", methods=["POST"])
def upload_wardrobe_item():
    if not current_user.is_authenticated:
        return jsonify({"success": False, "message": "User not logged in"}), 401

    wardrobe = current_user.wardrobe 
    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file part"}), 400

    file = request.files['file']
    if not file:
        return jsonify({"success": False, "message": "File could not be uploaded"}), 400
    
    if file.filename == "":
        return jsonify({"success": False, "message": "No selected file"}), 400

    if "category" not in request.form:
        return jsonify({"success": False, "message": "No category part"}), 400
    
    category = request.form["category"]
    if not category:
        return jsonify({"success": False, "message": "File could not be uploaded"}), 400

    if category == "":
        return jsonify({"success": False, "message": "No selected category"}), 400
    
    # Secure the filename (though not strictly necessary since we're storing in DB)
    filename = secure_filename(file.filename)
                
    # Create a new Jacket instance associated with the user's wardrobe
    new_clothing = ""
    match category:
        case "jacket":
            new_clothing = models.Jacket(wardrobe_id=wardrobe.id)
        case "shirt":
            new_clothing = models.Shirt(wardrobe_id=wardrobe.id)
        case "trouser":
            new_clothing = models.Trouser(wardrobe_id=wardrobe.id)
        case "shoe":
            new_clothing = models.Shoe(wardrobe_id=wardrobe.id)
        case _:
            return jsonify({"success": False, "message": "Invalid clothing category"}), 400
    
        
    # Read the image data and get the MIME type
    file_data = file.read()
    file_data = ImageBackgroundRemoverV1.remove_background_file(
        file_data, current_app.rembg_session
    )

    if file_data is None:
        return jsonify({"success": False, "message": "Error processing image"}), 500
    
    mimetype = file.mimetype


    if not mimetype.startswith('image/'):
        return jsonify({"success": False, "message": "Uploaded file is not an image"}), 400

    # Assign the image data and MIME type to the new jacket
    new_clothing.image_data = file_data
    new_clothing.image_mimetype = mimetype

     # Add and commit the new jacket to the database
    db.session.add(new_clothing)
    db.session.commit()
        
    return jsonify({"success": True, "message": "File successfully uploaded"}), 200

@wardrobe.route("/api/wardrobe/<username>/items/<item_type>", methods=["GET"])
def get_user_wardrobe_image_endpoints(username, item_type):
    user = User.query.filter_by(UserName=username).first()
    if not user:
        return jsonify({"success": False, "message": f"User {username} not found"}), 404
    
    items = None
    match item_type:
        case "jacket":
            items = user.wardrobe.jackets
        case "shirt":
            items = user.wardrobe.shirts
        case "trousers":
            items = user.wardrobe.trousers
        case "shoes":
            items = user.wardrobe.shoes
        case _:
            return jsonify({"success": False, "message": "Invalid item type"}), 400

    ids = [item.id for item in items]

    image_endpoints = [f"/api/wardrobe/items/{item_type}/{idx}" for idx in ids]
    return jsonify({
        "success": True,
        "message": f"Successfully retrieved {item_type} image endpoints",
        "data": image_endpoints
    }), 200

@wardrobe.route("/api/wardrobe/items/<item_type>/<int:item_id>", methods=["GET"])
def get_wardrobe_image(item_type, item_id):
    item = None
    match item_type:
        case "jacket":
            item = Jacket.query.get(item_id)
        case "shirt":
            item = Shirt.query.get(item_id)
        case "trousers":
            item = Trouser.query.get(item_id)
        case "shoes":
            item = Shoe.query.get(item_id)
        case _:
            return jsonify({"success": False, "message": "Invalid item type"}), 400
        
    return send_file(io.BytesIO(item.image_data), mimetype=item.image_mimetype)

@wardrobe.route('/api/wardrobe/items/<item_type>', methods=['GET'])
def get_wardrobe_images(item_type):
    if not current_user.is_authenticated:
        return jsonify({"success": False, "message": "User not logged in"}), 401

    return get_user_wardrobe_image_endpoints(current_user.UserName, item_type)
    items = None
    match item_type:
        case "jacket":
            items = current_user.wardrobe.jackets
        case "shirt":
            items = current_user.wardrobe.shirts
        case "trousers":
            items = current_user.wardrobe.trousers
        case "shoes":
            items = current_user.wardrobe.shoes
        case _:
            return jsonify({"success": False, "message": "Invalid item type"}), 400

    images = [item.image_data for item in items]
    ids = [item.id for item in items]

    id = request.args.get("id")
    if id:
        id = int(id)
        if id not in ids:
            return jsonify({"success": False, "message": "Invalid image ID"}), 404
        
        index = ids.index(id)
        mimetypes = [item.image_mimetype for item in items]
        image_bytes = images[index]
        image_io = io.BytesIO(image_bytes)
        return send_file(image_io, mimetype = mimetypes[index])

    image_endpoints = [f"/api/wardrobe/items/{item_type}?id={idx}" for idx in ids]
    return jsonify({
        "success": True,
        "message": f"Successfully retrieved {item_type} image endpoints",
        "data": image_endpoints
    }), 200

@wardrobe.route("/api/wardrobe/items/<item_type>", methods=["DELETE"])
def delete_wardrobe_item(item_type):
    if not current_user.is_authenticated:
        return jsonify({"success": False, "message": "User not logged in"}), 401
    
    items = None
    match item_type:
        case "jacket":
            items = current_user.wardrobe.jackets
        case "shirt":
            items = current_user.wardrobe.shirts
        case "trousers":
            items = current_user.wardrobe.trousers
        case "shoes":
            items = current_user.wardrobe.shoes
        case _:
            return jsonify({"success": False, "message": "Invalid item type"}), 400
        
    id = request.args.get("id")
    if not id:
        return jsonify({"success": False, "message": "No item ID provided"}), 400
    id = int(id)

    ids = [item.id for item in items]

    if id not in ids:
            return jsonify({"success": False, "message": "Invalid item ID"}), 404
    
    for element in items:
        if element.id != id:
            continue
        if element.wardrobe.user_id == current_user.id:
            db.session.delete(element)
            db.session.commit()
            return jsonify({"success": True, "message": f"{item_type.capitalize()} deleted successfully"}), 200
    
    return jsonify({"success": False, "message": "You do not have permission to delete this item"}), 403

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

@wardrobe.route("/api/wardrobe/<username>/outfits", methods=["GET"])
def get_user_outfit_ids(username: str):
    user = User.query.filter_by(UserName=username).first()
    if not user:
        return jsonify({"success": False, "message": f"User {username} not be found"}), 404

    outfits = user.outfits
    outfit_ids = [outfits[i].id for i in range(len(outfits))]

    return jsonify({"success": True, "outfitIds": outfit_ids, "message": "Successfully retrieved outfit IDs"}), 200


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
        clothing_image_urls["jacket"] = f"/api/wardrobe/items/jacket/{Jacket.query.get(clothing_ids["jacket"]).id}"

    if "shirt" in clothing_ids and Shirt.query.get(clothing_ids["shirt"]):
        clothing_image_urls["shirt"] = f"/api/wardrobe/items/shirt/{Shirt.query.get(clothing_ids["shirt"]).id}"

    if "trouser" in clothing_ids and Trouser.query.get(clothing_ids["trouser"]):
        clothing_image_urls["trouser"] = f"/api/wardrobe/items/trousers/{Trouser.query.get(clothing_ids["trouser"]).id}"

    if "shoe" in clothing_ids and Shoe.query.get(clothing_ids["shoe"]):
        clothing_image_urls["shoe"] = f"/api/wardrobe/items/shoes/{Shoe.query.get(clothing_ids["shoe"]).id}"

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