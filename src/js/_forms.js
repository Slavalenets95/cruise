import { wrap } from "gsap";

class Forms {
  selectChangeColor() {
    const selects = document.querySelectorAll('[data-select]');
    const selectWrappers = document.querySelectorAll('.select-wrapper');
    const body = document.querySelector('body');

    if(selects.length) {
      selects.forEach(select => {
        select.addEventListener('change', (evt) => {
          if(evt.target.value) {
            evt.target.setAttribute('data-selected' , '');
          } else {
            evt.target.removeAttribute('data-selected');
          }
        })
      })
    }

    if(selectWrappers.length) {
      body.addEventListener('click', (evt) => {
        const openedSelectWrapper = document.querySelectorAll('[data-select-open]');
        
        if(openedSelectWrapper.length && evt.target.tagName.toLowerCase() !== 'select') {
          openedSelectWrapper.forEach(wrapper => wrapper.removeAttribute('data-select-open'));
        }
      })
      selectWrappers.forEach(wrapper => {
        const select = wrapper.querySelector('select');

        if(select) {
          select.addEventListener('click', () => {
            if(wrapper.hasAttribute('data-select-open')) {
              wrapper.removeAttribute('data-select-open');
            } else {
              wrapper.setAttribute('data-select-open', '');
            }
          })
        }
      })
    }
  }
  make() {
    this.selectChangeColor();
  }
}

export default new Forms();