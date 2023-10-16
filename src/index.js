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
      activeEls?.forEach(activeel => activeEl.removeAttribute('data-active'));
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
      if (evt.target.matches('.footer-nav__item-title') && screen.availWidth <= 992) {
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
      const slider = new Swiper(`.gallery.swiper-${idx} .gallery-slider .swiper`, {
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
            const translateValue = swiper.realIndex * (scrollbarWrapper.offsetWidth / slideCount);
            scrollbarDrag.style.transform = `translateX(${translateValue}px)`;
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

  addGallerySwiperClasses(gallerySliders);
  initializeGallerySliders(gallerySliders);
  /***** END GALLERY SLIDER  *****/

  /***** REINITIALIZATION *****/
  function reInit() {
    isMobile = window.screen.availWidth <= 600;
    initializeGallerySliders(gallerySliders);
  }

  window.addEventListener('resize', throttle(reInit, 1000));
  window.addEventListener('orientationchange', reInit);
  /***** END REINITALIZATION *****/
})