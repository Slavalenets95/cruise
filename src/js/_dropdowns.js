class Dropdown {
  #dataStr = 'data-drop-active';

  options = {
    parentNode: null,
    itemSelector: '.drop-item',
    btnSelector: '.drop-header',
    bodySelector: '.drop-body',
    closeSelectors: [],
    closeOther: false,
    notCloseOther: 768,
    animate: false,
  }

  constructor(options) {
    this.options = {
      ...this.options,
      ...options
    }
    this.init();
    document.querySelector('body').addEventListener('click', this.#bodyListener)
    window.addEventListener('scroll', this.#resize);
  }

  init() {
    if (this.options.parentNode) {
      this.#setActiveHeight();
      this.options.parentNode.addEventListener('click', (evt) => {
        if (this.#isDropBtn(evt.target)) {
          this.#closeOther(evt.target);

          if (this.#isActive(evt.target)) {
            this.#close(this.#getItemParent(evt.target));
          } else {
            this.#open(this.#getItemParent(evt.target));
          }
        }
      })
    }
    if(this.options.closeSelectors.length) {
      this.options.closeSelectors.forEach(closeItem => {
        const closeItems = this.options.parentNode.querySelectorAll(closeItem);
        if(closeItems.length) {
          closeItems.forEach(closeItem => {
            closeItem.addEventListener('click', (evt) => {
              this.#close(this.#getItemParent(evt.target));
            })
          })
        }
      })
    }
  }

  #resize() {
    // const active = document.querySelectorAll(`[data-drop-active]`);

    // if (active.length) {
    //   active.forEach(activeEl => {
    //     const height = activeEl.querySelector('.drop-body > .drop-body__wrapper').scrollHeight;
    //     activeEl.querySelector('.drop-body').style.height = `${height}px`;
    //   })
    // }
  }

  #setActiveHeight() {
    const active = this.options.parentNode.querySelectorAll(`[${this.#dataStr}]`);

    if (active.length) {
      active.forEach(activeNode => {
        const body = activeNode.querySelector(this.options.bodySelector);
        body.style.height = `${this.#getBodyHeight(activeNode)}px`;
      })
    }
  }

  #bodyListener(evt) {
    const dropdowns = document.querySelectorAll('[data-drop-body-close]');
    let active = [];
    const isDrop = evt.target.hasAttribute('data-drop-active') || !!evt.target.closest('[data-drop-active]') ?
      true :
      false;

    if (isDrop) return;

    if (dropdowns.length) {
      dropdowns.forEach(drop => {
        const dropActive = drop.querySelectorAll(`[data-drop-active]`);
        active = [...active, ...dropActive];
      })
    }

    if (active.length) {
      active.forEach(activeItem => {
        activeItem.removeAttribute('data-drop-active');
        if (activeItem.closest('#search-form')) {
          document.querySelector('#search-form').dispatchEvent(new CustomEvent('close-search-dropdown'));
        }
      })
    }
  }

  #isDropBtn(node) {
    const isBtn = node.classList.contains(this.options.btnSelector);
    const isBtnChild = !!node.closest(this.options.btnSelector);

    return isBtn || isBtnChild;
  }

  #closeOther(targetNode) {
    if (this.options.closeOther && window.screen.availWidth > this.options.notCloseOther) {
      const active = this.options.parentNode.querySelectorAll(`[${this.#dataStr}]`);

      if (active.length) {
        active.forEach(active => {
          if (this.#getItemParent(targetNode) === active) return;

          this.#close(active);
        })
      }
    }
  }

  #close(node) {
    if (this.options.animate) {
      const body = node.querySelector(this.options.bodySelector);

      node.querySelector(this.options.bodySelector).style.height = 0;
    }
    node.removeAttribute(this.#dataStr);
    if (node.closest('#search-form')) {
      document.querySelector('#search-form').dispatchEvent(new CustomEvent('close-search-dropdown'));
    }
  }

  #open(node) {
    if (this.options.animate) {
      const bodyHeight = this.#getBodyHeight(node);
      node.querySelector(this.options.bodySelector).style.height = `${bodyHeight}px`;
    }
    node.setAttribute(this.#dataStr, '');
  }

  #isActive(node) {
    const parent = node.classList.contains(this.options.itemSelector) ?
      node :
      node.closest(this.options.itemSelector);

    return parent.hasAttribute(this.#dataStr);
  }

  #getBodyHeight(node) {
    let body = node.classList.contains(this.options.bodySelector) ?
      node :
      node.querySelector(this.options.bodySelector);

    if (!body) return

    return body.scrollHeight;
  }

  #getItemParent(node) {
    return node.classList.contains(this.options.itemSelector) ?
      node :
      node.closest(this.options.itemSelector);
  }
}

class AroyaDropdowns {
  make() {
    // FAQ
    const faqDropdowns = document.querySelectorAll('.faq-body__items');
    if (faqDropdowns.length) {
      faqDropdowns.forEach(faqDropdown => {
        new Dropdown({
          parentNode: faqDropdown,
          animate: true,
          closeOther: true,
        });
      })
    }

    // Search form
    const searchFormDropdowns = document.querySelectorAll('.search-form .search-form__items > .tab');

    if (searchFormDropdowns.length) {
      searchFormDropdowns.forEach(dropdown => {
        new Dropdown({
          parentNode: dropdown,
          closeOther: true,
          closeSelectors: ['.search-form__item-body-close', '.search-form__item-ok-btn']
        })
      })
    }
  }
}

export default new AroyaDropdowns();