export class SearchPanelControls {
  init() {
    this.checkboxClearBtnInit();
    this.clearDateBtnInit();
    this.searchInputInit();
    this.counterBtnsInit();
  }

  constructor(searchFormNode) {
    this.searchFormNode = searchFormNode;
  }

  clearDateBtnInit() {
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
  }

  checkboxClearBtnInit() {
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

  getSumCounterValues() {
    const counters = this.searchFormNode.querySelectorAll('[data-counter]');

    return Array.from(counters).reduce((sum, item) => {
      return sum + +item.value;
    }, 0);
  }

  counterBtnsInit() {
    const guestCounterItems = this.searchFormNode.querySelectorAll('.search-form__guest');
    const maxSoloValue = 14;
    const maxSumValue = 15;

    if (guestCounterItems.length) {
      guestCounterItems.forEach(item => {
        const plusBtn = item.querySelector('[data-counter-plus]');
        const minusBtn = item.querySelector('[data-counter-minus]');
        const counter = item.querySelector('[data-counter]');

        plusBtn.addEventListener('click', () => {
          const value = +counter.value;
          const nextValue = value + 1;

          if (nextValue <= maxSoloValue && this.getSumCounterValues() <= maxSumValue) {
            counter.value = nextValue;
            counter.setAttribute('value', nextValue);
            minusBtn.removeAttribute('disabled');
          }

          if (nextValue == maxSoloValue) {
            plusBtn.setAttribute('disabled', '');
          }

          if (this.getSumCounterValues() >= maxSumValue) {
            guestCounterItems.forEach(item => item.querySelector('[data-counter-plus]').setAttribute('disabled', ''));
          }
        })

        minusBtn.addEventListener('click', () => {
          const value = +counter.value;
          const nextValue = value - 1;
          const isAdult = counter.getAttribute('name') === 'adult';

          if ((nextValue >= 0 && !isAdult) || (isAdult && nextValue >= 1)) {
            counter.value = nextValue;
            counter.setAttribute('value', nextValue);
            minusBtn.removeAttribute('disabled');
            plusBtn.removeAttribute('disabled');
          }

          if (nextValue <= 0 || (isAdult && nextValue <= 1)) {
            minusBtn.setAttribute('disabled', '');
          }

          if (this.getSumCounterValues() < maxSumValue) {
            this.searchFormNode.querySelectorAll('.search-form__guest').forEach(item => {
              const counter = item.querySelector('[data-counter]');
              const plusBtn = item.querySelector('[data-counter-plus');

              if(counter.value < maxSoloValue) {
                plusBtn.removeAttribute('disabled');
              }
            })
          }
        })
      })
    }
  }
}
