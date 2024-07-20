$(function () {
  // scroll header sticky
  $(window).on('load', function () {
    if (localStorage.getItem('isSticky') === 'true') {
      $(".header__top").addClass("sticky");
    } else {
      $(".header__top").removeClass("sticky");
    }
  });
  
  $(window).scroll(function () {
    if ($(this).scrollTop() > 1) {
      $(".header__top").addClass("sticky");
      localStorage.setItem('isSticky', 'true');
    } else {
      $(".header__top").removeClass("sticky");
      localStorage.setItem('isSticky', 'false');
    }
  });

  // slider
  $(window).on("load resize", function () {
    if ($(window).width() < 576) {
      $(".restaurants__items:not(.slick-initialized)").slick({
        arrows: false,
        dots: true,
        infinite: true,
        speed: 100,
        slidesToShow: 1,
      });
    } else {
      $(".restaurants__items.slick-initialized").slick("unslick");
    }
  });

  // slider
  $(".reviews-slider").slick({
    nextArrow:
      '<button type="button" class="reviews-slider__btn reviews-slider__btn--next"><svg class="reviews-slider__arrow"><use xlink:href="images/sprite.svg#slick-back"></use></svg>',
    prevArrow:
      '<button type="button" class="reviews-slider__btn reviews-slider__btn--back"><svg class="reviews-slider__arrow"><use xlink:href="images/sprite.svg#slick-next"></use></svg>',
    dots: true,
    infinite: false,

    responsive: [
      {
        breakpoint: 992,
        settings: {
          dots: false,
        },
      },
    ],
  });
});

//Mobile Menu
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".menu__btn");
  const mobileMenu = document.querySelector(".mobile");
  const bodyLock = document.querySelector("body");
  const burgerClose = document.querySelector(".mobile__btn");

  burger.addEventListener("click", () => {
    mobileMenu.classList.add("active");
    burgerClose.classList.add("active");
    if (mobileMenu.classList.contains("active")) {
      setTimeout(() => {
        bodyLock.classList.add("lock");
      }, 100);
    }
  });

  burgerClose.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    bodyLock.classList.remove("lock");
  });

  document.addEventListener("click", function (e) {
    if (e.target !== burger && e.target !== mobileMenu && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove("active");
      bodyLock.classList.remove("lock");
    }
  });

  mobileMenu.addEventListener("click", function (e) {
    e.stopPropagation();
  });
});

//Mobile Menu
document.addEventListener("DOMContentLoaded", () => {
  const productsBtn = document.querySelector(".catalog-products__btn");
  const filterMenu = document.querySelector(".catalog-products__filter");
  const bodyLock = document.querySelector("body");
  const burgerClose = document.querySelector(".catalog-products__filter-btn");

  productsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    filterMenu.classList.add("active");
    burgerClose.classList.add("active");
    if (filterMenu.classList.contains("active")) {
      setTimeout(() => {
        bodyLock.classList.add("overlock");
      }, 100);
    }
  });

  burgerClose.addEventListener("click", (e) => {
    e.stopPropagation();
    filterMenu.classList.remove("active");
    bodyLock.classList.remove("overlock");
  });

  document.addEventListener("click", function (e) {
    if (e.target !== productsBtn && e.target !== filterMenu && !filterMenu.contains(e.target)) {
      filterMenu.classList.remove("active");
      bodyLock.classList.remove("overlock");
    }
  });

  filterMenu.addEventListener("click", function (e) {
    e.stopPropagation();
  });
});

// side price menu
var $range = $(".catalog-products__price-slider"),
  $inputFrom = $(".catalog-products__price-from"),
  $inputTo = $(".catalog-products__price-to"),
  instance,
  min = 0,
  max = 1200,
  from = 0,
  to = 0;

$range.ionRangeSlider({
  skin: "round",
  type: "double",
  min: min,
  max: max,
  from: 100,
  to: 1000,
  onStart: updateInputs,
  onChange: updateInputs,
});
instance = $range.data("ionRangeSlider");

function updateInputs(data) {
  from = data.from;
  to = data.to;

  $inputFrom.prop("value", from);
  $inputTo.prop("value", to);
}

$inputFrom.on("input", function () {
  var val = $(this).prop("value");

  // validate
  if (val < min) {
    val = min;
  } else if (val > to) {
    val = to;
  }

  instance.update({
    from: val,
  });
});

$inputTo.on("input", function () {
  var val = $(this).prop("value");

  // validate
  if (val < from) {
    val = from;
  } else if (val > max) {
    val = max;
  }

  instance.update({
    to: val,
  });
});

  
$(".catalog-products__pick-select").styler();

// slider
$(window).on("load resize", function () {
  if ($(window).width() < 576) {
    $(".promo__items:not(.slick-initialized)").slick({
      arrows: false,
      dots: true,
      infinite: true,
      speed: 100,
      slidesToShow: 1,
    });
  } else {
    $(".promo__items.slick-initialized").slick("unslick");
  }
});

// counter
const value = document.querySelector('.product-info__counter-value');
const counterBtn = document.querySelectorAll('.product-info__counter-btn');
let counter = 1; 

counterBtn.forEach((el, index) => {
  el.addEventListener('click', () => {
    if (index === 0 && counter > 1) {
      counter = counter - 1;
    } else
    if (index === 1) {
      counter = counter +1;
    }
    value.textContent = counter;
  });
});

