from . import db
from flask_login import UserMixin
from sqlalchemy_imageattach.entity import Image, image_attachment

# Followers association table
followers = db.Table('followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('user.id'))
)

# Wardrobe model
class Wardrobe(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    # Relationships to store multiple items for each category
    jackets = db.relationship('Jacket', backref='wardrobe', lazy=True)
    shirts = db.relationship('Shirt', backref='wardrobe', lazy=True)
    trousers = db.relationship('Trouser', backref='wardrobe', lazy=True)
    shoes = db.relationship('Shoe', backref='wardrobe', lazy=True)

    # Foreign key to link the wardrobe to a specific user
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

# User model
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    UserName = db.Column(db.String(150))
    # One-to-one relationship with the Wardrobe
    wardrobe = db.relationship('Wardrobe', uselist=False, backref='user')

    # Users that this user is following
    followed = db.relationship(
        'User', secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers', lazy='dynamic'), lazy='dynamic'
    )

    def follow(self, user):
        if not self.is_following(user):
            self.followed.append(user)

    def unfollow(self, user):
        if self.is_following(user):
            self.followed.remove(user)

    def is_following(self, user):
        return self.followed.filter(
            followers.c.followed_id == user.id).count() > 0

# Jacket model
class Jacket(db.Model):
    __tablename__ = 'jacket'
    id = db.Column(db.Integer, primary_key=True)
    wardrobe_id = db.Column(db.Integer, db.ForeignKey('wardrobe.id'), nullable=False)
    # Define the image_attachment for jackets
    image = image_attachment('JacketImage')

# Jacket image model
class JacketImage(db.Model, Image):
    __tablename__ = 'jacket_image'
    jacket_id = db.Column(db.Integer, db.ForeignKey('jacket.id'), primary_key=True)
    # Relationship back to Jacket
    jacket = db.relationship('Jacket')

# Shirt model
class Shirt(db.Model):
    __tablename__ = 'shirt'
    id = db.Column(db.Integer, primary_key=True)
    wardrobe_id = db.Column(db.Integer, db.ForeignKey('wardrobe.id'), nullable=False)
    image = image_attachment('ShirtImage')

# Shirt image model
class ShirtImage(db.Model, Image):
    __tablename__ = 'shirt_image'
    shirt_id = db.Column(db.Integer, db.ForeignKey('shirt.id'), primary_key=True)
    shirt = db.relationship('Shirt')

# Trouser model
class Trouser(db.Model):
    __tablename__ = 'trouser'
    id = db.Column(db.Integer, primary_key=True)
    wardrobe_id = db.Column(db.Integer, db.ForeignKey('wardrobe.id'), nullable=False)
    image = image_attachment('TrouserImage')

# Trouser image model
class TrouserImage(db.Model, Image):
    __tablename__ = 'trouser_image'
    trouser_id = db.Column(db.Integer, db.ForeignKey('trouser.id'), primary_key=True)
    trouser = db.relationship('Trouser')

# Shoe model
class Shoe(db.Model):
    __tablename__ = 'shoe'
    id = db.Column(db.Integer, primary_key=True)
    wardrobe_id = db.Column(db.Integer, db.ForeignKey('wardrobe.id'), nullable=False)
    image = image_attachment('ShoeImage')

# Shoe image model
class ShoeImage(db.Model, Image):
    __tablename__ = 'shoe_image'
    shoe_id = db.Column(db.Integer, db.ForeignKey('shoe.id'), primary_key=True)
    shoe = db.relationship('Shoe')
