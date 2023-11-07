import Swiper from 'swiper/bundle';

class Sliders {
  make() {
    let isMobile = window.screen.availWidth <= 600;

    /***** GALLERY SLIDER *****/
    const gallerySliders = document.querySelectorAll('.gallery');

    function addGallerySwiperClasses(gallerySliders) {
      if (!gallerySliders && !gallerySliders.length) return;

      gallerySliders.forEach((gallerySlider, idx) => {
        gallerySlider.classList.add('swiper-' + idx);
      })
    }

    function initializeGallerySliders(gallerySliders) {
      if (!gallerySliders && !gallerySliders.length) return;


      gallerySliders.forEach(gallerySlider => {
        gallerySlider.querySelectorAll('.swiper-initialized').forEach(swiperDOM => {
          swiperDOM.swiper.destroy();
        })
      })

      gallerySliders.forEach((gallerySlider, idx) => {
        let activeSlideWidth = null;
        let nearActiveSlideWidth = null;
        let slideWidth = null;
        let correctionTranslate = null;
        const slideCount = gallerySlider.querySelectorAll('.thumb-slide').length;
        const scrollbarDrag = gallerySlider.querySelector('.scrollbar-drag');
        const scrollbarWrapper = gallerySlider.querySelector('.gallery-scrollbar');
        let thumb = null;
        let slider = null;

        /***** THUMB SLIDER *****/
        if (!isMobile) {
          thumb = new Swiper(`.gallery.swiper-${idx} .thumb-slider .swiper`, {
            spaceBetween: 18,
            centeredSlides: true,
            slidesPerView: 'auto',
            touchRatio: 0.2,
            slideToClickedSlide: true,
            loop: true,
            loopedSlides: 3,
            on: {
              slideChangeTransitionStart: swiper => {
                if (swiper.previousIndex !== 0 && correctionTranslate === null) {
                  if (window.screen.availWidth <= 992) {
                    correctionTranslate = (activeSlideWidth - slideWidth) - swiper.params.spaceBetween;
                  } else {
                    correctionTranslate = (activeSlideWidth - nearActiveSlideWidth) + swiper.params.spaceBetween / 2;
                  }
                }

                if (swiper.activeIndex !== swiper.params.loopedSlides) {
                  swiper.setTranslate(swiper.translate + Math.abs(correctionTranslate));
                }
              },
              slideChange: swiper => {
                slider?.slideTo(swiper.activeIndex)
                scrollbarMove(swiper, scrollbarWrapper, slideCount, scrollbarDrag);
              }
            },
            breakpoints: {
              // when window width is >= 993px
              993: {
                loopedSlides: 5,
              },
              // when window width is >= 1400px
              1400: {
                loopedSlides: 7,
              },
            }
          })
        }
        /***** END THUMB SLIDER *****/

        /***** MAIN SLIDER *****/
        slider = new Swiper(`.gallery.swiper-${idx} .gallery-slider .swiper`, {
          spaceBetween: 18,
          loop: true,
          navigation: {
            nextEl: `.gallery.swiper-${idx} .gallery-next`,
            prevEl: `.gallery.swiper-${idx} .gallery-prev`,
          },
          on: {
            slideChange: (swiper) => {
              if (!isMobile) {
                thumb.slideTo(swiper.activeIndex);
              }
              scrollbarMove(swiper, scrollbarWrapper, slideCount, scrollbarDrag);
            },
            slideChangeTransitionEnd: function () {
              if (!activeSlideWidth && !nearActiveSlideWidth && !slideWidth && !isMobile) {
                activeSlideWidth = thumb.el.querySelector('.swiper-slide-active').offsetWidth;
                nearActiveSlideWidth = thumb.el.querySelector('.swiper-slide-prev').offsetWidth;
                slideWidth = thumb.el.querySelector('.thumb-slide:not(.swiper-slide-active):not(.swiper-slide-prev):not(.swiper-slide-next)').offsetWidth;
              }
            },
            afterInit: () => {
              const scrollBarWidth = scrollbarWrapper.offsetWidth / slideCount;
              scrollbarDrag.style.width = `${scrollBarWidth}px`
            }
          },
          breakpoints: {
            // when window width is >= 600px
            600: {
              thumbs: {
                swiper: thumb
              },
            },
            // when window width is >= 768px
            768: {
              loopedSlides: 3,
            },
            // when window width is >= 993px
            993: {
              loopedSlides: 5,
            },
            // when window width is >= 1400px
            1400: {
              loopedSlides: 7,
            },
          }
        })
        /***** END MAIN SLIDER *****/
      })
    }

    function scrollbarMove(swiper, scrollbarWrapper, slideCount, scrollbarDrag) {
      const translateValue = swiper.realIndex * (scrollbarWrapper.offsetWidth / slideCount);
      scrollbarDrag.style.transform = `translateX(${translateValue}px)`;
    }

    addGallerySwiperClasses(gallerySliders);
    initializeGallerySliders(gallerySliders);
    /***** END GALLERY SLIDER  *****/

    /***** FEEDBACKS *****/
    let feedbacksSlider = document.querySelector('.feedbacks-slider');

    if (feedbacksSlider) {
      feedbacksSlider = new Swiper('.feedbacks-slider', {
        spaceBetween: 27,
        slidesPerView: 1,
        touchRatio: 0.2,
        navigation: {
          nextEl: `.feedbacks-slider__next-btn`,
          prevEl: `.feedbacks-slider__prev-btn`,
        },
        pagination: {
          el: '.feedbacks-slider__dots-wrapper',
          type: 'bullets',
          clickable: true,
        },
        breakpoints: {
          // when window width is >= 993px
          993: {
            slidesPerView: 2,
          },
          // when window width is >= 1400px
          1400: {
            slidesPerView: 3,
          },
        },
      })
    }
    /***** END FEEDBACKS *****/

    /***** OFFERS SLIDER *****/
    let offersSlider = document.querySelector('.offers-slider');

    if (offersSlider) {
      offersSlider = new Swiper('.offers-slider', {
        spaceBetween: 24,
        slidesPerView: 1,
        touchRatio: 0.2,
        navigation: {
          nextEl: `.offers-slider__next-btn`,
          prevEl: `.offers-slider__prev-btn`,
        },
        pagination: {
          el: '.offers-slider__dots-wrapper',
          type: 'bullets',
          clickable: true,
        },
        breakpoints: {
          // when window width is >= 993px
          993: {
            slidesPerView: 2,
          },
          // when window width is >= 1400px
          1400: {
            slidesPerView: 3,
          },
        },
      })
    }
    /***** END OFFERS SLIDER *****/

    /***** HOME INTRO SLIDER *****/
    let homeIntroSlider = document.querySelector('.home-intro__slider');
    const homeIntroSlidesVideos = document.querySelectorAll(('.home-intro__video-slide .home-intro__video'));

    if (homeIntroSlider) {
      homeIntroSlider = new Swiper('.home-intro__slider', {
        spaceBetween: 0,
        slidesPerView: 1,
        touchRatio: 0.2,
        pagination: {
          el: '.home-intro__dots-wrapper',
          type: 'bullets',
          clickable: true,
        },
        breakpoints: {
          993: {
            navigation: {
              nextEl: `.home-intro__next-btn`,
              prevEl: `.home-intro__prev-btn`,
            },
          }
        },
        autoplay: {
          delay: 3000,
          pauseOnMouseEnter: true,
        },
      })
    }
    /***** END HOME INTRO SLIDER *****/
  }
}

export default new Sliders();