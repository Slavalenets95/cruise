class Dropdowns {

  body = document.querySelector('body');

  initDropdowns() {
    const dropDowns = document.querySelectorAll('[data-dropdown-btn]');

    if (dropDowns.length) {
      dropDowns.forEach(dropdownBtn => {
        dropdownBtn.addEventListener('click', function () {
          const activeDropdownBtn = document.querySelector('[data-dropdown-btn][data-active]');
          const activeDropdownBody = document.querySelector('[data-dropdown-body][data-active]');
          const dropdownBody = dropdownBtn.closest('[data-dropdown-parent]').querySelector('[data-dropdown-body]');
          const isSearchForm = dropdownBtn.closest('#search-form');

          // Close other dropdown
          if (activeDropdownBtn && activeDropdownBtn !== dropdownBtn) {
            activeDropdownBtn.removeAttribute('data-active');
          }
          if (activeDropdownBody && activeDropdownBody !== dropdownBody) {
            if(isSearchForm) dropdownBtn.closest('#search-form').dispatchEvent(new CustomEvent('close-search-dropdown'));
            activeDropdownBody.removeAttribute('data-active');
          }

          // Toggle current dropdown
          if (dropdownBody) {
            dropdownBody.toggleAttribute('data-active');
            dropdownBtn.toggleAttribute('data-active');
          }
        })
      })
      this.body.addEventListener('click', this.closeActiveDropdown);
    }
  }

  closeActiveDropdown(evt, flag = false) {
    const isDropdownClick = evt.target.hasAttribute('data-dropdown-parent');
    const isDropdownChildClick = evt.target.closest('[data-dropdown-parent]');
    const activeDropdown = document.querySelector('[data-dropdown-body][data-active]');
    const activeDropdownBtn = document.querySelector('[data-dropdown-btn][data-active]');

    if ((isDropdownClick || isDropdownChildClick || !activeDropdown) && !flag) return;

    if (activeDropdown.closest('#search-form') && activeDropdown) {
      document.querySelector('#search-form').dispatchEvent(new CustomEvent('close-search-dropdown'));
    }

    if (activeDropdown) {
      activeDropdown.removeAttribute('data-active');
    }
    if (activeDropdownBtn) {
      activeDropdownBtn.removeAttribute('data-active');
    }
  }
  make() {
    this.initDropdowns();
    const okMonthpickerBtn = document.querySelector('.search-form__dates-ok');
    if (okMonthpickerBtn) {
      okMonthpickerBtn.addEventListener('click', evt => this.closeActiveDropdown(evt, true));
    }
  }
}

export default new Dropdowns();