class Cookies {
  cookieBox = document.querySelector('.cookies');
  cookieBtns = document.querySelectorAll(".cookies button");

  isSetCookies() {
    return document.cookie.includes("aroyaCookies");
  }

  make() {
    if (this.isSetCookies()) return;
    this.cookieBox.setAttribute('data-show', '');

    this.cookieBtns.forEach(btn => {
      btn.addEventListener('click', (evt) => {
        this.cookieBox.removeAttribute('data-show');
        
        if (evt.target.hasAttribute('data-accept')) {
          document.cookie = "cookieBy= aroyaCookies; max-age=" + 60 * 60 * 24 * 30;
        }
      })
    })
  }
}

export default new Cookies();