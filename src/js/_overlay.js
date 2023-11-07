class Overlay {
  make() {
    const overlay = document.querySelector('.overlay');
    overlay.addEventListener('click', () => {
      const activeEls = document.querySelectorAll('[data-active]');
      if (activeEls.length) {
        activeEls.forEach((activeEl) => activeEl.removeAttribute('data-active'));
      }
    })
  }
}

export default new Overlay();