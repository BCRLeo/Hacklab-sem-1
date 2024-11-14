# app/auth.py

from flask import Blueprint, render_template, redirect, url_for, request, flash, jsonify
from .models import User, Wardrobe
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
import os
import re
from datetime import datetime

auth = Blueprint('auth', __name__)
# Regular expression for basic email and password validation
EMAIL_REGEX = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
PASSWORD_REGEX = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
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
        return jsonify({"isLoggedIn": True, "username": current_user.UserName})
    return jsonify({"isLoggedIn": False})

@auth.route('/api/login', methods=['POST'])
def login():
    if request.method == 'POST':
        # Get form data
        data = request.get_json()
        login_input = data.get("login")  # Could be username or email
        password = data.get("password")
        
        # Check if login_input and password are provided
        if not login_input or not password:
            return jsonify({"success": False, "message": "Please enter both login and password"}), 400
        
        # Check if the input is an email
        if re.match(EMAIL_REGEX, login_input):  # Checks if the input is a valid email
            user = User.query.filter_by(email=login_input).first()
        else:
            user = User.query.filter_by(UserName=login_input).first()

        # Authenticate user
        if user and check_password_hash(user.password, password):
            login_user(user)
            return jsonify({"success": True, "message": "Login successful"}), 200
        else:
            return jsonify({"success": False, "message": "Invalid username/email or password"}), 401
            
    return jsonify({"success": False, "message": "Invalid request method"}), 405

"""
@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Get form data
        login_input = request.form.get('login')  # Could be username or email
        password = request.form.get('password')

        # Check if login_input and password are provided
        if not login_input or not password:
            flash('Please enter both login and password')
            return render_template('login.html')
        
        # Check if the input is an email
        if re.match(EMAIL_REGEX, login_input):  # Checks if the input is a valid email
            user = User.query.filter_by(email=login_input).first()
        else:
            user = User.query.filter_by(UserName=login_input).first()

        # Authenticate user
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('main.wardrobe'))
        else:
            flash('Invalid username/email or password')
    return render_template('login.html')
"""

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # Get form data
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')
        birthday = request.form.get("birdthday")

        # Validate email format
        if not re.match(EMAIL_REGEX, email):
            flash('Invalid email format')
            return render_template('sign')
        
        # Validate password format using regex
        if not re.match(PASSWORD_REGEX, password):
            flash('Password must be at least 8 characters long, contain at least one uppercase letter and one number.')
            return render_template('signup.html')
        
        # Check if user exists
        user = User.query.filter_by(email=email).first()
        if user:
            flash('Email address already exists')
            return redirect(url_for('auth.signup'))
        # Create new user and wardrobe
        new_user = User(
            email=email,
            UserName=username,
            password=generate_password_hash(password, method='pbkdf2:sha256'),
            birthday = birthday,
            CreationDate = datetime.date
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


