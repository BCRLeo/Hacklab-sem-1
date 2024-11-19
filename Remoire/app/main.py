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
@login_required
def home_page():
    return render_template('home.html', name=current_user.UserName)

@main.route("/wardrobe")
def wardrobe_page():
    return render_template("index.html")

@main.route("/login")
def login_page():
    return render_template("index.html")

@main.route("/signup")
def signup_page():
    return render_template("index.html")

@main.route("/feed")
def feed_page():
    return render_template("index.html")


@main.route("/api/upload", methods=["POST"])
def upload():
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
    print(request.form)
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

@main.route('/api/images/<item_type>', methods=['GET'])
def get_all_images(item_type):
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
            print("bad type")
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
        {"id": idx, "url": f"/api/images/{item_type}?id={idx}"}
        for idx in ids
    ]
    print(image_metadata)
    return jsonify(image_metadata)

@main.route("/api/delete-item/<item_type>", methods=["DELETE"])
def delete_item(item_type):
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
        print(element.id, id)
        if element.id != id:
            continue
        if element.wardrobe.user_id == current_user.id:
            db.session.delete(element)
            db.session.commit()
            return jsonify({"success": True, "message": f"{item_type.capitalize()} deleted successfully"}), 200
    
    return jsonify({"success": False, "message": "You do not have permission to delete this item"}), 403


@main.route('/delete_item/<item_type>/<int:item_id>', methods=['POST'])
@login_required
def delete_itemm(item_type, item_id):
    # Map item types to their corresponding models
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
            print("bad type")
            return jsonify({"success": False, "message": "Invalid item type"})

    # Get the item class based on the item_type
    

    if not items:
        print('Invalid item type.')
        return redirect(url_for('views.wardrobe'))

    # Query the item by ID
    item = items.query.get(item_id)

    # Check if the item exists and belongs to the current user's wardrobe
    if item and item.wardrobe.user_id == current_user.id:
        db.session.delete(item)
        db.session.commit()
        print(f'{item_type.capitalize()} deleted successfully.')
    else:
        print('Item not found or you do not have permission to delete it.')

    return redirect(url_for('views.wardrobe'))

@main.route("/search", methods=["GET", "POST"])
def search_users():
    """
    Search users and render the results in the same HTML page.
    """
    if request.method == 'POST':
        query = request.form.get('query', '').strip()  # Get query from form input

        if len(query) < 2:
            return render_template('search.html', results=[], message="Query must be at least 2 characters long.")

        # Perform the search in the database
        results = User.query.filter(
            (User.UserName.ilike(f"%{query}%")) |  # Search by username
            (User.email.ilike(f"%{query}%"))       # Search by email
        ).all()

        return render_template('search.html', results=results, message=None)

    # Default GET request (renders search page with no results)
    return render_template('search.html', results=None, message=None)


@main.route('/view_wardrobe/<item_type>', methods=['GET'])
def view_wardrobe(item_type):

    pass
