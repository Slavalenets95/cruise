import { isAr } from "../helpers";

export class SearchPanelControls {
  isAr = false;

  init() {
    this.checkboxClearBtnInit();
    this.clearDateBtnInit();
    this.searchInputInit();
    this.counterBtnsInit();
    this.checkboxChangeInit();
    this.clearAllInit();
    this.dateOkBtnInit();
    this.clearGuestBtnInit();
  }

  constructor(searchFormNode) {
    this.isAr = isAr();
    this.searchFormNode = searchFormNode;
  }

  clearDateBtnInit() {
    const clearDateButtons = document.querySelectorAll('[data-clear-date]');
    const selectedDatesText = this.searchFormNode.querySelector('.search-form__item-calendar [data-selected-text]');
    if (clearDateButtons.length) {
      clearDateButtons.forEach(clearBtn => {
        clearBtn.addEventListener('click', evt => {
          const parentWrapper = evt.target.closest('[data-clear-parent]');
          if (parentWrapper) {
            const dateItems = parentWrapper.querySelectorAll('[data-date]');
            dateItems.forEach(item => item.removeAttribute('data-active'));
          }
          if (this.isAr) {
            selectedDatesText.textContent = 'جميع التواريخ';
          } else {
            selectedDatesText.textContent = 'Any Date';
          }
          this.setClearAllBtn();
        })
      })
    }
  }

  clearGuestBtnInit() {
    const clearGuestButton = document.querySelector('[data-clear-guest]');
    if (clearGuestButton) {
      const adults = this.searchFormNode.querySelector('input[name="adult"]');
      const children = this.searchFormNode.querySelector('input[name="children"]');
      const infants = this.searchFormNode.querySelector('input[name="infants"]');
      const selectedGuestsText = this.searchFormNode.querySelector('.search-form__item-guests [data-selected-text]');
      const minusCounterBtns = this.searchFormNode.querySelectorAll('[data-counter-minus]');

      clearGuestButton.addEventListener('click', () => {
        adults.value = 1;
        children.value = 0;
        infants.value = 0;
        if (this.isAr) {
          selectedGuestsText.textContent = '1 شخص';
        } else {
          selectedGuestsText.textContent = '1 Person';
        }
        minusCounterBtns.forEach(btn => btn.setAttribute('disabled', ''));
        this.setClearAllBtn();
      })
    }
  }

  dateOkBtnInit() {
    const btn = this.searchFormNode.querySelector('.search-form__dates-ok');
    if (btn) {
      btn.addEventListener('click', (evt) => {
        evt.target.closest('[data-drop-active]').removeAttribute('data-drop-active');
        this.searchFormNode.dispatchEvent(new CustomEvent('close-search-dropdown'));
      })
    }
  }

