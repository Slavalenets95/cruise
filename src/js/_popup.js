class Popup {
  settings = {
    popup: null,
    btn: null,
    autoShow: null,
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
    if ((this.settings.btn || this.settings.autoShow) && this.settings.popup) {
      if (this.settings.btn) {
        this.settings.btn.addEventListener('click', (evt) => {
          if (this.overlay) {
            this.overlay.setAttribute('data-overlay-active', '');
          }
          this.settings.popup.toggleAttribute('data-popup-active');
        })
      }
      const closeBtn = this.settings.popup.querySelector('[data-popup-close]');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closePopup())
      }
      document.addEventListener('keydown', (evt) => {
        const key = evt.key;
        if (key === "Escape") {
          this.closePopup();
        }
      });
      if (this.settings.autoShow) {
        this.autoShow();
      }
    }
  }

  closePopup() {
    this.settings.popup.removeAttribute('data-popup-active');
    if (this.overlay) {
      this.overlay.removeAttribute('data-overlay-active');
    }
    if(this.settings.popup.querySelector('video')) {
      this.settings.popup.querySelector('video').pause();
    }
    if(this.settings.popup.querySelector('iframe')) {
      this.settings.popup.querySelector('iframe').contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
  }

  autoShow() {
    const popupClass = this.settings.popup.classList[0];
    const LS_KEY = `${popupClass}_shown`;

    if (!sessionStorage.getItem(LS_KEY) && !document.cookie.includes("subscribeUser")) {
      setTimeout(() => {
        if(!document.querySelector('[data-popup-active]')) {
          if (this.overlay) {
            this.overlay.setAttribute('data-overlay-active', '');
          }
          this.settings.popup.toggleAttribute('data-popup-active');
          sessionStorage.setItem(LS_KEY, '1');
        }
      }, 20 * 1000);
    }
  }
}

class AroyaPopup {
  make() {
    const cruisePopups = document.querySelectorAll('.information-cards__item');
    if (cruisePopups.length) {
      cruisePopups.forEach((popup, idx) => {
        new Popup({
          popup: document.querySelector('.information-cards__popup:nth-child(' + (idx + 1) + ')'),
          btn: popup
        })
      })
    }
    const signPopup = document.querySelector('.sign-popup');
    if (signPopup) {
      new Popup({
        popup: signPopup,
        autoShow: true,
      })
    }
    const videoPopup = document.querySelector('.video-popup');
    const videoPopupBtn = document.querySelector('.home-intro__video-slide-controls .section-links__item:first-child');
    if (videoPopup && videoPopupBtn) {
      new Popup({
        popup: videoPopup,
        btn: videoPopupBtn,
      })
    }
  }
}

export default new AroyaPopup();