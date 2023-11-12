import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class Scroller {

  make() {
    let scroller = document.querySelector('.custom-scroll')
    const isMobile = screen.availWidth <= 768;

    if (scroller && !isMobile) {
      const direction = document.querySelector('html').getAttribute('dir');
      let xPercent = null;
      let x = scroller.scrollWidth * -1;

      if (direction === 'rtl') {
        x = scroller.scrollWidth - scroller.offsetWidth;
      } else {
        xPercent = 100;
      }
      gsap.to('.custom-scroll', {
        x: () => x,
        xPercent: xPercent,
        scrollTrigger: {
          trigger: '.custom-scroll',
          start: 'center center',
          end: `+=${scroller.scrollWidth}px`,
          pin: 'body',
          scrub: true,
          invalidateOnRefresh: true,
          ease: "power1.inOut"
        }
      })
    }
  }
}

export default new Scroller();