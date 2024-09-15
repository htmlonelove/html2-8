const swiper = new Swiper(".swiper", {
  spaceBetween: 30,
  slidesPerView: 1,
  breakpoints: {
    455: {
      slidesPerView: 2,
      spaceBetweenSlides: 30
    },
    768: {
      slidesPerView: 4,
      spaceBetweenSlides: 30
    },
    1280: {
      slidesPerView: 6,
      spaceBetweenSlides: 50
    }
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
  },
  mousewheel: true,
  keyboard: true,
});
