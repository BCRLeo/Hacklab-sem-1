from flask import (
    Flask,
    Blueprint,
    current_app,
    render_template,
    redirect,
    request,
    url_for,
    jsonify,
    send_file,
)
from flask_login import LoginManager, login_required, current_user
import io
import os
import app
from .models import User, Like, Post
from . import ImageBackgroundRemoverV1
from . import db
from . import models
from werkzeug.utils import secure_filename
from sqlalchemy_imageattach.context import store_context
from json import dumps
from .algorithm import get_posts as get_feed_posts

social = Blueprint("social", __name__)

"likes, follows, etc."