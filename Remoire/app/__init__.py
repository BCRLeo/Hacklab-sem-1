from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os
from flask_migrate import Migrate
# Initialize extensions
db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = 'your_secret_key'  # Replace with a real secret key
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

    app.config['UPLOAD_FOLDER'] = 'uploads'  # Folder to save uploaded files
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    #config for email verification
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Example: Gmail SMTP server
    app.config['MAIL_PORT'] = 587  # TLS port
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'your-email@gmail.com'  # Your email
    app.config['MAIL_PASSWORD'] = 'your-email-password'  # Your email password or app password
    app.config['MAIL_DEFAULT_SENDER'] = 'your-email@gmail.com'

    login_manager.init_app(app)
    migrate.init_app(app, db)

    #config upload folder
    app.config['UPLOAD_FOLDER'] = 'uploads'  # Folder to save uploaded files
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    # Import models
    from .models import User

    # User loader callback
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register blueprints
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .profile import profile as profile_blueprint
    app.register_blueprint(profile_blueprint)

    from .feed import feed as feed_blueprint
    app.register_blueprint(feed_blueprint)

    from .wardrobe import wardrobe as wardrobe_blueprint
    app.register_blueprint(wardrobe_blueprint)

    from .social import social as social_blueprint
    app.register_blueprint(social_blueprint)

    from .search import search as search_blueprint
    app.register_blueprint(search_blueprint)

    return app
