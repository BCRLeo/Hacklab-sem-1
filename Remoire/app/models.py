from . import db
from flask_login import UserMixin
from sqlalchemy_imageattach.entity import Image, image_attachment
from datetime import datetime
from sqlalchemy import text


# Followers association table
followers = db.Table('followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('user.id'))
)
# Association table for tags
post_tags = db.Table('post_tags',
    db.Column('post_id', db.Integer, db.ForeignKey('post.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True)
)
class Post(db.Model):
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    description = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    outfit_id = db.Column(db.Integer, db.ForeignKey('outfit.id'), nullable=True)
    image = image_attachment('PostImage')

    # Relationships
    author = db.relationship('User', back_populates='posts')
    outfit = db.relationship('Outfit', back_populates='posts')
    likes = db.relationship('Like', back_populates='post', lazy='dynamic')
    tags = db.relationship('Tag', secondary=post_tags, back_populates='posts')

    # Method to count likes
    def like_count(self):
        return self.likes.count()
    

class PostImage(db.Model, Image):
    __tablename__ = 'post_image'
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), primary_key=True)
    post = db.relationship('Post')

class Outfit(db.Model):
    __tablename__ = 'outfit'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='outfits')
    posts = db.relationship('Post', back_populates='outfit')

    # Clothing item relationships
    jacket_id = db.Column(db.Integer, db.ForeignKey('jacket.id'), nullable=True)
    shirt_id = db.Column(db.Integer, db.ForeignKey('shirt.id'), nullable=True)
    trouser_id = db.Column(db.Integer, db.ForeignKey('trouser.id'), nullable=True)
    shoe_id = db.Column(db.Integer, db.ForeignKey('shoe.id'), nullable=True)

    jacket = db.relationship('Jacket')
    shirt = db.relationship('Shirt')
    trouser = db.relationship('Trouser')
    shoe = db.relationship('Shoe')

    @staticmethod
    def create_outfit(user, jacket=None, shirt=None, trouser=None, shoe=None):
        # # Ensure that the items belong to the user's wardrobe
        # if jacket and jacket.wardrobe.user_id != user.id:
        #     raise ValueError("Selected jacket does not belong to your wardrobe.")
        # if shirt and shirt.wardrobe.user_id != user.id:
        #     raise ValueError("Selected shirt does not belong to your wardrobe.")
        # if trouser and trouser.wardrobe.user_id != user.id:
        #     raise ValueError("Selected trouser does not belong to your wardrobe.")
        # if shoe and shoe.wardrobe.user_id != user.id:
        #     raise ValueError("Selected shoe does not belong to your wardrobe.")

        outfit = Outfit(
            user_id=user.id,
            jacket_id=jacket.id if jacket else None,
            shirt_id=shirt.id if shirt else None,
            trouser_id=trouser.id if trouser else None,
            shoe_id=shoe.id if shoe else None
        )
        db.session.add(outfit)
        db.session.commit()
        return outfit

class Like(db.Model):
    __tablename__ = 'like'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='likes')
    post = db.relationship('Post', back_populates='likes')

class Tag(db.Model):
    __tablename__ = 'tag'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    # Relationships
    posts = db.relationship('Post', secondary=post_tags, back_populates='tags')

# Wardrobe model
class Wardrobe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # Relationships
    user = db.relationship('User', back_populates='wardrobe')
    jackets = db.relationship('Jacket', back_populates='wardrobe', lazy=True)
    shirts = db.relationship('Shirt', back_populates='wardrobe', lazy=True)
    trousers = db.relationship('Trouser', back_populates='wardrobe', lazy=True)
    shoes = db.relationship('Shoe', back_populates='wardrobe', lazy=True)

# User model
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    UserName = db.Column(db.String(150))
    birthday = db.Column(db.Date, nullable=False)
    CreationDate = db.Column(db.Date, nullable = False)
    # Premium field with default value set to False
    premium = db.Column(
        db.Boolean,
        nullable=False,
        default=False,
        server_default=text('false')  # Ensures database-level default
    )



    # Relationships
    wardrobe = db.relationship('Wardrobe', uselist=False, back_populates='user')
    posts = db.relationship('Post', back_populates='author', lazy='dynamic')
    likes = db.relationship('Like', back_populates='user', lazy='dynamic')
    outfits = db.relationship('Outfit', back_populates='user')

    # Self-referential followers relationship
    followed = db.relationship(
        'User', secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        back_populates='followers',
        lazy='dynamic'
    )
    followers = db.relationship(
        'User', secondary=followers,
        primaryjoin=(followers.c.followed_id == id),
        secondaryjoin=(followers.c.follower_id == id),
        back_populates='followed',
        lazy='dynamic'
    )
    # Method to check if the user has premium status
    def has_premium(self):
        return self.premium

    # Method to toggle premium status
    def toggle_premium(self):
        self.premium = not self.premium
        db.session.commit()

    def follow(self, user):
        if not self.is_following(user):
            self.followed.append(user)
            db.session.commit()

    def unfollow(self, user):
        if self.is_following(user):
            self.followed.remove(user)
            db.session.commit()

    def is_following(self, user):
        return self.followed.filter(followers.c.followed_id == user.id).first() is not None
    
    def is_followed(self, user):
        return self.followers.filter(followers.c.follower_id == user.id).first() is not None

    def like_post(self, post):
        if not self.has_liked_post(post):
            like = Like(user_id=self.id, post_id=post.id)
            db.session.add(like)
            db.session.commit()

    def unlike_post(self, post):
        like = Like.query.filter_by(user_id=self.id, post_id=post.id).first()
        if like:
            db.session.delete(like)
            db.session.commit()

    def has_liked_post(self, post):
        return Like.query.filter_by(user_id=self.id, post_id=post.id).first() is not None

# Jacket model
class Jacket(db.Model):
    __tablename__ = 'jacket'
    id = db.Column(db.Integer, primary_key=True)
    wardrobe_id = db.Column(db.Integer, db.ForeignKey('wardrobe.id'), nullable=False)
    
    image = image_attachment('JacketImage')

    wardrobe = db.relationship('Wardrobe', back_populates='jackets')

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

    wardrobe = db.relationship('Wardrobe', back_populates='shirts')

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

    wardrobe = db.relationship('Wardrobe', back_populates='trousers')

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

    wardrobe = db.relationship('Wardrobe', back_populates='shoes')

# Shoe image model
class ShoeImage(db.Model, Image):
    __tablename__ = 'shoe_image'
    shoe_id = db.Column(db.Integer, db.ForeignKey('shoe.id'), primary_key=True)
    shoe = db.relationship('Shoe')
