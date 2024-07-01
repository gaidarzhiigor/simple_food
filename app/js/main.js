$(function () {
  
  $(window).scroll(function () {
    if ($(this).scrollTop() > 1) {
      $(".header").addClass("sticky");
    } else {
      $(".header").removeClass("sticky");
    }
  });

  $('.reviews-slider').slick({
    nextArrow: '<button type="button" class="slick-btn slick-next"><img src="images/slick-next.svg"></button>',
    prevArrow: '<button type="button" class="slick-btn slick-back"><img src="images/slick-back.svg"></button>',
    dots: true
  });
  
});

var mixer = mixitup(".popular-items");
