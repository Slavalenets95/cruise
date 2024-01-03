import './scss/app.scss';
import SearchPanel from './js/_search-panel';
import Overlay from './js/_overlay';
import Dropdowns from './js/_dropdowns';
import Header from './js/_header';
import Footer from './js/_footer';
import Faq from './js/_faq';
import Sliders from './js/_sliders';
// import Scroller from './js/_scroller';
import Forms from './js/_forms';
import Tabs from './js/_tabs';
import Popup from './js/_popup';
import PopupSlider from './js/_popupSlider';
import { throttle } from './js/helpers';
import GallerySlider from './js/_gallery-slider';
import Cookies from './js/_cookies';
// import Youtube from './js/_youtube';

window.addEventListener('load', () => {
  Header.make();
  Footer.make();
  Faq.make();
  Overlay.make();
  // SearchPanel.make();
  Dropdowns.make();
  Sliders.make();
  // Scroller.make();
  Forms.make();
  Tabs.make();
  Popup.make();
  PopupSlider.make();
  GallerySlider.init();
  Cookies.make();
  // Youtube.make();
})

/***** REINITIALIZATION *****/
function reInit() {
  // Scroller.reInit();
  Sliders.reInit();
  Faq.reinit();
  GallerySlider.reinit();
}

window.addEventListener('resize', throttle(reInit, 100));
window.addEventListener('orientationchange', reInit);
/***** END REINITALIZATION *****/