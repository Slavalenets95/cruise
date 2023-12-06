import Swiper from 'swiper/bundle';

class Sliders {
  // Home slider
  homeIntroSliderNode = document.querySelector('.home-intro__slider');
  homeIntroSliderInstance = null;

  // Offers slider
  offersSliderNode = document.querySelector('.offers-slider');
  offersSliderInstance = null;

  // Regions slider
  regionsSlidersNodes = document.querySelectorAll('.regions-slider');
  regionsSlidersInstance = [];

  homeIntroSlider() {
    const homeIntroSlidesVideos = document.querySelectorAll(('.home-intro__video-slide .home-intro__video'));

    if (this.homeIntroSliderNode) {
      this.homeIntroSliderInstance = new Swiper('.home-intro__slider', {
        spaceBetween: 0,
        slidesPerView: 1,
        touchRatio: 0.2,
        pagination: {
          el: '.home-intro .swiper-nav__dots',
          type: 'bullets',
          clickable: true,
        },
        breakpoints: {
          993: {
            navigation: {
              nextEl: `.home-intro .swiper-nav__btn.next`,
              prevEl: `.home-intro .swiper-nav__btn.prev`,
            },
          }
        },
        autoplay: {
          delay: 3000,
          pauseOnMouseEnter: true,
        },
      })
    }
  }
  offersSlider() {
    if (this.offersSliderNode) {
      this.offersSliderInstance = new Swiper('.offers-slider', {
        spaceBetween: 24,
        slidesPerView: 1,
        touchRatio: 0.2,
        navigation: {
          nextEl: `.offers-slider .swiper-nav__btn.next`,
          prevEl: `.offers-slider .swiper-nav__btn.prev`,
        },
        pagination: {
          el: '.offers-slider .swiper-nav__dots',
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
  }
  regionsSlider() {
    if (this.regionsSlidersNodes.length) {
      this.regionsSlidersNodes.forEach((slider, idx) => {
        slider.classList.add(`slider-${idx + 1}`);

        this.regionsSlidersInstance.push(new Swiper(`.regions-slider.slider-${idx + 1} .swiper`, {
          spaceBetween: 12,
          slidesPerView: 'auto',
          touchRatio: 0.2,
          pagination: {
            el: `.regions-slider.slider-${idx + 1} .swiper-nav__dots`,
            type: 'bullets',
            clickable: true,
          },
          navigation: {
            nextEl: `.regions-slider.slider-${idx + 1} .swiper-nav__btn.next`,
            prevEl: `.regions-slider.slider-${idx + 1} .swiper-nav__btn.prev`,
          },
          scrollbar: {
            el: `.regions-slider.slider-${idx + 1} .regions-slider__scrollbar`,
            draggable: true,
          },
          breakpoints: {
            600: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
            // when window width is >= 769px
            769: {
              slidesPerView: 2,
            },
            // when window width is >= 1201px
            1201: {
              slidesPerView: 3,
            },
            // when window width is >= 1651px
            1651: {
              slidesPerView: 4,
            },
          },
        }))
      })
    }
  }
  restarauntSliders() {
    // Specialty
    const specialtyParent = document.querySelector('.restaraunt-specialty');
    const specialtySlider = document.querySelector('.restaraunt-specialty__swiper');
    if(specialtySlider && specialtyParent) {
      new Swiper('.restaraunt-specialty__swiper', {
        spaceBetween: 10,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        a11y: false,
        slidesPerGroup: 1,
        pagination: {
          el: specialtyParent.querySelector('.swiper-nav__dots'),
          type: 'bullets',
          clickable: true,
        },
        navigation: {
          nextEl: specialtyParent.querySelector('.swiper-nav__btn.next'),
          prevEl: specialtyParent.querySelector('.swiper-nav__btn.prev'),
        },
        breakpoints: {
          // when window width is >= 769px
          769: {
            slidesPerGroup: 2,
          },
          // when window width is >= 1201px
          1400: {
            slidesPerGroup: 3,
          },  
        },
      })
    }

    // Bards
    const barsParent = document.querySelector('.restaraunt-bars');
    const barsSlider = document.querySelector('.restaraunt-bars__swiper');
    if(barsSlider && barsParent) {
      new Swiper('.restaraunt-bars__swiper', {
        spaceBetween: 10,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        a11y: false,
        slidesPerGroup: 1,
        pagination: {
          el: barsParent.querySelector('.swiper-nav__dots'),
          type: 'bullets',
          clickable: true,
        },
        navigation: {
          nextEl: barsParent.querySelector('.swiper-nav__btn.next'),
          prevEl: barsParent.querySelector('.swiper-nav__btn.prev'),
        },
        breakpoints: {
          // when window width is >= 769px
          769: {
            slidesPerGroup: 2,
          },
          // when window width is >= 1201px
          1400: {
            slidesPerGroup: 3,
          },  
        },
      })
    }

    // Kids
    const kidsSlider = document.querySelector('.restaraunt-kids__slider');
    if(kidsSlider) {
      new Swiper('.restaraunt-kids__slider', {
        spaceBetween: 10,
        slidesPerView: 1,
        touchRatio: 0.2,
        pagination: {
          el: document.querySelector('.restaraunt-kids .swiper-nav__dots'),
          type: 'bullets',
          clickable: true,
        },
        navigation: {
          nextEl: document.querySelector('.restaraunt-kids .swiper-nav__btn.next'),
          prevEl: document.querySelector('.restaraunt-kids .swiper-nav__btn.prev'),
        },
      })
    }
  }

  reInit() {
    if(this.homeIntroSliderInstance) this.homeIntroSliderInstance.update();

    if(this.offersSliderInstance) this.offersSliderInstance.update();

    if(this.regionsSlidersInstance.length) {
      this.regionsSlidersInstance.forEach(slider => slider.update());
    }
  }
  make() {
    this.homeIntroSlider();
    this.offersSlider();
    this.regionsSlider();
    this.restarauntSliders();

    /***** GALLERY SLIDER *****/
    // const gallerySliders = document.querySelectorAll('.gallery');
    //
    // function addGallerySwiperClasses(gallerySliders) {
    //   if (!gallerySliders && !gallerySliders.length) return;
    //
    //   gallerySliders.forEach((gallerySlider, idx) => {
    //     gallerySlider.classList.add('swiper-' + idx);
    //   })
    // }
    //
    // function initializeGallerySliders(gallerySliders) {
    //   if (!gallerySliders && !gallerySliders.length) return;
    //
    //
    //   gallerySliders.forEach(gallerySlider => {
    //     gallerySlider.querySelectorAll('.swiper-initialized').forEach(swiperDOM => {
    //       swiperDOM.swiper.destroy();
    //     })
    //   })
    //
    //   gallerySliders.forEach((gallerySlider, idx) => {
    //     let activeSlideWidth = null;
    //     let nearActiveSlideWidth = null;
    //     let slideWidth = null;
    //     let correctionTranslate = null;
    //     const slideCount = gallerySlider.querySelectorAll('.thumb-slide').length;
    //     const scrollbarDrag = gallerySlider.querySelector('.scrollbar-drag');
    //     const scrollbarWrapper = gallerySlider.querySelector('.gallery-scrollbar');
    //     let thumb = null;
    //     let slider = null;
    //
    //     /***** THUMB SLIDER *****/
    //     if (!isMobile) {
    //       thumb = new Swiper(`.gallery.swiper-${idx} .thumb-slider .swiper`, {
    //         spaceBetween: 18,
    //         centeredSlides: true,
    //         slidesPerView: 'auto',
    //         touchRatio: 0.2,
    //         slideToClickedSlide: true,
    //         loop: true,
    //         loopedSlides: 3,
    //         on: {
    //           slideChangeTransitionStart: swiper => {
    //             if (swiper.previousIndex !== 0 && correctionTranslate === null) {
    //               if (window.screen.availWidth <= 992) {
    //                 correctionTranslate = (activeSlideWidth - slideWidth) - swiper.params.spaceBetween;
    //               } else {
    //                 correctionTranslate = (activeSlideWidth - nearActiveSlideWidth) + swiper.params.spaceBetween / 2;
    //               }
    //             }
    //
    //             if (swiper.activeIndex !== swiper.params.loopedSlides) {
    //               swiper.setTranslate(swiper.translate + Math.abs(correctionTranslate));
    //             }
    //           },
    //           slideChange: swiper => {
    //             slider?.slideTo(swiper.activeIndex)
    //             scrollbarMove(swiper, scrollbarWrapper, slideCount, scrollbarDrag);
    //           }
    //         },
    //         breakpoints: {
    //           // when window width is >= 993px
    //           993: {
    //             loopedSlides: 5,
    //           },
    //           // when window width is >= 1400px
    //           1400: {
    //             loopedSlides: 7,
    //           },
    //         }
    //       })
    //     }
    //     /***** END THUMB SLIDER *****/
    //
    //     /***** MAIN SLIDER *****/
    //     slider = new Swiper(`.gallery.swiper-${idx} .gallery-slider .swiper`, {
    //       spaceBetween: 18,
    //       loop: true,
    //       navigation: {
    //         nextEl: `.gallery.swiper-${idx} .gallery-next`,
    //         prevEl: `.gallery.swiper-${idx} .gallery-prev`,
    //       },
    //       on: {
    //         slideChange: (swiper) => {
    //           if (!isMobile) {
    //             thumb.slideTo(swiper.activeIndex);
    //           }
    //           scrollbarMove(swiper, scrollbarWrapper, slideCount, scrollbarDrag);
    //         },
    //         slideChangeTransitionEnd: function () {
    //           if (!activeSlideWidth && !nearActiveSlideWidth && !slideWidth && !isMobile) {
    //             activeSlideWidth = thumb.el.querySelector('.swiper-slide-active').offsetWidth;
    //             nearActiveSlideWidth = thumb.el.querySelector('.swiper-slide-prev').offsetWidth;
    //             slideWidth = thumb.el.querySelector('.thumb-slide:not(.swiper-slide-active):not(.swiper-slide-prev):not(.swiper-slide-next)').offsetWidth;
    //           }
    //         },
    //         afterInit: () => {
    //           const scrollBarWidth = scrollbarWrapper.offsetWidth / slideCount;
    //           scrollbarDrag.style.width = `${scrollBarWidth}px`
    //         }
    //       },
    //       breakpoints: {
    //         // when window width is >= 600px
    //         600: {
    //           thumbs: {
    //             swiper: thumb
    //           },
    //         },
    //         // when window width is >= 768px
    //         768: {
    //           loopedSlides: 3,
    //         },
    //         // when window width is >= 993px
    //         993: {
    //           loopedSlides: 5,
    //         },
    //         // when window width is >= 1400px
    //         1400: {
    //           loopedSlides: 7,
    //         },
    //       }
    //     })
    //     /***** END MAIN SLIDER *****/
    //   })
    // }
    //
    // function scrollbarMove(swiper, scrollbarWrapper, slideCount, scrollbarDrag) {
    //   const translateValue = swiper.realIndex * (scrollbarWrapper.offsetWidth / slideCount);
    //   scrollbarDrag.style.transform = `translateX(${translateValue}px)`;
    // }
    //
    // addGallerySwiperClasses(gallerySliders);
    // initializeGallerySliders(gallerySliders);
    /***** END GALLERY SLIDER  *****/

    /***** FEEDBACKS *****/
    // let feedbacksSlider = document.querySelector('.feedbacks-slider');
    //
    // if (feedbacksSlider) {
    //   feedbacksSlider = new Swiper('.feedbacks-slider', {
    //     spaceBetween: 27,
    //     slidesPerView: 1,
    //     touchRatio: 0.2,
    //     navigation: {
    //       nextEl: `.feedbacks-slider__next-btn`,
    //       prevEl: `.feedbacks-slider__prev-btn`,
    //     },
    //     pagination: {
    //       el: '.feedbacks-slider__dots-wrapper',
    //       type: 'bullets',
    //       clickable: true,
    //     },
    //     breakpoints: {
    //       // when window width is >= 993px
    //       993: {
    //         slidesPerView: 2,
    //       },
    //       // when window width is >= 1400px
    //       1400: {
    //         slidesPerView: 3,
    //       },
    //     },
    //   })
    // }
    /***** END FEEDBACKS *****/
  }
}

export default new Sliders();