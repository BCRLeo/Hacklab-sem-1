from flask import Flask, render_template, request, url_for, redirect, flash
import os
from werkzeug.utils import secure_filename
app = Flask(__name__)
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/wardrobe")
def wardrobe():
    return render_template("wardrobe.html")


app.config['UPLOAD_FOLDER'] = 'uploads'  # Folder to save uploaded files
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
            return redirect(url_for('wardrobe'))  # Redirect to wardrobe page
    return render_template('upload.html')

if __name__ == "__main__":
    app.run(debug = True, port="5001")