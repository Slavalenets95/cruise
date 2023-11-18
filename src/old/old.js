import './scss/app.scss';
import Swiper from 'swiper/bundle';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { addMonths, addYears, endOfYear, formatISO, startOfYear, getYear, getMonth, format } from 'date-fns';
import { enUS } from 'date-fns/locale';

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
  const body = document.querySelector('body');

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
      autoplay: {
        delay: 3000,
        pauseOnMouseEnter: true,
      },
    })
  }
  /***** END HOME INTRO SLIDER *****/

  /***** REINITIALIZATION *****/
  function reInit() {
    isMobile = window.screen.availWidth <= 600;
    initializeGallerySliders(gallerySliders);
  }

  window.addEventListener('resize', throttle(reInit, 1000));
  window.addEventListener('orientationchange', reInit);
  /***** END REINITALIZATION *****/


  function getSearchFormData() {
    const formDataSchema = {
      destinations: [],
      dates: [],
      ports: [],
      adults: 0,
      childrens: 0,
      infants: 0,
    };
    const searchForm = document.getElementById('search-form');

    const formData = new FormData(searchForm);
    // Get all destindation
    formDataSchema.destinations = formData.getAll('destinations').slice(0);
    // Get all ports
    formDataSchema.ports = formData.getAll('ports').slice(0);
    // Get all dates
    const activeDates = searchForm.querySelectorAll('button[data-date][data-active]');

    if (activeDates.length) {
      activeDates.forEach(date => {
        formDataSchema.dates.push(new Date(date.getAttribute('data-date')));
      })
    }
    // Get adults
    // formDataSchema.adults = document.querySelector('.search-guests input[name=adult]').value;
    // // Get Childrens
    // formDataSchema.childrens = document.querySelector('.search-guests input[name=children]').value;
    // // Get Infants
    // formDataSchema.infants = document.querySelector('.search-guests input[name=infants]').value;

    return formDataSchema;
  }
  /***** DROPDOWNS *****/
  function initDropdowns() {
    const dropDowns = document.querySelectorAll('[data-dropdown-btn]');

    if (dropDowns.length) {
      dropDowns.forEach(dropdownBtn => {
        dropdownBtn.addEventListener('click', function () {
          const activeDropdownBtn = document.querySelector('[data-dropdown-btn][data-active]');
          const activeDropdownBody = document.querySelector('[data-dropdown-body][data-active]');
          const dropdownBody = dropdownBtn.closest('[data-dropdown-parent]').querySelector('[data-dropdown-body]');

          // Close other dropdown
          if (activeDropdownBtn && activeDropdownBtn !== dropdownBtn) {
            activeDropdownBtn.removeAttribute('data-active');
          }
          if (activeDropdownBody && activeDropdownBody !== dropdownBody) {
            activeDropdownBody.removeAttribute('data-active');
          }

          // Toggle current dropdown
          if (dropdownBody) {
            dropdownBody.toggleAttribute('data-active');
            dropdownBtn.toggleAttribute('data-active');
          }
        })
      })
      body.addEventListener('click', closeActiveDropdown);
    }
  }
  function closeActiveDropdown(evt, flag = false) {
    const isDropdownClick = evt.target.hasAttribute('data-dropdown-parent');
    const isDropdownChildClick = evt.target.closest('[data-dropdown-parent]');

    if ((isDropdownClick || isDropdownChildClick) && !flag) return;

    const activeDropdown = document.querySelector('[data-dropdown-body][data-active]');
    const activeDropdownBtn = document.querySelector('[data-dropdown-btn][data-active]');

    if (activeDropdown.closest('#search-form')) {
      const formData = getSearchFormData();
      const filtered = {
        destinations: {},
        ports: {},
        dates: {}
      };
      let filteredDestinations = searchPanel.allDestinations.map(destination => destination);
      let filteredPorts = searchPanel.allPorts.map(port => port);
      let filteredDates = new Set();
      searchPanel.allVoyages.forEach(({pkg}) => {
        const year = getYear(pkg.vacation.from);
        const month = getMonth(pkg.vacation.from) + 1;
        filteredDates.add(`${year}-${month}`);
      })
      filteredDates = [...filteredDates];

      searchPanel.allVoyages.forEach(({ pkg }) => {
        const date = `${getYear(pkg.vacation.from)}-${getMonth(pkg.vacation.from) + 1}`;
        const port = pkg.location.from.code;
        // Refactor спредом можно уменьшить код
        //const destinations = pkg.destinations.map(destination => destination.key);
        // Destinations
        pkg.destinations.forEach(destination => {
          if(!filtered.destinations[destination.key]) {
            filtered.destinations[destination.key] = {};
            filtered.destinations[destination.key].ports = new Set();
            filtered.destinations[destination.key].dates = new Set();
          }
          filtered.destinations[destination.key].ports.add(port);
          filtered.destinations[destination.key].dates.add(date);
        })

        // Ports
        if(!filtered.ports[port]) {
          filtered.ports[port] = {};
          filtered.ports[port].destinations = new Set();
          filtered.ports[port].dates = new Set();
        }
        pkg.destinations.forEach(destination => filtered.ports[port].destinations.add(destination.key));
        filtered.ports[port].dates.add(date);

        // Dates
        if(!filtered.dates[date]) {
          filtered.dates[date] = {};
          filtered.dates[date].destinations = new Set();
          filtered.dates[date].ports = new Set();
        }
        pkg.destinations.forEach(destination => filtered.dates[date].destinations.add(destination.key));
        filtered.dates[date].ports.add(port);
      })

      if(formData.destinations.length) {
        Object.keys(filtered.ports).forEach(key => {
          if(![...filtered.ports[key].destinations].some(destination => formData.destinations.includes(destination))) {
            filteredPorts = filteredPorts.filter(port => port.code !== key);
          }
        })
        Object.keys(filtered.dates).forEach(key => {
          if(![...filtered.dates[key].destinations].some(destination => formData.destinations.includes(destination))) {
            filteredDates = filteredDates.filter(date => date !== key);
          }
        })
      }

      if(formData.ports.length) {
        Object.keys(filtered.destinations).forEach(key => {
          if(![...filtered.destinations[key].ports].some(port => formData.ports.includes(port))) {
            filteredDestinations = filteredDestinations.filter(destination => destination.key !== key);
          }
        })
        Object.keys(filtered.dates).forEach(key => {
          if(![...filtered.dates[key].ports].some(port => formData.ports.includes(port))) {
            filteredDates = filteredDates.filter(date => date !== key);
          }
        })
      }

      if(formData.dates.length) {
        Object.keys(filtered.destinations).forEach(key => {
          if(![...filtered.destinations[key].dates].some(date => formData.dates.includes(date))) {
            filteredDestinations = filteredDestinations.filter(destination => destination.key !== key);
          }
        })
        Object.keys(filtered.ports).forEach(key => {
          if(![...filtered.ports[key].dates].some(date => formData.dates.includes(date))) {
            filteredPorts = filteredPorts.filter(port => port.code !== key);
          }
        })
      }
      console.log(filteredDestinations);
      console.log(filteredPorts);
      console.log(filteredDates)
    }
    if (activeDropdown) {
      activeDropdown.removeAttribute('data-active');
    }
    if (activeDropdownBtn) {
      activeDropdownBtn.removeAttribute('data-active');
    }
  }
  initDropdowns()
  // Add closeDropDown event on OK date button
  const okMonthpickerBtn = document.querySelector('.search-form__dates-ok');
  if (okMonthpickerBtn) {
    okMonthpickerBtn.addEventListener('click', evt => closeActiveDropdown(evt, true));
  }
  /***** END DROPDOWNS *****/

  /***** SEARCH FORM CLEAR BUTTONS *****/
  const clearButtons = document.querySelectorAll('[data-clear-btn]');
  if (clearButtons.length) {
    clearButtons.forEach(clearBtn => {
      clearBtn.addEventListener('click', function (evt) {
        console.log(evt.target.closest('[data-clear-parent]'))
        const clearParent = evt.target.closest('[data-clear-parent]');
        const clearInputs = clearParent.querySelectorAll('input');

        if (clearInputs.length) {
          clearInputs.forEach(input => {
            const inputType = input.type;

            switch (inputType) {
              case 'checkbox':
                input.checked = false;
                break;
              default:
                input.value = '';
                break;
            }
          })
        }
      })
    })
  }
  const clearDateButtons = document.querySelectorAll('[data-clear-date]');
  if (clearDateButtons.length) {
    clearDateButtons.forEach(clearBtn => {
      clearBtn.addEventListener('click', evt => {
        const parentWrapper = evt.target.closest('[data-clear-parent]');
        if (parentWrapper) {
          const dateItems = parentWrapper.querySelectorAll('[data-date]');
          dateItems.forEach(item => item.removeAttribute('data-active'));
        }
      })
    })
  }
  /***** END SEARCH FORM CLEAR BUTTONS *****/
})


