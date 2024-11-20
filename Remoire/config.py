# config.py
import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # General Config
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    # Using SQLite for development
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')

class TestingConfig(Config):
    # Separate SQLite database for testing
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

class ProductionConfig(Config):
    # Example PostgreSQL URI for production
    SQLALCHEMY_DATABASE_URI = 'postgresql://username:password@localhost:5432/yourdatabase'

# Add more configurations as needed
