import { throttle } from './helpers';

class Footer {
  make() {
    /***** FOOTER TOGGLE NAV *****/
    const footer = document.querySelector('.footer');
    const scrollTopBtn = document.querySelector('.scroll-top-btn');

    if (footer) {
      footer.addEventListener('click', evt => {
        if (evt.target.matches('.footer-nav__item-title') || evt.target.closest('.footer-nav__item-title') && screen.availWidth <= 1400) {
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

    if (scrollTopBtn) {
      window.addEventListener('scroll', throttle(() => {
        window.scrollY > window.innerHeight
          ? scrollTopBtn.classList.add("show")
          : scrollTopBtn.classList.remove("show");
      }, 50))
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      })
    }
    /***** END FOOTER TOGGLE NAV *****/
  }
}

export default new Footer();