  checkboxClearBtnInit() {
    const clearButtons = document.querySelectorAll('[data-clear-btn]');
    if (clearButtons.length) {
      clearButtons.forEach(clearBtn => {
        clearBtn.addEventListener('click', function (evt) {
          const clearParent = evt.target.closest('[data-clear-parent]');
          const clearInputs = clearParent.querySelectorAll('input');

          if (clearInputs.length) {
            clearInputs.forEach(input => {
              const inputType = input.type;

              switch (inputType) {
                case 'checkbox':
                  input.checked = false;
                  input.dispatchEvent(new Event('change'));
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
    const selectedText = this.searchFormNode.querySelector('.search-form__item-guests [data-selected-text]');

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

          if (this.isAr) {
            selectedText.textContent = `${this.getSumCounterValues()} شخص`;
          } else {
            if (this.getSumCounterValues() === 1) {
              selectedText.textContent = `${this.getSumCounterValues()} Person`;
            } else {
              selectedText.textContent = `${this.getSumCounterValues()} Persons`;
            }
          }
          this.setClearAllBtn();
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

              if (counter.value < maxSoloValue) {
                plusBtn.removeAttribute('disabled');
              }
            })
          }
          if (this.isAr) {
            selectedText.textContent = `${this.getSumCounterValues()} شخص`;
          } else {
            if (this.getSumCounterValues() === 1) {
              selectedText.textContent = `${this.getSumCounterValues()} Person`;
            } else {
              selectedText.textContent = `${this.getSumCounterValues()} Persons`;
            }
          }
          this.setClearAllBtn();
        })
      })
    }
  }

  checkboxChangeInit() {
    const checkboxes = this.searchFormNode.querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length) {
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (evt) => {
          const parent = evt.target.closest('.search-form__item');
          const selectedText = parent.querySelector('[data-selected-text]');
          const checkedItems = parent.querySelectorAll('input[type="checkbox"]:checked');

          switch (checkedItems.length) {
            case 1:
              const text = parent.querySelector('input[type="checkbox"]:checked').closest('label').querySelector('[data-checkbox-text]').textContent;
              selectedText.textContent = text;
              break;
            case 0:
              if (this.isAr) {
                selectedText.textContent = 'جميع الأماكن';
              } else {
                selectedText.textContent = 'Anywhere';
              }
              break;
            default:
              if (this.isAr) {
                selectedText.textContent = `اختر: ${checkedItems.length}`;
              } else {
                selectedText.textContent = `Select: ${checkedItems.length}`;
              }
              break;
          }
          this.setClearAllBtn();
        })
      })
    }
  }

  clearAllInit() {
    const clearAll = this.searchFormNode.querySelector('.search-form__clear-all');

    if (!clearAll) return;

    clearAll.addEventListener('click', () => {
      const checkboxes = this.searchFormNode.querySelectorAll('input[type="checkbox"]:checked');
      const activeDates = this.searchFormNode.querySelectorAll('[data-date][data-active]');
      const adults = this.searchFormNode.querySelector('input[name="adult"]');
      const children = this.searchFormNode.querySelector('input[name="children"]');
      const infants = this.searchFormNode.querySelector('input[name="infants"]');
      const selectedDatesText = this.searchFormNode.querySelector('.search-form__item-calendar [data-selected-text]');
      const selectedGuestsText = this.searchFormNode.querySelector('.search-form__item-guests [data-selected-text]');
      const minusCounterBtns = this.searchFormNode.querySelectorAll('[data-counter-minus]');

      if (checkboxes.length) {
        checkboxes.forEach(checkbox => {
          checkbox.checked = false;
          checkbox.dispatchEvent(new Event('change'));
        });
      }

      if (activeDates.length) {
        activeDates.forEach(date => date.removeAttribute('data-active'));
      }

      adults.value = 1;
      children.value = 0;
      infants.value = 0;
      if (this.isAr) {
        selectedDatesText.textContent = 'جميع التواريخ';
        selectedGuestsText.textContent = '1 شخص';
      } else {
        selectedDatesText.textContent = 'Any Date';
        selectedGuestsText.textContent = '1 Person';
      }
      minusCounterBtns.forEach(btn => btn.setAttribute('disabled', ''));
      this.searchFormNode.dispatchEvent(new CustomEvent('close-search-dropdown'));
      clearAll.setAttribute('disabled', '');
    })
  }

  isFormEmpty() {
    const checkboxEmpty = this.searchFormNode.querySelectorAll('input[type="checkbox"]:checked').length;
    const dateEmpty = this.searchFormNode.querySelectorAll('[data-date][data-active]').length;
    const adultsValue = this.searchFormNode.querySelector('input[name="adult"')?.value;
    const childrenValue = this.searchFormNode.querySelector('input[name="children"]')?.value;
    const infantsValue = this.searchFormNode.querySelector('input[name="infants"]')?.value;

    return !checkboxEmpty && !dateEmpty && +adultsValue === 1 && +childrenValue === 0 && +infantsValue === 0;
  }

  setClearAllBtn() {
    const clearAll = this.searchFormNode.querySelector('.search-form__clear-all');

    if (!clearAll) return;

    if (this.isFormEmpty()) {
      clearAll.setAttribute('disabled', '');
    } else {
      clearAll.removeAttribute('disabled');
    }
  }
}
