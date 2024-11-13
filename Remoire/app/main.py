from flask import Flask, Blueprint, current_app, render_template, redirect, request, url_for
from flask_login import LoginManager, login_required, current_user
import os
import app

main = Blueprint('main', __name__)
#redirect users trying to get to unaccessible pages
login_manager = LoginManager()
login_manager.login_view = 'auth.login'

# Function to get the correct JS and CSS file paths
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

@main.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename))
            return redirect(url_for('main.wardrobe'))  # Redirect to wardrobe page
    return render_template('upload.html')

@main.route("/Feed", methods=['POST'])
def Feed():
    print("THIS FUNCTION IS WORKING")
    return 'OK', 200

""" @main.route('/wardrobe')
def wardrobe():
    return render_template('wardrobe.html')

@main.route('/signup')
def signup():
    return render_template('signup.html') """