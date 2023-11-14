class Overlay {
  make() {
    const overlay = document.querySelector('.overlay');
    const body = document.querySelector('body');
    overlay.addEventListener('click', () => {
      const activeEls = document.querySelectorAll('[data-active]');
      body.removeAttribute('menu-open');
      document.querySelector('html').removeAttribute('data-noscroll');
      if (activeEls.length) {
        activeEls.forEach((activeEl) => activeEl.removeAttribute('data-active'));
      }
    })
  }
}

export default new Overlay();