function monthPickerInit() {
  const searchMonthPicker = document.querySelector('.search-form__dates');
  if (searchMonthPicker) {
    const allMonths = searchMonthPicker.querySelectorAll('[data-date]');
    const transformAllMonth = Array.from(allMonths).map(monthEl => {
      return {
        el: monthEl,
        date: new Date(monthEl.getAttribute('data-date')),
      }
    });

    allMonths.forEach(monthBtn => {
      monthBtn.addEventListener('click', (evt) => {
        const isDisable = evt.target.hasAttribute('data-disable');
        const maxDate = getMaxSelectedDate(transformAllMonth);
        const minDate = getMinSelectedDate(transformAllMonth);

        if (!isDisable) evt.target.toggleAttribute('data-active');

        const targetDateTime = new Date(evt.target.getAttribute('data-date')).getTime();

        if (maxDate && minDate) {
          if (targetDateTime > maxDate.date.getTime()) {
            const betweenMaxDates = transformAllMonth.filter(i => {
              return !i.el.hasAttribute('data-disable') &&
                i.date.getTime() > maxDate.date.getTime() &&
                i.date.getTime() < targetDateTime;
            })
            betweenMaxDates.forEach(i => i.el.setAttribute('data-active', ''));
          } else if (targetDateTime < minDate.date.getTime()) {
            const betweenMinDates = transformAllMonth.filter(i => {
              return !i.el.hasAttribute('data-disable') &&
                i.date.getTime() < minDate.date.getTime() &&
                i.date.getTime() > targetDateTime;
            })
            betweenMinDates.forEach(i => i.el.setAttribute('data-active', ''));
          }
        }
      })
    })
  }
}

