from flask import Blueprint, render_template, redirect, url_for, request, current_app
from flask_login import login_required, current_user, LoginManager
import os
main = Blueprint('main', __name__)
import app

#redirect users trying to get to unaccessible pages
login_manager = LoginManager()
login_manager.login_view = 'auth.login'  


@main.route('/')
def index():
    return render_template('frontpage.html')

@main.route("/wardrobe")
@login_required
def wardrobe():
    return render_template("wardrobe.html")


@main.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename))
            return redirect(url_for('main.wardrobe'))  # Redirect to wardrobe page
    return render_template('upload.html')
