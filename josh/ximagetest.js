// File input change event
$('input#fileContainer').on('change', function () {
    console.log(this);

    var reader = new FileReader();
    reader.onload = function (e) {
        console.log(reader.result + '->' + typeof reader.result);
        var thisImage = reader.result;
        localStorage.setItem("imgData", thisImage);  // Store image in localStorage
    };
    reader.readAsDataURL(this.files[0]);  // Read the file and convert it to Base64 string
});

// Show button click event
$('input#show').click(function () {
    var dataImage = localStorage.getItem('imgData');  // Get the stored image from localStorage
    console.log(dataImage);
    
    // Create an img element and set its src to the stored image data
    var imgCtr = $('<img/>').prop('src', dataImage);
    
    // Append the image to the div container
    $('div#imgContainer').append(imgCtr);
});