function getMaxSelectedDate(transformAllMonth) {
  const activeEls = transformAllMonth.filter(i => i.el.hasAttribute('data-active'));
  const dates = activeEls.map(i => i.date);
  const maxDate = Math.max.apply(null, dates);
  return activeEls.filter(i => i.date.getTime() === maxDate)[0];
}

function getMinSelectedDate(transformAllMonth) {
  const activeEls = transformAllMonth.filter(i => i.el.hasAttribute('data-active'));
  const dates = activeEls.map(i => i.date);
  const minDate = Math.min.apply(null, dates);
  return activeEls.filter(i => i.date.getTime() === minDate)[0];
}

// Сделать чтобы это было из env
const url = "http://uat.booking.aroya.com:3000/graphql";

class graphQL {
  url = "";

  constructor(url) {
    this.url = url;
  }

  prepareQuery({ queryName, params, fields }) {
    return {
      query: {
        [queryName]: {
          __args: {
            params: {
              ...params
            }
          },
          ...fields
        }
      }
    }
  }

  makeQuery(queryObj) {
    const query = jsonToGraphQLQuery(this.prepareQuery({ ...queryObj }));

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    }).then(res => res.json())
  }
}

class AroyaQueries {
  maker = null;

  constructor() {
    this.maker = new graphQL(url);
  }

