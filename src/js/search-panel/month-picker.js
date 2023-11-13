export class SearchPanelMonthPicker {
  init(correctDates) {
    const searchMonthPicker = document.querySelector('.search-form__dates');
    if (searchMonthPicker) {
      const allMonths = searchMonthPicker.querySelectorAll('[data-date]');
      // Disable not correct values
      Array.from(allMonths).forEach(monthEl => {
        const dateString = monthEl.getAttribute('data-date');
        if (!correctDates.has(dateString)) {
          monthEl.removeAttribute('data-active');
          monthEl.setAttribute('data-disable', '');
        }
      })
      const transformAllMonth = Array.from(allMonths).map(monthEl => {
        return {
          el: monthEl,
          date: new Date(monthEl.getAttribute('data-date')),
        }
      });

      allMonths.forEach(monthBtn => {
        monthBtn.addEventListener('click', (evt) => {
          const isDisable = evt.target.hasAttribute('data-disable');
          const maxDate = this.getMaxSelectedDate(transformAllMonth);
          const minDate = this.getMinSelectedDate(transformAllMonth);

          if (!isDisable) evt.target.toggleAttribute('data-active');

          const targetDateTime = new Date(evt.target.getAttribute('data-date')).getTime();

          if (maxDate && minDate) {
            if (targetDateTime > maxDate.date.getTime()) {
              const betweenMaxDates = transformAllMonth.filter(i => {
                return !i.el.hasAttribute('data-disable') &&
                  i.date.getTime() > maxDate.date.getTime() &&
                  i.date.getTime() < targetDateTime;
              })
              betweenMaxDates.forEach(i => i.el.setAttribute('data-active', ''));
            } else if (targetDateTime < minDate.date.getTime()) {
              const betweenMinDates = transformAllMonth.filter(i => {
                return !i.el.hasAttribute('data-disable') &&
                  i.date.getTime() < minDate.date.getTime() &&
                  i.date.getTime() > targetDateTime;
              })
              betweenMinDates.forEach(i => i.el.setAttribute('data-active', ''));
            } //else if(targetDateTime < maxDate.getTime())
          }
        })
      })
    }
  }

  getMaxSelectedDate(transformAllMonth) {
    const activeEls = transformAllMonth.filter(i => i.el.hasAttribute('data-active'));
    const dates = activeEls.map(i => i.date);
    const maxDate = Math.max.apply(null, dates);
    return activeEls.filter(i => i.date.getTime() === maxDate)[0];
  }

  getMinSelectedDate(transformAllMonth) {
    const activeEls = transformAllMonth.filter(i => i.el.hasAttribute('data-active'));
    const dates = activeEls.map(i => i.date);
    const minDate = Math.min.apply(null, dates);
    return activeEls.filter(i => i.date.getTime() === minDate)[0];
  }
}
