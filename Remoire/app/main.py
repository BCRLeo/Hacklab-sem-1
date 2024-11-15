from flask import Flask, Blueprint, current_app, render_template, redirect, request, url_for, jsonify
from flask_login import LoginManager, login_required, current_user
import os
import app
from . import ImageBackgroundRemoverV1 

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
def index():
    return render_template('index.html')

@main.route('/home')
@login_required
def home():
    return render_template('home.html', name=current_user.UserName)


@main.route("/api/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file part"}), 400

    file = request.files['file']
    if file.filename == "":
        return jsonify({"success": False, "message": "No selected file"}), 400
    
    if file:
        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename))
        ImageBackgroundRemoverV1.remove_background_file(file, "UPLOAD_FOLDER")
        return jsonify({"success": True, "message": "File successfully uploaded"})
    
    return jsonify({"success": False, "message": "File could not be uploaded"})

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