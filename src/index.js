import './scss/app.scss';
import SearchPanel from './js/_search-panel';
import Overlay from './js/_overlay';
import Dropdowns from './js/_dropdowns';
import Header from './js/_header';
import Footer from './js/_footer';
import Faq from './js/_faq';
import Sliders from './js/_sliders';
import Scroller from './js/_scroller';
import Forms from './js/_forms';
import Tabs from './js/_tabs';

// Need add reinit
// // Throttling Function
// const throttle = (func, delay) => {
//   let prev = 0;
//   return (...args) => {
//     let now = new Date().getTime();

//     if (now - prev > delay) {
//       prev = now;
//       return func(...args);
//     }
//   }
// }
// /***** REINITIALIZATION *****/
// // function reInit() {
// //   isMobile = window.screen.availWidth <= 600;
// //   initializeGallerySliders(gallerySliders);
// // }
// // window.addEventListener('resize', throttle(reInit, 1000));
// // window.addEventListener('orientationchange', reInit);
// /***** END REINITALIZATION *****/

window.addEventListener('load', () => {
  Header.make();
  Footer.make();
  Faq.make();
  Overlay.make();
  SearchPanel.make();
  Dropdowns.make();
  Sliders.make();
  Scroller.make();
  Forms.make();
  Tabs.make();
})