from . import db
from flask_login import UserMixin
from sqlalchemy_imageattach.entity import Image, image_attachment

####snake_case
# Wardrobe model
followers = db.Table('followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('user.id'))
)

class Wardrobe(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    # Relationships to store multiple images for each category
    jacket_images = db.relationship('Jacket', backref='wardrobe', lazy=True)
    shirt_images = db.relationship('Shirt', backref='wardrobe', lazy=True)
    trouser_images = db.relationship('Trouser', backref='wardrobe', lazy=True)
    shoe_images = db.relationship('Shoe', backref='wardrobe', lazy=True)

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


# Separate model for jacket images
class Jacket(db.Model, Image):
    __tablename__ = 'jacket_image'
    id = db.Column(db.Integer, primary_key=True)
    wardrobe_id = db.Column(db.Integer, db.ForeignKey('wardrobe.id'), nullable=False)
    # Define the image_attachment for jackets
    image = image_attachment('Jacket')


# Separate model for shirt images
class Shirt(db.Model, Image):
    __tablename__ = 'shirt_image'
    id = db.Column(db.Integer, primary_key=True)
    wardrobe_id = db.Column(db.Integer, db.ForeignKey('wardrobe.id'), nullable=False)
    # Define the image_attachment for shirts
    image = image_attachment('Shirt')


# Separate model for trouser images
class Trouser(db.Model, Image):
    __tablename__ = 'trouser_image'
    id = db.Column(db.Integer, primary_key=True)
    wardrobe_id = db.Column(db.Integer, db.ForeignKey('wardrobe.id'), nullable=False)
    # Define the image_attachment for trousers
    image = image_attachment('Trouser')


# Separate model for shoe images
class Shoe(db.Model, Image):
    __tablename__ = 'shoe_image'
    id = db.Column(db.Integer, primary_key=True)
    wardrobe_id = db.Column(db.Integer, db.ForeignKey('wardrobe.id'), nullable=False)
    # Define the image_attachment for shoes
    image = image_attachment('Shoe')


#####PascalCase

# # Wardrobe model
# class Wardrobe(db.Model):
#     Id = db.Column(db.Integer, primary_key=True)

#     # Relationships to store multiple images for each category
#     JacketImages = db.relationship('Jacket', backref='Wardrobe', lazy=True)
#     ShirtImages = db.relationship('Shirt', backref='Wardrobe', lazy=True)
#     TrouserImages = db.relationship('Trouser', backref='Wardrobe', lazy=True)
#     ShoeImages = db.relationship('Shoe', backref='Wardrobe', lazy=True)

#     # Foreign key to link the wardrobe to a specific user
#     UserId = db.Column(db.Integer, db.ForeignKey('user.Id'))


# # User model
# class User(db.Model, UserMixin):
#     Id = db.Column(db.Integer, primary_key=True)
#     Email = db.Column(db.String(150), unique=True)
#     Password = db.Column(db.String(150))
#     UserName = db.Column(db.String(150))
#     # One-to-one relationship with the Wardrobe
#     Wardrobe = db.relationship('Wardrobe', uselist=False, backref='User')


# # Separate model for jacket images
# class Jacket(db.Model, Image):
#     __tablename__ = 'JacketImage'
#     Id = db.Column(db.Integer, primary_key=True)
#     WardrobeId = db.Column(db.Integer, db.ForeignKey('wardrobe.Id'), nullable=False)
#     # Define the image_attachment for jackets
#     Image = image_attachment('Jacket')


# # Separate model for shirt images
# class Shirt(db.Model, Image):
#     __tablename__ = 'ShirtImage'
#     Id = db.Column(db.Integer, primary_key=True)
#     WardrobeId = db.Column(db.Integer, db.ForeignKey('wardrobe.Id'), nullable=False)
#     # Define the image_attachment for shirts
#     Image = image_attachment('Shirt')


# # Separate model for trouser images
# class Trouser(db.Model, Image):
#     __tablename__ = 'TrouserImage'
#     Id = db.Column(db.Integer, primary_key=True)
#     WardrobeId = db.Column(db.Integer, db.ForeignKey('wardrobe.Id'), nullable=False)
#     # Define the image_attachment for trousers
#     Image = image_attachment('Trouser')


# # Separate model for shoe images
# class Shoe(db.Model, Image):
#     __tablename__ = 'ShoeImage'
#     Id = db.Column(db.Integer, primary_key=True)
#     WardrobeId = db.Column(db.Integer, db.ForeignKey('wardrobe.Id'), nullable=False)
#     # Define the image_attachment for shoes
#     Image = image_attachment('Shoe')