  getAvailableVoyages(fromDate, toDate) {
    const queryObj = {
      queryName: "availableVoyages",
      params: {
        startDateRange: {
          from: fromDate,
          to: toDate,
        },
        endDateRange: {
          from: fromDate,
          to: toDate,
        }
      },
      fields: {
        pkg: {
          destinations: {
            name: true,
            key: true,
            comments: true,
          },
          vacation: {
            from: true
          },
          location: {
            from: {
              name: true,
              code: true,
            },
          }
        }
      }
    }
    return this.maker.makeQuery(queryObj);
  }
}

class SearchPanel {
  aroyaQueries = null;
  allVoyages = [];
  allDestinations = [];
  allDates = [];
  allPorts = [];

  constructor() {
    this.aroyaQueries = new AroyaQueries();
  }

  // Set dates for calendar render
  setCalendarDates() {
    const minDate = this.getMinVoyageDate();

    const startDate = startOfYear(new Date(minDate.getTime()));
    const endDate = endOfYear(addYears(new Date(minDate).getTime(), 1));

    let currentDate = new Date(startDate.getTime());
    while (addMonths(currentDate, 1).getYear() <= endDate.getYear()) {
      if (!this.allDates.length) {
        this.allDates.push(currentDate);
      } else {
        currentDate = addMonths(currentDate, 1);
        this.allDates.push(currentDate);
      }
    }
  }

  // Return min voyage date
  getMinVoyageDate() {
    const dates = this.allVoyages.map(({ pkg }) => pkg.vacation.from);

    return new Date(Math.min.apply(null, dates));
  }

  // Prepare search form render values
  prepareRenderValues() {
    // Convert dateFrom to Date obj
    this.allVoyages.forEach(({ pkg }) => pkg.vacation.from = new Date(pkg.vacation.from));

    this.allVoyages.forEach(({ pkg }) => {
      // All destinations
      pkg.destinations.forEach(destination => {
        const issetValue = this.allDestinations.findIndex(i => {
          return i.key === destination.key
        });

        if (issetValue === -1) {
          this.allDestinations.push({ comment: destination.comments, key: destination.key })
        }
      })
      // All ports
      const locationIsset = this.allPorts.findIndex(i => {
        return i.code === pkg.location.from.code;
      })

      if (locationIsset === -1) {
        this.allPorts.push({ name: pkg.location.from.name, code: pkg.location.from.code });
      }
    })

    this.setCalendarDates();
  }

  createSearchCheckboxItem(checkboxName, checkboxValue, checkboxTextValue) {
    const checkboxItem = document.createElement('div');
    checkboxItem.className = 'search-form__checkbox-item';
    checkboxItem.setAttribute('data-search-text-parent', '');
    checkboxItem.innerHTML = `
      <label class="search-form__label flex">
        <input type="checkbox" name="${checkboxName}" value="${checkboxValue}">
        <div class="checkbox-after"></div>
        <span class="search-form__checkbox-text" data-search-text>${checkboxTextValue}</span>
      </label>`;

    return checkboxItem;
  }

  createSearchDateItem(date, month, year, monthName) {
    const dateItem = document.createElement('div');
    const isDisable = this.allVoyages.findIndex(({ pkg }) => {
      const voyageYear = getYear(pkg.vacation.from);
      const voyageMonth = getMonth(pkg.vacation.from);
      return voyageYear == year && voyageMonth == month;
    });
    const disableString = isDisable === -1 ? 'data-disable' : '';

    dateItem.className = 'search-form__date-item flex';
    dateItem.innerHTML = `
      <button type="button" class="search-form__date-month flex text-16" ${disableString} data-date="${year}-${month}">
        ${monthName}
      </button>`

    return dateItem;
  }

