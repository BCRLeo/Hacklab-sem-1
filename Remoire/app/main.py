from flask import Flask, Blueprint, current_app, render_template, redirect, request, url_for, jsonify, send_file
from flask_login import LoginManager, login_required, current_user
import io
import os
import app
from .models import User
from . import ImageBackgroundRemoverV1
from . import db
from . import models
from werkzeug.utils import secure_filename
from sqlalchemy_imageattach.context import store_context
from json import dumps
from .algorithm import get_posts

main = Blueprint('main', __name__)
#redirect users trying to get to unaccessible pages
login_manager = LoginManager()
login_manager.login_view = 'auth.login'

# Get the correct JS and CSS file paths
def get_js_and_css():
    js_dir = os.path.join(main.root_path, 'static', 'js')
    css_dir = os.path.join(main.root_path, 'static', 'css')

    js_file = next((f for f in os.listdir(js_dir) if f.endswith('.js')), None)
    css_file = next((f for f in os.listdir(css_dir) if f.endswith('.css')), None)

    return {
        'js': js_file if js_file else 'main.js',  # Default fallback
        'css': css_file if css_file else 'main.css',  # Default fallback
    }



# Register the function globally in all templates
@main.context_processor
def inject_js_and_css():
    return dict(get_js_and_css=get_js_and_css)


@main.route('/')
def index_page():
    return render_template('index.html')

@main.route('/home')
def home_page():
    return render_template('index.html')

@main.route("/wardrobe")
def wardrobe_page():
    return render_template("index.html")

@main.route("/login")
def login_page():
    return render_template("index.html")

@main.route("/profile")
def profile_page():
    return render_template("index.html")

@main.route("/signup")
def signup_page():
    return render_template("index.html")

@main.route("/feed")
def feed_page():
    return render_template("index.html")

@main.route("/search")
def search_page():
    return render_template("index.html")


@main.route("/api/wardrobe/items", methods=["POST"])
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
    file_data = ImageBackgroundRemoverV1.remove_background_file(file_data)
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

@main.route('/api/wardrobe/items/<item_type>', methods=['GET'])
def get_wardrobe_images(item_type):
    user_id = request.args.get("user-id")
    if user_id:
        user_id = int(user_id)
        

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

    image_metadata = [
        {"id": idx, "url": f"/api/wardrobe/items/{item_type}?id={idx}"}
        for idx in ids
    ]
    return jsonify(image_metadata)

@main.route("/api/wardrobe/items/<item_type>", methods=["DELETE"])
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


@main.route("/api/posts", methods=["POST"])
def upload_feed_post():
    if not current_user.is_authenticated:
        return jsonify({"success": False, "message": "User not logged in"}), 401
    
    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file uploaded"}), 400

    file = request.files["file"]
    if not file:
        return jsonify({"success": False, "message": "File could not be uploaded"}), 400
    
    if file.filename == "":
        return jsonify({"success": False, "message": "No selected file"}), 400
    
    # Secure the filename (though not strictly necessary since we're storing in DB)
    filename = secure_filename(file.filename)
    
    posts = current_user.posts
    new_post = models.Post()
        
    # Read the image data and get the MIME type
    file_data = file.read()
    mimetype = file.mimetype

    if not mimetype.startswith('image/'):
        return jsonify({"success": False, "message": "Uploaded file is not an image"}), 400

    # Assign the image data and MIME type to the new jacket
    new_post.user_id = current_user.id
    new_post.image_data = file_data
    new_post.image_mimetype = mimetype

     # Add and commit the new jacket to the database
    db.session.add(new_post)
    db.session.commit()
        
    return jsonify({"success": True, "message": "File successfully uploaded"}), 200

@main.route("/api/posts", methods=["GET"])
def get_feed_posts():
    if not current_user.is_authenticated:
        return jsonify({"success": False, "message": "User not logged in"}), 401
    user_id = current_user.id

    posts = get_posts(user_id)

    ids = [post.id for post in posts]
    images = [post.image_data for post in posts]
    print(ids)

    id = request.args.get("id")
    if id:
        id = int(id)
        if id not in ids:
            return jsonify({"success": False, "message": "Invalid post ID"}), 404
        
        index = ids.index(id)
        mimetypes = [item.image_mimetype for item in posts]
        image_bytes = images[index]
        image_io = io.BytesIO(image_bytes)
        return send_file(image_io, mimetype = mimetypes[index])

    posts_metadata = [
    {
        "id": post.id, 
        "url": f"/api/posts?id={post.id}", 
        "caption": post.description, 
        "timestamp": post.timestamp, 
        "outfit": post.outfit_id,
        "username": post.author.UserName  # Assuming you have a relationship between Post and User models
    }
    for post in posts
]
    
    return jsonify(posts_metadata)

@main.route("/api/search", methods=["POST"])
def search_users():

    data = request.get_json()
    query = data.get("query").strip()

    if len(query) < 2:
            return jsonify({"success" : False, "message" : "Query must be at least 2 characters long."})

    results = User.query.filter(
            (User.UserName.ilike(f"%{query}%"))   # Search by username
        ).all()

    if not results:
        return jsonify({"success" : False, "message" : "No user found"})
    
    userNames = [user.UserName for user in results]

    return jsonify({"success" : True, "message" : "Bravo!", "userNames" : userNames})

@main.route('/view_wardrobe/<item_type>', methods=['GET'])
def view_wardrobe(item_type):

    pass
@main.route("/api/create_outfit", methods = ["GET"])
def create_outfit():
    data = request.get_json()
    jacket = models.Jacket.query.get(data.get('jacket', [])) if data.get('jacket', []) else None
    shirt = models.Shirt.query.get(data.get('shirt', [])) if data.get('shirt', []) else None
    trouser = models.Trouser.query.get(data.get('trousers', [])) if data.get('trousers', []) else None
    shoe = models.Shoe.query.get(data.get('shoes', []) ) if data.get('shoes', [])  else None  
    flag = models.Outfit.create_outfit(current_user,jacket, shirt, trouser, shoe )

    if flag:
        return jsonify({"success":True }), 200
    else:
        return jsonify({"succes": False}), 400
    





##this is just a quick function to return the favorited items, chnage it as you need
# @app.route('/wardrobe/favorites')
# def favorite_items():
#     favorite_jackets = current_user.wardrobe.get_favorite_jackets()
#     favorite_shirts = current_user.wardrobe.get_favorite_shirts()
#     favorite_trousers = current_user.wardrobe.get_favorite_trousers()
#     favorite_shoes = current_user.wardrobe.get_favorite_shoes()
#     favorite_outfits = current_user.get_favorite_outfits()
#     return render_template('favorites.html', jackets=favorite_jackets, shirts=favorite_shirts,
#                            trousers=favorite_trousers, shoes=favorite_shoes, outfits=favorite_outfits)
