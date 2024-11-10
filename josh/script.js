var lazyImages = document.querySelectorAll("img.wardrobe.tops");
var carouselTops = document.querySelectorAll("div#carousel__tops");
console.log(carouselTops[0].children);

let array = Array.from(carouselTops)[0].children;
/* console.log(array.shift()) */

const options = {
    root: document.getElementById("carousel__tops"),
    rootMargin: "0px",
    threshold: 1.0,
};

let lazyImageObserver = new IntersectionObserver(handleLazyImageIntersection, options);

function handleLazyImageIntersection(entries, observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const div = document.createElement("div");
            div.classList.add("card");

            const img = document.createElement("img");
            img.classList.add("wardrobe", "tops", "lazy");
            img.setAttribute("src", "assets/images/DIANA.webp");

            div.appendChild(img);
            carouselTops[0].appendChild(div);
            lazyImageObserver.unobserve(entry.target);
            
            console.log(array);
            array[0].remove();
            array = Array.from(carouselTops)[0].children;
            carouselTops[0].scroll(0, -1 * array[0].getBoundingClientRect().width);
            console.log(array[0].offsetWidth);

            console.log(entry.target);
            lazyImageObserver.observe(array[array.length - 2]);
            // the problem is that when the first element is removed, it affects the scroll position 
            // of the entire carousel which keeps the observed element on screen

            /* 
            
            lazyImageObserver.unobserve(entry);
            entry.setAttribute("--observed", "false");
            lazyImageObserver.observe(carouselTops[carouselTops.length - 5]);
            carouselTops[carouselTops.length - 5].setAttribute("--observed", "true"); */
        }
    });
}



lazyImageObserver.observe(array[array.length - 2]);




/* console.log(lazyImages)
console.log(lazyImages[lazyImages.length - 5]); */
/* lazyImageObserver.observe(lazyImages[lazyImages.length - 5]); // observe 4th last image
carouselTops[carouselTops.length - 5].setAttribute("--observed", "true"); */

/* lazyImages.forEach(function(lazyImage) {
	lazyImageObserver.observe(lazyImage);
}); */

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