  createDatesItems() {
    const datesWrapper = document.querySelector('[data-search-form-dates]');
    if (datesWrapper && this.allDates.length) {
      const datesItems = [];
      for (let i = 1; i <= this.allDates.length / 12; i++) {
        const datesItem = document.createElement('div');
        datesItem.className = 'search-form__dates-item flex';
        datesItem.innerHTML = `
          <div class="search-form__dates-item-title text-20 extrabold">
            ${getYear(this.allDates[i * 12 - 1])}
          </div>
          <div class="search-form__date flex"></div>`;

        for (let idx = i == 1 ? i - 1 : (i - 1) * 12; idx <= (i * 12 - 1); idx++) {
          const month = getMonth(this.allDates[idx]) + 1;
          const year = getYear(this.allDates[idx]);
          const monthName = format(this.allDates[idx], 'LLL', { locale: enUS });

          datesItem.querySelector('.search-form__date').appendChild(this.createSearchDateItem(this.allDates[idx], month, year, monthName))
        }

        datesItems.push(datesItem);
      }
      datesItems.forEach(dateItem => datesWrapper.appendChild(dateItem))
    }
  }

  searchInputInit() {
    const searchInputs = document.querySelectorAll('[data-search-input]');
    if (searchInputs.length) {
      searchInputs.forEach(searchInput => {
        const searchInputParent = searchInput.closest('[data-search-parent]');
        const searchInputElements = searchInputParent.querySelectorAll('[data-search-text]');

        if (searchInputParent && searchInputElements.length) {
          searchInput.addEventListener('input', function (evt) {
            searchInputElements.forEach(searchEl => {
              if (!searchEl.textContent.toLowerCase().includes((evt.target.value.toLowerCase()))) {
                searchEl.closest('[data-search-text-parent]').setAttribute('data-hidden', '');
              } else {
                searchEl.closest('[data-search-text-parent]').removeAttribute('data-hidden');
              }
            })
          })
        }
      })
    }
  }

  render() {
    // Destinations render
    const destinationsWrapper = document.querySelector('[data-search-destinations]');
    if (destinationsWrapper && this.allDestinations.length) {
      this.allDestinations.forEach(destination => {
        destinationsWrapper.appendChild(this.createSearchCheckboxItem('destinations', destination.key, destination.comment));
      })
    }

    // Ports render
    const portsWrapper = document.querySelector('[data-search-ports]')
    if (portsWrapper && this.allPorts.length) {
      this.allPorts.forEach(port => {
        portsWrapper.appendChild(this.createSearchCheckboxItem('ports', port.code, port.name));
      })
    }

    // Dates render
    this.createDatesItems();
  }

  async make() {
    // Get all voyages
    const fromDateISO = formatISO(new Date(Date.now()));
    const toDateISO = formatISO(endOfYear(addYears(new Date(Date.now()), 2)));
    await this.aroyaQueries.getAvailableVoyages(fromDateISO, toDateISO).then(res => this.allVoyages = res.data.availableVoyages);

    // Prepare render values
    this.prepareRenderValues();

    // Render
    this.render();

    // Init search inputs
    this.searchInputInit();

    // Init search panel monthpicker
    monthPickerInit();
  }
}

const searchPanel = new SearchPanel();
searchPanel.make();


// class Dropdowns {

//   body = document.querySelector('body');

//   reInit() {
//     const activeDropdowns = document.querySelectorAll('[data-dropdown][data-dropdown-active]');

//     if(activeDropdowns.length) {
//       activeDropdowns.forEach(dropdown => {
//         const noToggle = dropdown.hasAttribute('data-dropdown-notoggle');
//         const activeDropdownBody = dropdown.querySelector('[data-dropdown-body]');