// tabs
$('.tabs__item').on('click', function(e){
  e.preventDefault();
  $('.tabs__item').removeClass('tabs__item--active');
  $(this).addClass('tabs__item--active');

  $('.tabs__content-item').removeClass('tabs__content-item--active');
  $($(this).attr('href')).addClass('tabs__content-item--active');
});


// star rating
const ratings = document.querySelectorAll('.rating');

if (ratings.length > 0) {
  initRatings();
}

// main function
function initRatings() {
  let ratingActive, ratingValue;
  for (let index = 0; index < ratings.length; index++) {
    const rating = ratings[index];
    initRating(rating);
  }

  // initialize specific rating
  function initRating(rating) {
    initRatingVars(rating);

    setRatingActiveWidth();

    if (rating.classList.contains('rating-set')) {
      setRating(rating);
    }
  }

  // initialize vars
  function initRatingVars(rating) {
    ratingActive = rating.querySelector('.rating__active');
    ratingValue = rating.querySelector('.rating__value');
  }

  // initialize active stars
  function setRatingActiveWidth(index = ratingValue.innerHTML) {
    const ratingActiveWidth = index / 0.05;
    ratingActive.style.width = `${ratingActiveWidth}%`;
  }

  // can set rating
  function setRating(rating) {
    const ratingItems = rating.querySelectorAll('.rating__item');
    for (let index = 0; index < ratingItems.length; index++) {
      const ratingItem = ratingItems[index];
      ratingItem.addEventListener("mouseenter", function(e) {
        // renew vars
        initRatingVars(rating);
        // renew active stars
        setRatingActiveWidth(ratingItem.value);
      });

      ratingItem.addEventListener("mouseleave", function(e) {
        // renew active stars
        setRatingActiveWidth();
      });

      ratingItem.addEventListener("click", function(e) {
        /// renew vars
        initRatingVars(rating);

        if (rating.dataset.ajax) {
          // send to server
          setRatingValue(ratingItem.value, rating);
        } else {
          // show set rating
          ratingValue.innerHTML = index + 1;
          setRatingActiveWidth();
        }
        });
    }
  }
}

$(".offers__items").slick({
  nextArrow:
    '<button type="button" class="offers__btn offers__btn--next"><svg class="reviews-slider__arrow"><use xlink:href="images/sprite.svg#slick-back"></use></svg>',
  prevArrow:
    '<button type="button" class="offers__btn offers__btn--back"><svg class="reviews-slider__arrow"><use xlink:href="images/sprite.svg#slick-next"></use></svg>',
  dots: false,
  infinite: false,
  slidesToShow: 5,
  slidesToScroll: 2,

  responsive: [
    {
      breakpoint: 1100,
      settings: {
        slidesToShow: 4
      },
    },
    {
      breakpoint: 769,
      settings: {
        slidesToShow: 3
      },
    },
    {
      breakpoint: 578,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 5,
        arrows: false,
        dots: true
      },
    },
  ],
});


function initializeSlick() {
  $(".product__slider-items").slick({
    nextArrow: '<button type="button" class="product__slider-btn product__slider-btn--next"><svg class="product__slider-arrow"><use xlink:href="images/sprite.svg#slick-back"></use></svg></button>',
    prevArrow: '<button type="button" class="product__slider-btn product__slider-btn--back"><svg class="product__slider-arrow"><use xlink:href="images/sprite.svg#slick-next"></use></svg></button>',
    dots: false,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 576,
        settings: "unslick", // Отключаем слайдер для разрешений ниже 576px
      },
      {
        breakpoint: 769,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  });
}

initializeSlick();
$(window).on('resize', function() {
  if ($(window).width() > 576 && !$(".product__slider-items").hasClass('slick-initialized')) {
    initializeSlick();
  }
});

// Инициализация слайдера
let myCarousel;

function initCarousel() {
myCarousel = new Carousel(document.getElementById("myCarousel"), {
  preload: 2,
  Dots: false,
  infinite: false,
});

Fancybox.bind('[data-fancybox="gallery"]', {
  infinite: false,
  Thumbs: false,
  Toolbar: false,
  closeButton: "top",
  Carousel: {
    Dots: true,
    on: {
      change: (that) => {
        if (myCarousel) {
          myCarousel.slideTo(myCarousel.findPageForSlide(that.page), {
            friction: 0,
          });
        }
      },
    },
  },
});
}

// Функция для проверки ширины окна и управления слайдером
function checkWindowSize() {
if (window.innerWidth <= 576) {
  if (myCarousel) {
    myCarousel.destroy();
    myCarousel = null;  
  }
  document.querySelectorAll('.product__image-placeholder').forEach(img => {
    img.style.display = 'block';
  });
  document.getElementById("myCarousel").style.display = 'none';
} else {
  if (!myCarousel) {
    initCarousel();
  }
  document.querySelectorAll('.product__image-placeholder').forEach(img => {
    img.style.display = 'none';
  });
  document.getElementById("myCarousel").style.display = 'block';
}
}

checkWindowSize();

window.addEventListener('resize', checkWindowSize);


// mixitup
var mixer = mixitup(".popular-categories__items");
