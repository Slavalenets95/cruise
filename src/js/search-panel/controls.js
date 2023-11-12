export class SearchPanelControls {
  init() {
    this.checkboxClearBtnInit();
    this.clearDateBtnInit();
    this.searchInputInit();
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
}
