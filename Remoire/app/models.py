from . import db
from flask_login import UserMixin
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

class OutfitUsage(db.Model):
    __tablename__ = 'outfit_usage'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    outfit_id = db.Column(db.Integer, db.ForeignKey('outfit.id'), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='outfit_usages')
    outfit = db.relationship('Outfit', back_populates='outfit_usages')

    @classmethod
    def get_outfits_on_day(cls, user_id, date):
        
        start_datetime = datetime.combine(date, datetime.min.time())
        end_datetime = datetime.combine(date, datetime.max.time())

        usages = cls.query.filter(
            cls.user_id == user_id,
            cls.timestamp >= start_datetime,
            cls.timestamp <= end_datetime
        ).all()

        return [usage.outfit_id for usage in usages]
class Post(db.Model):
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    description = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    outfit_id = db.Column(db.Integer, db.ForeignKey('outfit.id'), nullable=True)
    image_data = db.Column(db.LargeBinary, nullable=True)
    image_mimetype = db.Column(db.String(255), nullable=True)

    # Relationships
    author = db.relationship('User', back_populates='posts')
    outfit = db.relationship('Outfit', back_populates='posts')
    likes = db.relationship('Like', back_populates='post', lazy='dynamic')
    tags = db.relationship('Tag', secondary=post_tags, back_populates='posts')

    # Method to count likes
    def like_count(self):
        return self.likes.count()

class Outfit(db.Model):
    __tablename__ = 'outfit'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    favorite = db.Column(
        db.Boolean,
        nullable=False,
        default=False,
        server_default=text('false')
    )

    # Relationships
    user = db.relationship('User', back_populates='outfits')
    posts = db.relationship('Post', back_populates='outfit')
    outfit_usages = db.relationship('OutfitUsage', back_populates='outfit', lazy='dynamic')


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
    def mark_as_favorite(self):
        self.favorite = True
        db.session.commit()

    def unmark_as_favorite(self):
        self.favorite = False
        db.session.commit()

    def mark_as_worn_today(self):
        usage = OutfitUsage(user_id=self.user_id, outfit_id=self.id)
        db.session.add(usage)
        db.session.commit()

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

    def get_favorite_jackets(self):
        return [jacket for jacket in self.jackets if jacket.favorite]

    def get_favorite_shirts(self):
        return [shirt for shirt in self.shirts if shirt.favorite]

    def get_favorite_trousers(self):
        return [trouser for trouser in self.trousers if trouser.favorite]

    def get_favorite_shoes(self):
        return [shoe for shoe in self.shoes if shoe.favorite]

# User model
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    UserName = db.Column(db.String(150))
    birthday = db.Column(db.Date, nullable=False)
    CreationDate = db.Column(db.Date, nullable=False)
    PhoneNumber = db.Column(db.String(20), nullable=True, unique = True)
    ProfilePicture = db.Column(db.LargeBinary, nullable=True)
    Bio = db.Column(db.String(500), nullable = True)

    # Premium field with default value set to False
    premium = db.Column(
        db.Boolean,
        nullable=False,
        default=False,
        server_default=text('false')  # Ensures database-level default
    )
    # Define unique constraints with explicit names THIS IS VERY IMPORTANT FOR FUTURE MIGRATIONS, ADD THIS WHEN ADDING VALUES WITH CONSTRAINTS
    __table_args__ = (
        db.UniqueConstraint('PhoneNumber', name='uq_user_phone_number'),
    )

    # New is_public boolean field set to False by default
    IsPublic = db.Column(
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
    outfit_usages = db.relationship('OutfitUsage', back_populates='user', lazy='dynamic')


    def get_favorite_outfits(self):
        return [outfit for outfit in self.outfits if outfit.favorite]

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
    
    def toggle_is_public(self):
        self.IsPublic = not self.IsPublic
        db.session.commit()
        

    def set_phone_number(self, phone_number):
        self.phone_number = phone_number
        db.session.commit()
        

# Jacket model
class Jacket(db.Model):
    __tablename__ = 'jacket'
    id = db.Column(db.Integer, primary_key=True)
    wardrobe_id = db.Column(db.Integer, db.ForeignKey('wardrobe.id'), nullable=False)
    image_data = db.Column(db.LargeBinary, nullable=True)
    image_mimetype = db.Column(db.String(255), nullable=True)

    favorite = db.Column(
        db.Boolean,
        nullable=False,
        default=False,
        server_default=text('false')  # Ensures database-level default
    )

    wardrobe = db.relationship('Wardrobe', back_populates='jackets')

    # Methods to toggle favorite status
    def mark_as_favorite(self):
        self.favorite = True
        db.session.commit()

    def unmark_as_favorite(self):
        self.favorite = False
        db.session.commit()

# Shirt model
class Shirt(db.Model):
    __tablename__ = 'shirt'
    id = db.Column(db.Integer, primary_key=True)
    wardrobe_id = db.Column(db.Integer, db.ForeignKey('wardrobe.id'), nullable=False)
    image_data = db.Column(db.LargeBinary, nullable=True)
    image_mimetype = db.Column(db.String(255), nullable=True)

    favorite = db.Column(
        db.Boolean,
        nullable=False,
        default=False,
        server_default=text('false')  # Ensures database-level default
    )

    wardrobe = db.relationship('Wardrobe', back_populates='shirts')

    # Methods to toggle favorite status
    def mark_as_favorite(self):
        self.favorite = True
        db.session.commit()

    def unmark_as_favorite(self):
        self.favorite = False
        db.session.commit()

# Trouser model
class Trouser(db.Model):
    __tablename__ = 'trouser'
    id = db.Column(db.Integer, primary_key=True)
    wardrobe_id = db.Column(db.Integer, db.ForeignKey('wardrobe.id'), nullable=False)
    image_data = db.Column(db.LargeBinary, nullable=True)
    image_mimetype = db.Column(db.String(255), nullable=True)

    favorite = db.Column(
        db.Boolean,
        nullable=False,
        default=False,
        server_default=text('false')  # Ensures database-level default
    )

    wardrobe = db.relationship('Wardrobe', back_populates='trousers')

    # Methods to toggle favorite status
    def mark_as_favorite(self):
        self.favorite = True
        db.session.commit()

    def unmark_as_favorite(self):
        self.favorite = False
        db.session.commit()

# Shoe model
class Shoe(db.Model):
    __tablename__ = 'shoe'
    id = db.Column(db.Integer, primary_key=True)
    wardrobe_id = db.Column(db.Integer, db.ForeignKey('wardrobe.id'), nullable=False)
    image_data = db.Column(db.LargeBinary, nullable=True)
    image_mimetype = db.Column(db.String(255), nullable=True)

    favorite = db.Column(
        db.Boolean,
        nullable=False,
        default=False,
        server_default=text('false')  # Ensures database-level default
    )

    wardrobe = db.relationship('Wardrobe', back_populates='shoes')

    # Methods to toggle favorite status
    def mark_as_favorite(self):
        self.favorite = True
        db.session.commit()

    def unmark_as_favorite(self):
        self.favorite = False
        db.session.commit()
