/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

function changeImage() {
    var image = document.getElementById("top-1");
	image.src = "images/levis.png"
}

function scrollTest() {
	if (document.getElementById("carousel-tops").scrollLeft > 100)
  	{
	  	var image = document.getElementById("top-4");
		if (image.src != "images/levis.png")
		{
			image.src = "images/levis.png";
			console.log("hi");
		}
	}
}