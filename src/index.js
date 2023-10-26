import './scss/app.scss';
import Swiper from 'swiper/bundle'

// Throttling Function
const throttle = (func, delay) => {
  let prev = 0;
  return (...args) => {
    let now = new Date().getTime();

    if (now - prev > delay) {
      prev = now;
      return func(...args);
    }
  }
}

window.addEventListener('load', () => {
  let isMobile = window.screen.availWidth <= 600;

  /***** OVERLAY  *****/
  const overlay = document.querySelector('.overlay');
  overlay.addEventListener('click', () => {
    const activeEls = document.querySelectorAll('[data-active]');
    if (activeEls.length) {
      activeEls.forEach((activeEl) => activeEl.removeAttribute('data-active'));
    }
  })
  /***** END OVERLAY *****/

  /***** HEADER  *****/
  const headerNav = document.querySelector('.header-nav');
  const header = document.querySelector('.header');

  if (headerNav && header) {

    /***** MENU *****/
    headerNav.addEventListener('click', evt => {
      if (evt.target.matches('.header-nav__list-control')) {
        const activeEls = headerNav.querySelectorAll('[data-active]');
        const parent = evt.target.closest('.header-nav__list-item');
        const subMenu = parent.querySelector('.header-nav__sub-wrapper');

        activeEls?.forEach(activeEl => {
          if (activeEl !== evt.target && activeEl !== subMenu) activeEl.removeAttribute('data-active');
        });

        evt.target.toggleAttribute('data-active');
        subMenu?.toggleAttribute('data-active');
      }

      if (evt.target.matches('.header-nav__sub-control') && window.screen.availWidth < 1400) {
        const parent = evt.target.closest('.header-nav__sub-wrapper');
        const activeEls = parent.querySelectorAll('[data-active]');
        const subMenu = evt.target.closest('.header-nav__sub-row').querySelector('.header-nav__sub-list');
        const subMenuHeight = subMenu.scrollHeight;

        activeEls?.forEach(activeEl => {
          if (activeEl !== evt.target && activeEl !== subMenu) {
            activeEl.removeAttribute('data-active');
            if (activeEl.matches('.header-nav__sub-list')) {
              activeEl.style.height = '0px';
            }
          }
        });

        if (!subMenu.hasAttribute('data-active')) {
          subMenu.style.height = subMenuHeight + 'px';
        } else {
          subMenu.style.height = '0px';
        }
        evt.target.toggleAttribute('data-active');
        subMenu.toggleAttribute('data-active');
      }

      if (evt.target.matches('.header-nav__sub-back') && window.screen.availWidth < 1400) {
        const parent = evt.target.closest('.header-nav__list-item');
        const activeEls = parent.querySelectorAll('[data-active]');
        const subLists = parent.querySelectorAll('.header-nav__sub-list');

        activeEls.forEach((activeEl) => activeEl.removeAttribute('data-active'));
        subLists.forEach((subList) => subList.style.height = '0');
      }
    })

    headerNav.addEventListener('mouseleave', function () {
      const activeEls = headerNav.querySelectorAll('[data-active]');
      activeEls?.forEach(activeEl => activeEl.removeAttribute('data-active'));
    })
    /***** END MENU *****/

    /***** SEARCH *****/
    const searchBtn = header.querySelector('.header-ui__search-btn');
    const searchContainer = header.querySelector('.search');
    const searchCloseBtn = header.querySelector('.search-close');
    const searchBg = header.querySelector('.search-bg')

    if (searchBtn && searchContainer) {
      searchBtn.addEventListener('click', () => {
        searchBtn.toggleAttribute('data-active');
        searchContainer.toggleAttribute('data-active');
        searchBg.toggleAttribute('data-active')
      })
    }

    if (searchCloseBtn) {
      searchCloseBtn.addEventListener('click', () => {
        searchBtn.removeAttribute('data-active');
        searchContainer.removeAttribute('data-active');
        searchBg.removeAttribute('data-active')
      })
    }
    /***** END SEARCH *****/

    /***** MOBILE MENU *****/
    const mobileMenuControl = document.querySelector('.header-ui__hamb-btn');
    if (mobileMenuControl) {
      mobileMenuControl.addEventListener('click', function () {
        mobileMenuControl.toggleAttribute('data-active');
        headerNav.toggleAttribute('data-active');
        overlay.toggleAttribute('data-active');
        document.querySelector('html').toggleAttribute('data-noscroll');
      })
    }
    /***** END MOBILE MENU *****/
  }
  /***** END HEADER *****/

  /***** FOOTER TOGGLE NAV *****/
  const footer = document.querySelector('.footer');

  if (footer) {
    footer.addEventListener('click', evt => {
      if (evt.target.matches('.footer-nav__item-title') && screen.availWidth <= 1400) {
        const parent = evt.target.closest('.footer-nav__item');
        const subMenu = parent.querySelector('.footer-nav__list');
        const subMenuHeight = subMenu.scrollHeight;

        if (!subMenu.hasAttribute('data-active')) {
          subMenu.style.height = subMenuHeight + 'px';
        } else {
          subMenu.style.height = 0;
        }
        subMenu.toggleAttribute('data-active');
      }
    })
  }
  /***** END FOOTER TOGGLE NAV *****/

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

  /***** FAQ *****/
  const faqSection = document.querySelector('.page-faq');

  if (faqSection) {
    const activeEl = faqSection.querySelector('.page-faq__item[data-active]');
    if (activeEl) {
      const activeElItemBodyHeight = activeEl.querySelector('.page-faq__item-body').scrollHeight;
      activeEl.querySelector('.page-faq__item-body').style.height = `${activeElItemBodyHeight}px`;
    }
    faqSection.addEventListener('click', function (evt) {
      const isItemHeaderClick = evt.target.classList.contains('page-faq__item-btn') || !!evt.target.closest('.page-faq__item-btn');
      if (isItemHeaderClick) {
        const itemWrapper = evt.target.closest('.page-faq__item');
        const itemBody = itemWrapper?.querySelector('.page-faq__item-body');
        const itemBodyHeight = itemBody?.scrollHeight;
        const isActive = itemWrapper.hasAttribute('data-active');

        itemWrapper.toggleAttribute('data-active');

        if (isActive) {
          itemBody.style.height = '0px';
        } else {
          itemBody.style.height = `${itemBodyHeight}px`;
        }
      }
    })
  }
  /***** END FAQ *****/

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
      on: {
        slideChange: swiper => {
          const slide = swiper.slides[swiper.activeIndex];
          const isVideoSlide = slide.classList.contains('home-intro__video-slide');

          if(isVideoSlide) {
            const video = slide.querySelector('.home-intro__video');
            if(video.ended) {
              slide.querySelector('.home-intro__video').play();
            }
          }
        }
      }
    })
  }
  if(homeIntroSlidesVideos && homeIntroSlidesVideos.length) {
    homeIntroSlidesVideos.forEach(video => {
      video.addEventListener('ended', () => {
        if(window.screen.availWidth > 600) {
          homeIntroSlider.slideNext();
        }
      })
    })
  }
  /***** END HOME INTRO SLIDEr *****/

  /***** REINITIALIZATION *****/
  function reInit() {
    isMobile = window.screen.availWidth <= 600;
    initializeGallerySliders(gallerySliders);
  }

  window.addEventListener('resize', throttle(reInit, 1000));
  window.addEventListener('orientationchange', reInit);
  /***** END REINITALIZATION *****/
})