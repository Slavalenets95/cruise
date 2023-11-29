export class SearchPanelMonthPicker {
  searchFormNode = document.querySelector('.search-form');

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
          const targetDateTime = new Date(evt.target.getAttribute('data-date')).getTime();
          const selectedText = evt.target.closest('.search-form__item').querySelector('[data-selected-text]');

          if (maxDate && minDate && targetDateTime < maxDate.date.getTime() && targetDateTime > minDate.date.getTime()) {
            evt.target.toggleAttribute('data-active');
            setTimeout(() => {
              evt.target.toggleAttribute('data-active');
            }, 300)
            return;
          }

          if (!isDisable) evt.target.toggleAttribute('data-active');

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
            }
          }
          const selectedCount = this.searchFormNode.querySelectorAll('[data-date][data-active]').length;
          switch(selectedCount) {
            case 0 :
              selectedText.textContent = 'Any Date';
              break;
            default :
              selectedText.textContent = `Select: ${selectedCount}`;
              break;
          }
          this.setClearAllBtn();
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

  isFormEmpty() {
    const checkboxEmpty = this.searchFormNode.querySelectorAll('input[type="checkbox"]:checked').length;
    const dateEmpty = this.searchFormNode.querySelectorAll('[data-date][data-active]').length;
    const adultsValue = this.searchFormNode.querySelector('input[name="adult"')?.value;
    const childrenValue = this.searchFormNode.querySelector('input[name="children"]')?.value;
    const infantsValue = this.searchFormNode.querySelector('input[name="infants"]')?.value;

    return !checkboxEmpty && !dateEmpty && +adultsValue === 1 && +childrenValue === 0 && +infantsValue === 0;
  }

  setClearAllBtn() {
    const clearAll = this.searchFormNode.querySelector('.search-form__clear-all');

    if(!clearAll) return;

    if(this.isFormEmpty()) {
      clearAll.setAttribute('disabled', '');
    } else {
      clearAll.removeAttribute('disabled');
    }
  }
}
