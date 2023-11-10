import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class Scroller {

  make() {
    let scroller = document.querySelector('.custom-scroll')

    if(scroller) {
      gsap.to('.custom-scroll', {
        x: () => scroller.scrollWidth * -1,
        xPercent: 100,
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