class Header {

  make() {
    /***** HEADER  *****/
    const headerNav = document.querySelector('.header-nav');
    const header = document.querySelector('.header');
    const overlay = document.querySelector('.overlay');
    const body = document.querySelector('body');

    if (headerNav && header) {

      /***** MENU *****/
      headerNav.addEventListener('click', evt => {
        if (evt.target.matches('.header-nav__list-control')) {
          const activeEls = headerNav.querySelectorAll('[data-active]');
          const parent = evt.target.closest('.header-nav__list-item');
          const subMenu = parent.querySelector('.header-nav__sub-wrapper');

          activeEls?.forEach(activeEl => {
            if (activeEl !== evt.target && activeEl !== subMenu) activeEl.removeAttribute('data-active');
          });

          evt.target.toggleAttribute('data-active');
          subMenu?.toggleAttribute('data-active');
        }

        if (evt.target.matches('.header-nav__sub-control') && window.screen.availWidth < 1400) {
          const parent = evt.target.closest('.header-nav__sub-wrapper');
          const activeEls = parent.querySelectorAll('[data-active]');
          const subMenu = evt.target.closest('.header-nav__sub-row').querySelector('.header-nav__sub-list');
          const subMenuHeight = subMenu.scrollHeight;

          activeEls?.forEach(activeEl => {
            if (activeEl !== evt.target && activeEl !== subMenu) {
              activeEl.removeAttribute('data-active');
              if (activeEl.matches('.header-nav__sub-list')) {
                activeEl.style.height = '0px';
              }
            }
          });

          if (!subMenu.hasAttribute('data-active')) {
            subMenu.style.height = subMenuHeight + 'px';
          } else {
            subMenu.style.height = '0px';
          }
          evt.target.toggleAttribute('data-active');
          subMenu.toggleAttribute('data-active');
        }

        if (evt.target.matches('.header-nav__sub-back') && window.screen.availWidth < 1400) {
          const parent = evt.target.closest('.header-nav__list-item');
          const activeEls = parent.querySelectorAll('[data-active]');
          const subLists = parent.querySelectorAll('.header-nav__sub-list');

          activeEls.forEach((activeEl) => activeEl.removeAttribute('data-active'));
          subLists.forEach((subList) => subList.style.height = '0');
        }
      })

      headerNav.addEventListener('mouseleave', function () {
        const activeEls = headerNav.querySelectorAll('[data-active]');
        activeEls?.forEach(activeEl => activeEl.removeAttribute('data-active'));
      })
      /***** END MENU *****/

      /***** SEARCH *****/
      const searchBtn = header.querySelector('.header-ui__search-btn');
      const searchContainer = header.querySelector('.search');
      const searchCloseBtn = header.querySelector('.search-header-close');
      const searchBg = header.querySelector('.search-bg')

      if (searchBtn && searchContainer) {
        searchBtn.addEventListener('click', () => {
          searchBtn.toggleAttribute('data-active');
          searchContainer.toggleAttribute('data-active');
          searchBg.toggleAttribute('data-active')
        })
      }

      if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', () => {
          searchBtn.removeAttribute('data-active');
          searchContainer.removeAttribute('data-active');
          searchBg.removeAttribute('data-active')
        })
      }
      /***** END SEARCH *****/

      /***** MOBILE MENU *****/
      const mobileMenuControl = document.querySelector('.header-ui__hamb-btn');
      if (mobileMenuControl) {
        mobileMenuControl.addEventListener('click', function () {
          body.toggleAttribute('menu-open')
          mobileMenuControl.toggleAttribute('data-active');
          headerNav.toggleAttribute('data-active');
          overlay.toggleAttribute('data-active');
          document.querySelector('html').toggleAttribute('data-noscroll');
        })
      }
      /***** END MOBILE MENU *****/
    }
    /***** END HEADER *****/
  }
}

export default new Header();