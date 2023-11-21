class Popup {
  settings = {
    popup: null,
    btn: null
  }
  closeBtns = null;
  overlay = null;

  constructor(settings) {
    this.settings = {
      ...this.settings,
      ...settings
    };
    this.overlay = document.querySelector('.overlay');
    this.make();
  }

  make() {
    if(this.settings.btn && this.settings.popup) {
      this.settings.btn.addEventListener('click', (evt) => {
        if(this.overlay) {
          this.overlay.setAttribute('data-overlay-active', '');
        }
        this.settings.popup.toggleAttribute('data-popup-active');
      })
      const closeBtn = this.settings.popup.querySelector('[data-popup-close]');
      if(closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.settings.popup.removeAttribute('data-popup-active');
          if(this.overlay) {
            this.overlay.removeAttribute('data-overlay-active');
          }
        })
      }
    }
  }
}

class AroyaPopup {
  make() {
    const cruisePopups = document.querySelectorAll('.information-cards__item');
    if(cruisePopups.length) {
      cruisePopups.forEach((popup, idx) => {
        new Popup({
          popup: document.querySelector('.information-cards__popup:nth-child(' + (idx + 1) + ')'),
          btn: popup
        })
      })
    }
  }
}

export default new AroyaPopup();