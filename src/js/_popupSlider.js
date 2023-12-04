import Swiper from 'swiper/bundle';

class PopupSlider {
  overlay = document.querySelector('.overlay');
  options = {
    node: null,
    popupNode: null,
    sliderSelector: null,
    sliderNode: null,
    sliderSwiper: null,
    subSliderSelector: '',
    btnSelector: '',
    closeBtnSelectors: [],
    switcherNode: null,
    switcherListNode: null,
    disableIfOneSlide: false,
  };

  constructor(options) {
    this.options = {
      ...this.options,
      ...options
    }
    this.init();
    this.overlay.addEventListener('click', () => this.closePopup());

  }

  init() {
    if (!this.options.node || !document.querySelector(this.options.sliderSelector)) return;

    this.popupSliderInit();
    this.subSlidersInit();

    this.options.node.addEventListener('click', (evt) => {
      const isBtnClick = evt.target.classList.contains(this.options.btnSelector);
      const isChildBtnClick = !!evt.target.closest(this.options.btnSelector);

      if (!isBtnClick && !isChildBtnClick) return;

      const btnNode = isBtnClick ? evt.target : evt.target.closest(this.options.btnSelector);
      const btnIdx = this.getBtnIdx(btnNode, btnNode.parentElement);

      this.openPopup(btnIdx);

      if (this.options.closeBtnSelectors.length) {
        this.options.closeBtnSelectors.forEach(btnSelector => {
          const btns = this.options.popupNode.querySelectorAll(btnSelector);
          if (!btns.length) return;

          btns.forEach(btn => btn.addEventListener('click', () => this.closePopup()));
        });
      }
    })
    this.switcherInit();
  }

  getBtnIdx(btnNode, btnParent) {
    return [...btnParent.children].findIndex(elem => elem === btnNode);
  }

  openPopup(btnIdx) {
    this.options.sliderSwiper.slideTo(btnIdx, 0);
    this.overlay.setAttribute('data-active', '');
    this.overlay.setAttribute('data-overlay-active', '');
    this.options.popupNode.setAttribute('data-active', '');
    this.switcherListMake(btnIdx);
  }

  closePopup() {
    this.overlay.removeAttribute('data-active');
    this.overlay.removeAttribute('data-overlay-active');
    this.options.popupNode.removeAttribute('data-active');
    if (this.options.switcherNode) {
      this.options.switcherNode.removeAttribute('data-switcher-active');
    }
    if (this.options.switcherListNode) {
      this.options.switcherListNode.removeAttribute('data-switcher-active');
    }
  }

  popupSliderInit() {
    this.options.sliderNode = document.querySelector(this.options.sliderSelector);
    this.options.sliderSwiper = new Swiper(this.options.sliderSelector, {
      spaceBetween: 12,
      slidesPerView: 1,
      touchRatio: 0.2,
      navigation: {
        nextEl: this.options.node.querySelector('.main-slider-btn.next'),
        prevEl: this.options.node.querySelector('.main-slider-btn.prev'),
      },
      on: {
        slideChange: (swiper) => {
          this.switcherListMake(swiper.activeIndex);
        }
      }
    })
  }

  subSlidersInit() {
    const subSliders = this.options.node.querySelectorAll(this.options.subSliderSelector);

    if (!subSliders.length) return

    subSliders.forEach((slider, idx) => {
      const slideSelector = `${this.options.subSliderSelector}.slide-${idx + 1}`;
      const paginationSelector = `${this.options.sliderSelector} ${slideSelector} .swiper-nav__dots`;
      const slideLength = slider.querySelectorAll('.swiper-slide').length;
      slider.classList.add(`slide-${idx + 1}`);

      if (slideLength === 1 && this.options.disableIfOneSlide) {
        slider.classList.add('disabled');
      }

      new Swiper(slideSelector, {
        spaceBetween: 12,
        slidesPerView: 1,
        touchRatio: 0.2,
        watchOverflow: false,
        a11y: false,
        pagination: {
          el: paginationSelector,
          type: 'bullets',
          clickable: true,
        },
        navigation: {
          nextEl: `${slideSelector} .swiper-nav__btn.next`,
          prevEl: `${slideSelector} .swiper-nav__btn.prev`,
        },
      })
    });
  }

  switcherInit() {
    if (!this.options.switcherNode || !this.options.switcherListNode) return;

    this.options.switcherNode.addEventListener('click', () => {
      this.options.switcherListNode.toggleAttribute('data-switcher-active');
      this.options.switcherNode.toggleAttribute('data-switcher-active');
    })

    this.options.switcherListNode.addEventListener('click', (evt) => {
      const isBtnClick = evt.target.nodeName.toLowerCase() === 'button';
      const isChildBtnClick = !!evt.target.closest('button');

      if (!isBtnClick && !isChildBtnClick) return;
      const btn = isBtnClick ? evt.target : evt.target.closest('button');
      const parentLi = evt.target.closest('li');
      const parentList = evt.target.closest('ul');
      const idx = this.getBtnIdx(parentLi, parentList);
      this.switcherListMake(idx);
    })
  }

