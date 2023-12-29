class Youtube {
  settings = {
    videoId: null,
    wrapperNode: null,
    lazyContentNode: null,
  }

  constructor(settings) {
    Object.keys(settings).forEach(key => {
      this.settings[key] = settings[key];
    })

    this.make();
  }

  make() {
    if(!this.settings.videoId || !this.settings.wrapperNode) return;

    this.settings.lazyContentNode.addEventListener('click', () => {
      this.settings.wrapperNode.classList.add(
        "embed-responsive",
        "embed-responsive-16by9"
      );
      const iframe = document.createElement("iframe");
      iframe.classList.add("embed-responsive-item");
      iframe.src = `https://www.youtube.com/embed/${this.settings.videoId}?autoplay=1&enablejsapi=1`;
      iframe.setAttribute("allow", "autoplay");
      this.settings.lazyContentNode.remove();
      this.settings.wrapperNode.appendChild(iframe);
      // this.appendChild(ytVideoContainer);
    })
  }
}

class AroyaYoutube {
  make() {
    const homeVideoPopup = document.querySelector('.video-popup');
    if(homeVideoPopup) {
      new Youtube({
        videoId: 'IkxP567p8oc',
        wrapperNode: homeVideoPopup.querySelector('.video-popup__wrapper'),
        lazyContentNode: homeVideoPopup.querySelector('.video-popup__content')
      })
    }
  }
}

export default new AroyaYoutube();