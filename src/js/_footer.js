class Footer {
  make() {
    /***** FOOTER TOGGLE NAV *****/
    const footer = document.querySelector('.footer');

    if (footer) {
      footer.addEventListener('click', evt => {
        if (evt.target.matches('.footer-nav__item-title') && screen.availWidth <= 1400) {
          const parent = evt.target.closest('.footer-nav__item');
          const subMenu = parent.querySelector('.footer-nav__list');
          const subMenuHeight = subMenu.scrollHeight;

          if (!subMenu.hasAttribute('data-active')) {
            subMenu.style.height = subMenuHeight + 'px';
          } else {
            subMenu.style.height = 0;
          }
          subMenu.toggleAttribute('data-active');
        }
      })
    }
    /***** END FOOTER TOGGLE NAV *****/
  }
}

export default new Footer();