  switcherListMake(btnIdx) {
    if (!this.options.switcherNode || !this.options.switcherListNode) return;

    const activeBtns = this.options.switcherListNode.querySelectorAll('[data-switcher-el-active]');
    if (activeBtns.length) {
      activeBtns.forEach(activeBtn => activeBtn.removeAttribute('data-switcher-el-active'));
    }
    this.options.sliderSwiper.slideTo(btnIdx);
    const btn = this.options.switcherListNode.querySelector(`li:nth-child(${btnIdx + 1}) button`);
    if (!btn) return;
    const switcherNodeText = this.options.switcherNode.querySelector('span');
    switcherNodeText.textContent = btn.textContent;
    btn.setAttribute('data-switcher-el-active', '');
    this.options.switcherListNode.removeAttribute('data-switcher-active');
  }
}

class AroyaPopupSliders {
  make() {
    // Suite page
    const suiteCards = document.querySelector('.suite-cards');
    const suitePopup = document.querySelector('.suite-popup');
    const suitePopupSlider = document.querySelector('.suite-popup > .swiper');
    const switcher = document.querySelector('.suite-popup__switcher-btn');
    const switcherList = document.querySelector('.suite-popup__switcher-list-wrapper');

    if (suiteCards && suitePopupSlider) {
      new PopupSlider({
        node: suiteCards,
        popupNode: suitePopup,
        sliderSelector: '.suite-popup > .swiper',
        btnSelector: '.suite-card',
        subSliderSelector: '.suite-popup__item-slider',
        closeBtnSelectors: ['.suite-popup__item-close'],
        switcherNode: switcher,
        switcherListNode: switcherList,
        disableIfOneSlide: true,
      })
    }

    // Restaraunt page - dining
    const dining = document.querySelector('.dining');
    if (dining) {
      const diningPopup = dining.querySelector('.restaraunt-popup');
      const diningPopupSlider = dining.querySelector('.dining .restaraunt-popup > .swiper');
      const diningSwitcher = dining.querySelector('.popup__switcher-btn');
      const diningSwitcherList = dining.querySelector('.popup__switcher-list');

      if (diningPopupSlider) {
        new PopupSlider({
          node: dining,
          popupNode: diningPopup,
          sliderSelector: '.dining .slider-popup > .swiper',
          btnSelector: '.dining-item',
          subSliderSelector: '.restaraunt-popup__item-slider',
          closeBtnSelectors: ['.restaraunt-popup__item-close'],
          switcherNode: diningSwitcher,
          switcherListNode: diningSwitcherList,
          disableIfOneSlide: true,
        })
      }
    }

    // Restaraunt page specialty
    const specialty = document.querySelector('.restaraunt-specialty');
    if (specialty) {
      const specialtyPopup = specialty.querySelector('.restaraunt-popup');
      const specialtyPopupSlider = specialty.querySelector('.restaraunt-specialty .restaraunt-popup > .swiper');
      const specialtySwitcher = specialty.querySelector('.popup__switcher-btn');
      const specialtySwitcherList = specialty.querySelector('.popup__switcher-list');

      if (specialtyPopupSlider) {
        new PopupSlider({
          node: specialty,
          popupNode: specialtyPopup,
          sliderSelector: '.restaraunt-specialty .slider-popup > .swiper',
          btnSelector: '.restaraunt-page__slide',
          subSliderSelector: '.restaraunt-popup__item-slider',
          closeBtnSelectors: ['.restaraunt-popup__item-close'],
          switcherNode: specialtySwitcher,
          switcherListNode: specialtySwitcherList,
          disableIfOneSlide: true,
        })
      }
    }

    // Restaraunt page bars
    const bars = document.querySelector('.restaraunt-bars');
    if (bars) {
      const barsPopup = bars.querySelector('.restaraunt-popup');
      const barsPopupSlider = bars.querySelector('.restaraunt-popup > .swiper');
      const barsSwitcher = bars.querySelector('.popup__switcher-btn');
      const barsSwitcherList = bars.querySelector('.popup__switcher-list');

      if (barsPopupSlider) {
        new PopupSlider({
          node: bars,
          popupNode: barsPopup,
          sliderSelector: '.restaraunt-bars .slider-popup > .swiper',
          btnSelector: '.restaraunt-page__slide',
          subSliderSelector: '.restaraunt-popup__item-slider',
          closeBtnSelectors: ['.restaraunt-popup__item-close'],
          switcherNode: barsSwitcher,
          switcherListNode: barsSwitcherList,
          disableIfOneSlide: true,
        })
      }
    }
  }
}

export default new AroyaPopupSliders();