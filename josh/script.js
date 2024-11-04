var lazyImages = document.querySelectorAll("img.wardrobe.tops");


const options = {
    root: document.getElementById("carousel__tops"),
    rootMargin: "0px",
    threshold: 1.0,
};

let lazyImageObserver = new IntersectionObserver(handleIntersection, options);

function handleIntersection(entries, observer) {
    entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.2) {
			entry.target.src = "assets/images/DIANA.webp"
            console.log("VISIBLE");
        }
    });
}

console.log(lazyImages)

lazyImages.forEach(function(lazyImage) {
	lazyImageObserver.observe(lazyImage);
});

/* let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            let lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove("lazy");
            lazyImageObserver.unobserve(lazyImage);
        }
    });
});

lazyImages.forEach(function(lazyImage) {
    lazyImageObserver.observe(lazyImage);
});
 */




/* const options = {
    root: document.getElementById("heading__profession-list"),
    rootMargin: "0px",
    threshold: 1.0,
}; */

//const observer = new IntersectionObserver(handleIntersection, options);



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