// Slider
var swiper = new Swiper(".swiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  initialSlide: 5,
  speed: 600,
  preventClicks: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 0,
    stretch: 80,
    depth: 500,
    modifier: 1,
    slideShadows: true
  },
  on: {
    click(event){
      swiper.slideTo(this.clickedIndex);
    }
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});

//Menu mobile
const btnMobileBars = document.querySelector("#btnMobileBars");
const menuOffCanvasClose = document.querySelector("#menuOffCanvas-close");

btnMobileBars.addEventListener("click", e => {
  e.preventDefault();
  document.querySelector("#menuOffCanvas").classList.toggle("menuOffCanvas-hidden");
})

menuOffCanvasClose.addEventListener("click", e => {
  e.preventDefault();
  document.querySelector("#menuOffCanvas").classList.toggle("menuOffCanvas-hidden");
})