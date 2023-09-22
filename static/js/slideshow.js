var slideIndex = 0;


window.addEventListener('load', async function () {
    showSlides(slideIndex);
})

function plusSlides(n){
    showSlides(slideIndex += n);
}

function currentSlide(n){
    showSlides(slideIndex = n);
}

function showSlides(n){
    var slides = document.getElementsByClassName("projectSlide");
    console.log(slides);
    slides[n].style.display = "block";
}


function showNextSlide(){
    var current = slideIndex;
    var slides = document.getElementsByClassName("projectSlide");
    slideIndex += 1;
    if(slideIndex > slides.length-1){
        slideIndex = 0;
    }
    slides[current].style.display = "none";
    slides[slideIndex].style.display = "block";
}

function showPrevSlide(){
    var current = slideIndex;
    var slides = document.getElementsByClassName("projectSlide");
    slideIndex -= 1;
    if(slideIndex < 0){
        slideIndex = slides.length-1;
    }
    slides[current].style.display = "none";
    slides[slideIndex].style.display = "block";
}
