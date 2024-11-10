from flask import Flask, Blueprint, render_template, redirect, url_for
from flask_login import login_required, current_user
import os

main = Blueprint('main', __name__)

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
    return render_template('home.html')

@main.route('/home')
@login_required
def home():
    return render_template('home.html', name=current_user.UserName)
