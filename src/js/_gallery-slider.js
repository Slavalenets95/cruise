import Swiper from 'swiper/bundle';

class GallerySlider {
  isRtl = document.querySelector('html').getAttribute('dir');
  gallerySliders = document.querySelectorAll('.gallery');

  addGallerySwiperClasses(gallerySliders) {
    if (!gallerySliders && !gallerySliders.length) return;

    gallerySliders.forEach((gallerySlider, idx) => {
      gallerySlider.classList.add('swiper-' + idx);
    })
  }

  initializeGallerySliders(gallerySliders) {
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
      if (!(window.screen.availWidth <= 600)) {
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
                if (this.isRtl) {
                  swiper.setTranslate(-(swiper.translate - Math.abs(correctionTranslate)));
                } else {
                  swiper.setTranslate(swiper.translate + Math.abs(correctionTranslate));
                }
              }
            },
            slideChange: swiper => {
              slider?.slideTo(swiper.activeIndex)
              this.scrollbarMove(swiper, scrollbarWrapper, slideCount, scrollbarDrag);
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
            if (!(window.screen.availWidth <= 600)) {
              thumb.slideTo(swiper.activeIndex);
            }
            this.scrollbarMove(swiper, scrollbarWrapper, slideCount, scrollbarDrag);
          },
          slideChangeTransitionEnd: function () {
            if (!activeSlideWidth && !nearActiveSlideWidth && !slideWidth && !(window.screen.availWidth <= 600)) {
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

  scrollbarMove(swiper, scrollbarWrapper, slideCount, scrollbarDrag) {
    const translateValue = swiper.realIndex * (scrollbarWrapper.offsetWidth / slideCount);
    if (this.isRtl) {
      scrollbarDrag.style.transform = `translateX(-${translateValue}px)`;
    } else {
      scrollbarDrag.style.transform = `translateX(${translateValue}px)`;
    }
  }

  init() {
    this.addGallerySwiperClasses(this.gallerySliders);
    this.initializeGallerySliders(this.gallerySliders);
  }

  reinit() {
    this.initializeGallerySliders(this.gallerySliders);
  }
}

export default new GallerySlider();