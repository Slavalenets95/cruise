import { throttle } from "./helpers";

class Faq {
  faqNode = null;
  isMobile = null;
  faqItemsNodes = [];
  faqItemsNodesScrollParams = [];
  faqNavBtns = [];
  faqNavWrapperNode = null;
  faqNavTop = 0;

  #setScrollParamsItems() {
    if (this.faqItemsNodes.length) {
      this.faqItemsNodesScrollParams = [];

      this.faqItemsNodes.forEach(item => {
        const itemParams = item.getBoundingClientRect();

        this.faqItemsNodesScrollParams.push({
          node: item,
          height: Math.round(itemParams.height),
          y: Math.round(itemParams.y) + Math.round(window.scrollY) - this.faqNavWrapperNode.scrollHeight - this.faqNavTop,
          bottomY: Math.round(itemParams.height) + Math.round(itemParams.y) + Math.round(window.scrollY) - this.faqNavWrapperNode.scrollHeight - this.faqNavTop,
        })
      })
    }
  }

  #setIsMobile() {
    this.isMobile = window.screen.availWidth <= 768;
  }

  #setFaqNavTop() {
    this.faqNavTop = parseInt(getComputedStyle(this.faqNavWrapperNode).top);
  }

  faqScroll = throttle(() => {
    if (this.isMobile) {
      this.#setScrollParamsItems();
      this.#setFaqNavTop();

      const scrollY = Math.round(window.scrollY);
      const idx = this.faqItemsNodesScrollParams.findIndex(params => scrollY >= params.y && scrollY <= params.bottomY);

      if (idx !== -1) {
        this.faqNavBtns.forEach(btn => {
          if (btn.hasAttribute('data-tab-active') && btn !== this.faqNavBtns[idx]) {
            btn.removeAttribute('data-tab-active');
          }
        });
        this.faqNavBtns[idx].setAttribute('data-tab-active', '');
      }
    }
  }, 100);

  reinit() {
    this.#setIsMobile();

    if(this.isMobile) {
      window.addEventListener('scroll', this.faqScroll);
    }
  }

  make() {
    this.faqNode = document.querySelector('.faq');
    this.#setIsMobile();

    if (this.faqNode) {
      this.faqItemsNodes = [...document.querySelectorAll('.faq-body__items')];
      this.faqNavBtns = [...document.querySelectorAll('.faq-nav__item')];
      this.faqNavWrapperNode = this.faqNode.querySelector('.faq-nav');
      this.#setFaqNavTop();

      window.addEventListener('scroll', this.faqScroll);
    }
  }
}

export default new Faq();