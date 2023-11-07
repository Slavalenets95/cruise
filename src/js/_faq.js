class Faq {
  make() {
    const faqSection = document.querySelector('.page-faq');

    if (faqSection) {
      const activeEl = faqSection.querySelector('.page-faq__item[data-active]');
      if (activeEl) {
        const activeElItemBodyHeight = activeEl.querySelector('.page-faq__item-body').scrollHeight;
        activeEl.querySelector('.page-faq__item-body').style.height = `${activeElItemBodyHeight}px`;
      }
      faqSection.addEventListener('click', function (evt) {
        const isItemHeaderClick = evt.target.classList.contains('page-faq__item-btn') || !!evt.target.closest('.page-faq__item-btn');
        if (isItemHeaderClick) {
          const itemWrapper = evt.target.closest('.page-faq__item');
          const itemBody = itemWrapper?.querySelector('.page-faq__item-body');
          const itemBodyHeight = itemBody?.scrollHeight;
          const isActive = itemWrapper.hasAttribute('data-active');

          itemWrapper.toggleAttribute('data-active');

          if (isActive) {
            itemBody.style.height = '0px';
          } else {
            itemBody.style.height = `${itemBodyHeight}px`;
          }
        }
      })
    }
  }
}

export default new Faq();