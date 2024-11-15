from flask import Flask, Blueprint, current_app, render_template, redirect, request, url_for, jsonify
from flask_login import LoginManager, login_required, current_user
import os
import app
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
    wardrobe = current_user.wardrobe 
    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file part"}), 400

    file = request.files['file']
    if file.filename == "":
        return jsonify({"success": False, "message": "No selected file"}), 400
    
    if file:
        # Secure the filename (though not strictly necessary since we're storing in DB)
        filename = secure_filename(file.filename)
                
        # Create a new Jacket instance associated with the user's wardrobe
        new_jacket = models.Jacket(wardrobe_id=wardrobe.id)
        
        # Read the image data and get the MIME type
        file_data = file.read()
        file_data = ImageBackgroundRemoverV1.remove_background_file(file_data)
        mimetype = file.mimetype

        if not mimetype.startswith('image/'):
            return jsonify({"success": False, "message": "Uploaded file is not an image"}), 400

        # Assign the image data and MIME type to the new jacket
        new_jacket.image_data = file_data
        new_jacket.image_mimetype = mimetype

        # Add and commit the new jacket to the database
        db.session.add(new_jacket)
        db.session.commit()
        
        return jsonify({"success": True, "message": "File successfully uploaded"})
        
    return jsonify({"success": False, "message": "File could not be uploaded"}), 400

# def upload():
#     wardrobe = current_user.wardrobe 
#     if "file" not in request.files:
#         return jsonify({"success": False, "message": "No file part"}), 400

#     file = request.files['file']
#     if file.filename == "":
#         return jsonify({"success": False, "message": "No selected file"}), 400
    
#     if file:
#         ####PASS FILE INTO USER WARDROBE, FOR NOW LET'S SAY ITS A JACKET
#        ##INGORE THIS LINE current_user.wardrobe.Jacket ImageBackgroundRemoverV1.remove_background_file(file, "UPLOAD_FOLDER")
#         return jsonify({"success": True, "message": "File successfully uploaded"})
    
#     return jsonify({"success": False, "message": "File could not be uploaded"})

""" @main.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename))
            return redirect(url_for('main.wardrobe'))  # Redirect to wardrobe page
    return render_template('upload.html') """

@main.route("/FeedPage", methods=['POST'])
def feedpage():
    print("lets gooo")
    return '', 200  # Return HTTP 200 OK with an empty response

""" @main.route('/wardrobe')
def wardrobe():
    return render_template('wardrobe.html')

@main.route('/signup')
def signup():
    return render_template('signup.html') """