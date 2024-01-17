class Header {
  lastScroll = 0;
  body = document.querySelector('body');
  overlay = document.querySelector('.overlay');
  header = document.querySelector('.header');
  headerNav = document.querySelector('.header-main');
  headerHambBtn = document.querySelector('.header-hamb__btn');
  headerSubMenuLinks = document.querySelectorAll('span.header-nav__list-link');

  make() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if(scrollY <= 0) {
      this.header.classList.remove('scrolled');
    }
    if (this.header) {
      window.addEventListener('scroll', () => this.scrollEvent());
    }
    if (this.headerHambBtn && this.headerNav) {
      this.headerHambBtn.addEventListener('click', () => this.hambBtnClick());
    }
    if (this.overlay && this.headerHambBtn && this.headerNav) {
      this.overlay.addEventListener('click', () => this.overlayClick());
    }
    if (this.headerSubMenuLinks.length) {
      this.headerSubMenuLinks.forEach(subLink => {
        subLink.addEventListener('click', (evt) => this.subMenuClick(evt));
      })
    }
  }

  scrollEvent() {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    // Scroll top = 0
    if (scrollPos <= 0) {
      this.header.classList.remove('out');
      this.header.classList.remove('scrolled');
    } else {
      this.header.classList.add('scrolled');
      // Down
      if ((scrollPos > this.lastScroll) && scrollPos >= this.header.offsetHeight) {
        this.header.classList.add('out');
      }
      // Up 
      else if (scrollPos < this.lastScroll) {
        this.header.classList.remove('out');
      }
    }
    this.lastScroll = scrollPos <= 0 ? 0 : scrollPos;
  }

  hambBtnClick() {
    this.headerNav.classList.toggle('show');
    this.headerHambBtn.classList.toggle('close');
    this.body.classList.toggle('no-scroll');
    this.overlay.toggleAttribute('data-active');
    this.closeActiveSubmenu();
  }

  overlayClick() {
    this.headerNav.classList.remove('show');
    this.headerHambBtn.classList.remove('close');
    this.body.classList.remove('no-scroll');
    this.overlay.removeAttribute('data-active');
    this.closeActiveSubmenu();
  }

  subMenuClick(evt) {
    const subMenu = evt.currentTarget.nextElementSibling;
    evt.currentTarget.classList.toggle('active');
    if (subMenu) {
      const subMenuHeight = subMenu.scrollHeight;
      subMenu.offsetHeight ? subMenu.style.height = '0px' : subMenu.style.height = `${subMenuHeight}px`;
    }
  }

  closeActiveSubmenu() {
    const activeEls = this.header.querySelectorAll('.header-nav__list-link.active');
    activeEls.forEach(el => {
      el.classList.remove('active');
      el.nextElementSibling.style.height = '0px';
    })
  }

  reinit() {
    this.overlay.removeAttribute('data-active');
    this.body.classList.remove('no-scroll');
    this.headerHambBtn.classList.remove('close');
    this.headerNav.classList.remove('show');
    this.closeActiveSubmenu();
  }
}

export default new Header();