from your_app import db
from your_app.models import User, Wardrobe, Shirt
from sqlalchemy_imageattach.context import store_context
from sqlalchemy_imageattach.stores.fs import FileSystemStore

# Configure the image store (Adjust the path according to your setup)
store = FileSystemStore(path='/path/to/your/image/store')

# Create a new user
new_user = User(
    email='user@example.com',
    password='hashed_password',  # Ensure the password is hashed
    UserName='username'
)

# Create a new wardrobe and associate it with the user
new_wardrobe = Wardrobe(user=new_user)

# Create a new shirt image and associate it with the wardrobe
new_shirt = Shirt(wardrobe=new_wardrobe)

# Add the user, wardrobe, and shirt to the session
db.session.add(new_user)
db.session.add(new_wardrobe)
db.session.add(new_shirt)

# Commit the session to assign IDs
db.session.commit()

# Attach an image to the shirt
from sqlalchemy_imageattach.context import store_context

# Make sure you have an image file at the specified path
image_path = '/path/to/your/shirt_image.jpg'

with store_context(store):
    with open(image_path, 'rb') as f:
        new_shirt.image.from_file(f)

# Commit again to save the image attachment
db.session.commit()
