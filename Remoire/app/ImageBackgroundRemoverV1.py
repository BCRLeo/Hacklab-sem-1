from rembg import remove
from PIL import Image
import io

def remove_background_path(input_path, output_path):
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




def remove_background_file(img):
    try:
        output = remove(img, force_return_bytes=True)
        # Ensure the image is in RGBA mode (to have an alpha channel)
        #output = output.convert("RGBA")
        output = Image.open(io.BytesIO(output)).convert("RGBA")
        # Get the alpha channel
        alpha = output.split()[-1]

        bbox = alpha.getbbox()
        if bbox:
            cropped_output = output.crop(bbox)
        else:
            cropped_output = output
        img_io = io.BytesIO()
        cropped_output.save(img_io, format='PNG')  # Use PNG to preserve transparency
        img_io.seek(0)

        # Step 7: Return the processed image bytes
        processed_bytes = img_io.getvalue()
        return processed_bytes
        
    except Exception as e:
        print(f"Error during background removal: {e}")




if __name__ == '__main__':
    input_image_path = "blue-tshirt-laid-flat-teal-background_1082141-46602.jpg"
    output_image_path = "output.png"
    remove_background_path(input_image_path, output_image_path)
    print("done")