//         if(!noToggle && activeDropdownBody) {
//           activeDropdownBody.style.height = 'auto';
//         }
//       })
//     }
//   }

//   make() {
//     const dropdowns = document.querySelectorAll('[data-dropdown-parent]');

//     if(dropdowns.length) {
//       dropdowns.forEach(dropdown => {
//         const activeDropdown = dropdown.querySelector('[data-dropdown][data-dropdown-active]');
//         const activeDropdownBody = dropdown.querySelector('[data-dropdown][data-dropdown-active] [data-dropdown-body]');
//         if(activeDropdown && activeDropdownBody) {
//           activeDropdownBody.style.height = activeDropdownBody.scrollHeight + 'px';
//         }

//         dropdown.addEventListener('click', evt => {
//           const isDropdownBtn = evt.target.hasAttribute('data-dropdown-btn') || evt.target.closest('[data-dropdown-btn]');

//           if(isDropdownBtn) {
//             const noToggle = dropdown.hasAttribute('data-dropdown-notoggle');
//             const activeDropdown = dropdown.querySelector('[data-dropdown][data-dropdown-active]');
//             const activeDropdownBody = dropdown.querySelector('[data-dropdown][data-dropdown-active] [data-dropdown-body]');
//             const targetDropdown = evt.target.closest('[data-dropdown]');
//             const targetDropdownBody = targetDropdown.querySelector('[data-dropdown-body]');
//             const sameDropdown = targetDropdown === activeDropdown;
//             const targetDropdownBodyHeight = targetDropdownBody.scrollHeight;

//             if(activeDropdown) {
//               const isSearchFormDropdown = activeDropdown.closest('#search-form');

//               activeDropdown.removeAttribute('data-dropdown-active');

//               if(isSearchFormDropdown) {
//                 document.querySelector('#search-form').dispatchEvent(new CustomEvent('close-search-dropdown'));
//               }
//               if(!noToggle) {
//                 if(!activeDropdownBody.style.height || activeDropdownBody.style.height === 'auto') {
//                   activeDropdownBody.style.height = `${targetDropdownBodyHeight}px`;
//                   setTimeout(() => activeDropdownBody.style.height = '0px', 0)
//                 } else {
//                   activeDropdownBody.style.height = '0px'
//                 }
//               }
//             }

//             if(!sameDropdown) {
//               targetDropdown.setAttribute('data-dropdown-active', '');
//               if(!noToggle) {
//                 targetDropdownBody.style.height = `${targetDropdownBodyHeight}px`;
//               }
//             }
//           }
//         })
//       })
//     }

//     this.body.addEventListener('click', function(evt) {
//       const isDropdownBody = evt.target.hasAttribute('data-dropdown-body') || evt.target.closest('[data-dropdown-body]');
//       const isDropdownBtn = evt.target.hasAttribute('data-dropdown-btn') || evt.target.closest('[data-dropdown-btn]');
//       const activeDropdown = document.querySelector('[data-dropdown-parent]:not([data-dropdown-noclose-body]) [data-dropdown][data-dropdown-active]');

//       if(isDropdownBody) return;

//       if(activeDropdown && !isDropdownBtn) {
//         const isSearchFormDropdown = activeDropdown.closest('#search-form');
//         if(isSearchFormDropdown) {
//           document.querySelector('#search-form').dispatchEvent(new CustomEvent('close-search-dropdown'));
//         }
//         activeDropdown.removeAttribute('data-dropdown-active');
//       }
//     })

//     // this.initDropdowns();
//     // const okMonthpickerBtn = document.querySelector('.search-form__dates-ok');
//     // if (okMonthpickerBtn) {
//     //   okMonthpickerBtn.addEventListener('click', evt => this.closeActiveDropdown(evt, true));
//     // }
//   }
// }