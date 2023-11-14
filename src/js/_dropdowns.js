class Dropdowns {

  body = document.querySelector('body');

  // initDropdowns() {
  //   const dropDowns = document.querySelectorAll('[data-dropdown-btn]');

  //   if (dropDowns.length) {
  //     dropDowns.forEach(dropdownBtn => {
  //       dropdownBtn.addEventListener('click', function () {
  //         const activeDropdownBtn = document.querySelector('[data-dropdown-btn][data-active]');
  //         const activeDropdownBody = document.querySelector('[data-dropdown-body][data-active]');
  //         const dropdownBody = dropdownBtn.closest('[data-dropdown-parent]').querySelector('[data-dropdown-body]');
  //         const isSearchForm = dropdownBtn.closest('#search-form');

  //         // Close other dropdown
  //         if (activeDropdownBtn && activeDropdownBtn !== dropdownBtn) {
  //           activeDropdownBtn.removeAttribute('data-active');
  //         }
  //         if (activeDropdownBody && activeDropdownBody !== dropdownBody) {
  //           if(isSearchForm) dropdownBtn.closest('#search-form').dispatchEvent(new CustomEvent('close-search-dropdown'));
  //           activeDropdownBody.removeAttribute('data-active');
  //         }

  //         // Toggle current dropdown
  //         if (dropdownBody) {
  //           dropdownBody.toggleAttribute('data-active');
  //           dropdownBtn.toggleAttribute('data-active');
  //         }
  //       })
  //     })
  //     this.body.addEventListener('click', this.closeActiveDropdown);
  //   }
  // }

  // closeActiveDropdown(evt, flag = false) {
  //   const isDropdownClick = evt.target.hasAttribute('data-dropdown-parent');
  //   const isDropdownChildClick = evt.target.closest('[data-dropdown-parent]');
  //   const activeDropdown = document.querySelector('[data-dropdown-body][data-active]');
  //   const activeDropdownBtn = document.querySelector('[data-dropdown-btn][data-active]');

  //   if ((isDropdownClick || isDropdownChildClick || !activeDropdown) && !flag) return;

  //   if (activeDropdown.closest('#search-form') && activeDropdown) {
  //     document.querySelector('#search-form').dispatchEvent(new CustomEvent('close-search-dropdown'));
  //   }

  //   if (activeDropdown) {
  //     activeDropdown.removeAttribute('data-active');
  //   }
  //   if (activeDropdownBtn) {
  //     activeDropdownBtn.removeAttribute('data-active');
  //   }
  // }

  make() {
    const dropdowns = document.querySelectorAll('[data-dropdown-parent]');

    if(dropdowns.length) {
      dropdowns.forEach(dropdown => {
        const activeDropdown = dropdown.querySelector('[data-dropdown][data-dropdown-active]');
        const activeDropdownBody = dropdown.querySelector('[data-dropdown][data-dropdown-active] [data-dropdown-body]');
        if(activeDropdown && activeDropdownBody) {
          activeDropdownBody.style.height = activeDropdownBody.scrollHeight + 'px';
        }
        
        dropdown.addEventListener('click', evt => {
          const isDropdownBtn = evt.target.hasAttribute('data-dropdown-btn') || evt.target.closest('[data-dropdown-btn]');

          if(isDropdownBtn) {
            const noToggle = dropdown.hasAttribute('data-dropdown-notoggle');
            const activeDropdown = dropdown.querySelector('[data-dropdown][data-dropdown-active]');
            const activeDropdownBody = dropdown.querySelector('[data-dropdown][data-dropdown-active] [data-dropdown-body]');
            const targetDropdown = evt.target.closest('[data-dropdown]');
            const targetDropdownBody = targetDropdown.querySelector('[data-dropdown-body]');
            const sameDropdown = targetDropdown === activeDropdown;
            const targetDropdownBodyHeight = targetDropdownBody.scrollHeight;

            if(activeDropdown) {
              const isSearchFormDropdown = activeDropdown.closest('#search-form');

              activeDropdown.removeAttribute('data-dropdown-active');

              if(isSearchFormDropdown) {
                document.querySelector('#search-form').dispatchEvent(new CustomEvent('close-search-dropdown'));
              }
              if(!noToggle) {
                if(!activeDropdownBody.style.height) {
                  activeDropdownBody.style.height = `${targetDropdownBodyHeight}px`;
                  setTimeout(() => activeDropdownBody.style.height = '0px', 0)
                } else {
                  activeDropdownBody.style.height = '0px'
                }
              }
            }

            if(!sameDropdown) {
              targetDropdown.setAttribute('data-dropdown-active', '');
              if(!noToggle) {
                targetDropdownBody.style.height = `${targetDropdownBodyHeight}px`;
              }
            }
          }
        })
      })
    }

    this.body.addEventListener('click', function(evt) {
      const isDropdownBody = evt.target.hasAttribute('data-dropdown-body') || evt.target.closest('[data-dropdown-body]');
      const isDropdownBtn = evt.target.hasAttribute('data-dropdown-btn') || evt.target.closest('[data-dropdown-btn]');
      const activeDropdown = document.querySelector('[data-dropdown-parent]:not([data-dropdown-noclose-body]) [data-dropdown][data-dropdown-active]');

      if(isDropdownBody) return;

      if(activeDropdown && !isDropdownBtn) {
        const isSearchFormDropdown = activeDropdown.closest('#search-form');
        if(isSearchFormDropdown) {
          document.querySelector('#search-form').dispatchEvent(new CustomEvent('close-search-dropdown'));
        }
        activeDropdown.removeAttribute('data-dropdown-active');
      }
    })

    // this.initDropdowns();
    // const okMonthpickerBtn = document.querySelector('.search-form__dates-ok');
    // if (okMonthpickerBtn) {
    //   okMonthpickerBtn.addEventListener('click', evt => this.closeActiveDropdown(evt, true));
    // }
  }
}

export default new Dropdowns();