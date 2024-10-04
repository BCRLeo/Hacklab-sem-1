
function printMessage() {
    document.getElementById('output').innerHTML = 'Happy Wednesday!';
    console.log("hello world")
  }


function Upload(){
    
document.addEventListener('DOMContentLoaded', () => {
    console.log("here1")
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');

    uploadButton.addEventListener('click', () => {
        fileInput.click(); // Programmatically click the hidden file input
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            // Display the selected image
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image" style="max-width: 300px;">`;
            };
            reader.readAsDataURL(file);
        }
    });
});}
