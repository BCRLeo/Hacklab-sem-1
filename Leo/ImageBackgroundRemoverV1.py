from rembg import remove
from PIL import Image

def remove_background(input_path, output_path):
    try:
        # Open the input image
        with Image.open(input_path) as img:
            # Remove the background
            output = remove(img)
            # Save the output image
            output.save(output_path)
        print(f"Background removed image saved at {output_path}")
    except Exception as e:
        print(f"Error during background removal: {e}")

if __name__ == '__main__':
    input_image_path = "blue-tshirt-laid-flat-teal-background_1082141-46602.jpg"
    output_image_path = "output.png"
    remove_background(input_image_path, output_image_path)
    print("done")

