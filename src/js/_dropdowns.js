class Dropdowns {

  body = document.querySelector('body');

  reInit() {
    const activeDropdowns = document.querySelectorAll('[data-dropdown][data-dropdown-active]');
    
    if(activeDropdowns.length) {
      activeDropdowns.forEach(dropdown => {
        const noToggle = dropdown.hasAttribute('data-dropdown-notoggle');
        const activeDropdownBody = dropdown.querySelector('[data-dropdown-body]');
        
        if(!noToggle && activeDropdownBody) {
          activeDropdownBody.style.height = 'auto';
        }
      })
    }
  }

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
                if(!activeDropdownBody.style.height || activeDropdownBody.style.height === 'auto') {
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