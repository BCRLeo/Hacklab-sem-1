# app/auth.py

from flask import Blueprint, render_template, redirect, url_for, request, flash, jsonify
from .models import User, Wardrobe
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
import os

auth = Blueprint('auth', __name__)

# Function to get the correct JS and CSS file paths
def get_js_and_css():
    js_dir = os.path.join(auth.root_path, 'static', 'js')
    css_dir = os.path.join(auth.root_path, 'static', 'css')

    js_file = next((f for f in os.listdir(js_dir) if f.endswith('.js')), None)
    css_file = next((f for f in os.listdir(css_dir) if f.endswith('.css')), None)

    return {
        'js': js_file if js_file else 'main.js',  # Default fallback
        'css': css_file if css_file else 'main.css',  # Default fallback
    }

# Register the function globally in all templates
@auth.context_processor
def inject_js_and_css():
    return dict(get_js_and_css=get_js_and_css)

@auth.route('/api/check-login', methods=['GET'])
def check_login():
    if current_user.is_authenticated:
        return jsonify({"logged_in": True, "username": current_user.username})
    return jsonify({"logged_in": False})

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Get form data
        email = request.form.get('email')
        password = request.form.get('password')
        # Authenticate user
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('main.home'))
        else:
            flash('Invalid email or password')
    return render_template('login.html')

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # Get form data
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')
        # Check if user exists
        user = User.query.filter_by(email=email).first()
        if user:
            flash('Email address already exists')
            return redirect(url_for('auth.signup'))
        # Create new user and wardrobe
        new_user = User(
            email=email,
            UserName=username,
            password=generate_password_hash(password, method='pbkdf2:sha256')
        )
        new_wardrobe = Wardrobe(user=new_user)
        db.session.add(new_user)
        db.session.add(new_wardrobe)
        db.session.commit()
        login_user(new_user)
        return redirect(url_for('main.home'))
    return render_template('signup.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))


