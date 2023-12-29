class Overlay {
  make() {
    const overlay = document.querySelector('.overlay');
    const body = document.querySelector('body');
    overlay.addEventListener('click', () => {
      const activeEls = document.querySelectorAll('[data-active]');
      const popupActive = document.querySelectorAll('[data-popup-active]');
      body.removeAttribute('menu-open');
      document.querySelector('html').removeAttribute('data-noscroll');
      overlay.removeAttribute('data-overlay-active');
      if (activeEls.length) {
        activeEls.forEach((activeEl) => activeEl.removeAttribute('data-active'));
      }
      if(popupActive.length) {
        popupActive.forEach(activePopup => {
          activePopup.removeAttribute('data-popup-active');
          activePopup.querySelector('video')?.pause();
        });
      }
    })
  }
}

export default new Overlay();