import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class Scroller {
  scrollerNode = null;
  scrollerScrollTrigger = null;
  isMobile = screen.availWidth <= 768;
  direction = 'ltr';

  reInit() {
    this.isMobile = screen.availWidth <= 768;

    if(this.scrollerNode && this.scrollerScrollTrigger) {
      if(this.isMobile) {
        this.scrollerScrollTrigger.scrollTrigger.disable();
      } else {
        this.scrollerScrollTrigger.scrollTrigger.enable();
      }
    }

    if(!this.scrollerScrollTrigger && this.scrollerNode) {
      this.gsapInit();
    }
  }

  getX() {
    let x = this.scrollerNode.scrollWidth * -1;

    if (this.direction === 'rtl') {
      x = this.scrollerNode.scrollWidth - this.scrollerNode.offsetWidth;
    }

    return x;
  }

  getXpercent() {
    let xPercent = null;

    if (this.direction !== 'rtl') {
      xPercent = 100;
    }

    return xPercent;
  }

  gsapInit() {
    this.scrollerNode = document.querySelector('.custom-scroll');
    this.isMobile = screen.availWidth <= 768;

    if (this.scrollerNode && !this.isMobile) {
      this.direction = document.querySelector('html').getAttribute('dir');
      this.scrollerScrollTrigger = gsap.to('.custom-scroll', {
        x: () => this.getX(),
        xPercent: this.getXpercent(),
        scrollTrigger: {
          trigger: '.custom-scroll',
          start: 'center center',
          direction: 'horizontal',
          end: `+=${document.querySelector('.custom-scroll').scrollWidth}px`,
          pin: 'body',
          scrub: true,
          invalidateOnRefresh: true,
          ease: "power1.inOut"
        },
      })
    }
  }

  make() {
    this.gsapInit();
  }
}

export default new Scroller();